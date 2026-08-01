import * as cheerio from 'cheerio';
import { Deal, DealCategory, slugify, assignBadges } from './deals';
import { getStockByStoreUrl, normalizeStoreUrl } from './stock';

const SOURCES: { url: string; category: DealCategory }[] = [
  {
    url: 'https://billing.luxvps.net/index.php?rp=/store/kvm-rootservers',
    category: 'kvm-rootserver',
  },
  {
    url: 'https://billing.luxvps.net/index.php?rp=/store/ryzen-kvmservers',
    category: 'ryzen-kvm',
  },
  {
    url: 'https://billing.luxvps.net/index.php?rp=/store/epyc',
    category: 'epyc',
  },
];

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

function parseRam(text: string): string | null {
  const m = text.match(/(\d+(?:\.\d+)?)\s*(GB|MB)\s*(?:RAM|Memory|VRAM)?/i);
  return m ? `${m[1]} ${m[2].toUpperCase()}` : null;
}

function parseCpu(text: string): string | null {
  const m = text.match(/(\d+)\s*(?:x\s*)?(?:vCore|Core|CPU|vCPU)/i);
  return m ? `${m[1]} vCores` : null;
}

function parseDisk(text: string): string | null {
  if (!/NVMe|SSD|HDD|Disk|Storage/i.test(text)) return null;
  const m = text.match(/(\d+(?:\.\d+)?)\s*(GB|TB)\s*(?:NVMe|SSD|HDD|Disk|Storage)?/i);
  return m ? `${m[1]} ${m[2].toUpperCase()} ${text.match(/NVMe/i) ? 'NVMe' : text.match(/SSD/i) ? 'SSD' : 'HDD'}` : null;
}

function parseBandwidth(text: string): string | null {
  if (/unmetered|unlimited/i.test(text)) return 'Unmetered';
  if (/RAM|Memory|VRAM/i.test(text)) return null;
  if (/NVMe|SSD|HDD|Disk|Storage/i.test(text)) return null;
  // Require GB/TB to be followed by a non-letter/non-slash (catches "Gbps", "GB/s" port speeds)
  const m = text.match(/(\d+(?:\.\d+)?)\s*(GB|TB)(?=[^a-zA-Z\/]|$)/i);
  return m ? `${m[1]} ${m[2].toUpperCase()}` : null;
}

function parsePrice(text: string): number | null {
  const cleaned = text.replace(/[^\d.,]/g, '').replace(',', '.');
  const price = parseFloat(cleaned);
  return isNaN(price) ? null : price;
}

function parseLocation(text: string): string | null {
  const m = text.match(/(?:Location|Datacenter|DC):\s*(.+)/i);
  if (m) return m[1].trim();
  const cities = ['Germany', 'Frankfurt', 'Amsterdam', 'Netherlands', 'France', 'Paris', 'USA', 'US', 'UK', 'London'];
  for (const city of cities) {
    if (text.includes(city)) return city;
  }
  return null;
}

function extractSpecsFromFeatures(features: string[]): {
  ram?: string;
  cpu?: string;
  disk?: string;
  bandwidth?: string;
  location?: string;
} {
  const specs: { ram?: string; cpu?: string; disk?: string; bandwidth?: string; location?: string } = {};

  for (const feat of features) {
    const t = feat.trim();
    if (!specs.ram) {
      const ram = parseRam(t);
      if (ram) specs.ram = ram;
    }
    if (!specs.cpu) {
      const cpu = parseCpu(t);
      if (cpu) specs.cpu = cpu;
    }
    if (!specs.disk) {
      const disk = parseDisk(t);
      if (disk) specs.disk = disk;
    }
    if (!specs.bandwidth) {
      const bw = parseBandwidth(t);
      if (bw) specs.bandwidth = bw;
    }
    if (!specs.location) {
      const loc = parseLocation(t);
      if (loc) specs.location = loc;
    }
  }

  return specs;
}

function scrapeProducts(html: string, category: DealCategory, sourcePageUrl: string): Deal[] {
  const $ = cheerio.load(html);
  const deals: Deal[] = [];
  const fetchedAt = new Date().toISOString();

  // LuxVPS WHMCS uses div.product.clearfix — try that first, then generic fallbacks
  const selectors = [
    'div.product.clearfix',
    'div.product',
    '.product-list-item',
    '.package',
    '[data-product-id]',
    '.pricing-table .col',
    '.product-card',
    '.plan',
  ];

  let productElements = $();
  for (const sel of selectors) {
    const found = $(sel);
    if (found.length > 0) {
      productElements = found;
      break;
    }
  }

  // Fallback: table rows containing an order/cart link
  if (productElements.length === 0) {
    productElements = $('table tr').filter((_, el) => {
      return $(el).find('a[href*="order"], a[href*="cart"]').length > 0;
    });
  }

  productElements.each((_, el) => {
    const $el = $(el);

    // Extract name — LuxVPS uses <span id="productXXX-name"> inside <header>
    const name =
      $el.find('header span[id$="-name"]').first().text().trim() ||
      $el.find('span[id$="-name"]').first().text().trim() ||
      $el.find('.product-name, .package-name, h2, h3, .plan-name, .title').first().text().trim() ||
      $el.find('strong').first().text().trim();

    if (!name) return;

    // Extract price — LuxVPS uses <span class="price">€4.95 EUR</span>
    const priceText =
      $el.find('span.price').first().text().trim() ||
      $el.find('.price, .price-tag, .billing-cycle-price, .amount, .cost').first().text().trim() ||
      $el.find('[class*="price"]').first().text().trim();
    const price = parsePrice(priceText);

    // Extract order URL — LuxVPS uses <a class="btn btn-success btn-sm btn-order-now">
    const orderHref =
      $el.find('a.btn-order-now').first().attr('href') ||
      $el.find('a[id$="-order-button"]').first().attr('href') ||
      $el.find('a[href*="order"], a[href*="cart"], a.order-button, a.btn-order, .btn-primary').first().attr('href') ||
      $el.find('a').filter((_, a) => {
        const text = $(a).text().toLowerCase();
        return text.includes('order') || text.includes('buy') || text.includes('get');
      }).first().attr('href');

    const sourceUrl = orderHref
      ? orderHref.startsWith('http')
        ? orderHref
        : `https://billing.luxvps.net${orderHref}`
      : sourcePageUrl;

    // Extract features — LuxVPS puts specs in .product-desc p with <br> separators
    const features: string[] = [];

    const descHtml = $el.find('.product-desc p').html() ?? '';
    if (descHtml) {
      const brLines = descHtml
        .split(/<br\s*\/?>/gi)
        .map((line) => cheerio.load(line).text().trim())
        .filter(Boolean);
      features.push(...brLines);
    }

    // Also collect <li> items and table cells as fallback
    $el.find('ul li, .features li, .feature-list li, .product-features li').each((_, li) => {
      const text = $(li).text().trim();
      if (text) features.push(text);
    });
    $el.find('dt, dd, td').each((_, cell) => {
      const text = $(cell).text().trim();
      if (text && text.length < 100) features.push(text);
    });

    // Last resort: split all text by newlines
    if (features.length === 0) {
      const lines = $el.text().split(/\n|\//).map((l) => l.trim()).filter(Boolean);
      features.push(...lines);
    }

    const parsedSpecs = extractSpecsFromFeatures(features);

    // Stock fallback — the WHMCS store's own counter, <span class="qty">15 Available</span>.
    // Only used when the reseller API didn't report on this package (see applyLiveStock).
    const qtyText = $el.find('span.qty').text().trim();
    const qtyNum = parseInt(qtyText, 10);
    const inStock = qtyText
      ? qtyNum > 0
      : !$el.find('.out-of-stock, [class*="unavailable"], [class*="sold-out"]').length &&
        !$el.text().toLowerCase().includes('out of stock') &&
        !$el.text().toLowerCase().includes('sold out');

    // Description — clean text from .product-desc p
    const description = $el.find('.product-desc p').text().replace(/\s+/g, ' ').trim() || undefined;

    const id = slugify(`${name}-${category}`);

    deals.push({
      id,
      slug: id,
      name,
      category,
      sourceUrl,
      price: price ?? 0,
      specs: {
        ram: parsedSpecs.ram ?? 'N/A',
        cpu: parsedSpecs.cpu ?? 'N/A',
        disk: parsedSpecs.disk ?? 'N/A',
        bandwidth: parsedSpecs.bandwidth ?? 'N/A',
        location: parsedSpecs.location,
      },
      inStock,
      description,
      fetchedAt,
    });
  });

  return deals;
}

async function fetchSource(url: string, category: DealCategory): Promise<Deal[]> {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.error(`[scraper] Failed to fetch ${url}: ${res.status}`);
      return [];
    }

    const html = await res.text();
    const deals = scrapeProducts(html, category, url);
    console.log(`[scraper] ${url}: found ${deals.length} deals`);
    return deals;
  } catch (err) {
    console.error(`[scraper] Error fetching ${url}:`, err);
    return [];
  }
}

/**
 * Overlay live availability from the reseller API onto scraped deals.
 *
 * Packages the API didn't report on keep their scraped `inStock` — a line that fails to
 * fetch must never read as a sell-out.
 */
async function applyLiveStock(deals: Deal[]): Promise<Deal[]> {
  const stock = await getStockByStoreUrl();
  if (stock.size === 0) return deals;

  return deals.map((deal) => {
    const live = stock.get(normalizeStoreUrl(deal.sourceUrl));
    return live === undefined ? deal : { ...deal, inStock: live };
  });
}

export async function getAllDeals(
  options: { includeStock?: boolean } = {}
): Promise<Deal[]> {
  const { includeStock = true } = options;

  const results = await Promise.all(
    SOURCES.map(({ url, category }) => fetchSource(url, category))
  );

  const merged = results.flat();

  if (merged.length === 0) {
    return [];
  }

  return assignBadges(includeStock ? await applyLiveStock(merged) : merged);
}

export async function getDealBySlug(slug: string): Promise<Deal | null> {
  const deals = await getAllDeals();
  return deals.find((d) => d.slug === slug) ?? null;
}

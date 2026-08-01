import type { Metadata } from 'next';
import type { Deal } from './deals';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deals.luxvps.net';
const SITE_NAME = 'LuxVPS Deal Finder';

// Every LuxVPS node lives in the same Frankfurt facility — see DEFAULT_LOCATION in
// lib/scraper.ts. Kept in one place so copy, metadata and schema.org never disagree.
export const DATACENTER_CITY = 'Frankfurt';
export const DATACENTER_LOCATION = 'Frankfurt, Germany';
export const DATACENTER_COUNTRY = 'DE';

const DATACENTER_PLACE = {
  '@type': 'Place',
  name: 'LuxVPS Frankfurt Datacenter',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Frankfurt am Main',
    addressRegion: 'Hesse',
    addressCountry: DATACENTER_COUNTRY,
  },
};

export function buildHomeMetadata(): Metadata {
  const title = 'Cheap VPS Deals in Frankfurt, Germany — LuxVPS Deal Finder';
  const description =
    'Compare every LuxVPS deal in one place: cheap KVM, Ryzen and EPYC VPS hosted in Frankfurt, Germany. Live stock, daily price updates, full root access.';

  return {
    title,
    description,
    keywords: [
      'LuxVPS deals',
      'cheap VPS Germany',
      'VPS Frankfurt',
      'KVM VPS Frankfurt',
      'Ryzen VPS Germany',
      'EPYC VPS Frankfurt',
      'root server Germany',
      'German VPS hosting',
      'cheap KVM root server',
      'best VPS prices',
      'LuxVPS offers',
      'buy VPS Frankfurt',
    ],
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: 'website',
      url: SITE_URL,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'en_US',
      // Images come from app/opengraph-image.tsx — do not hardcode a path here.
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function buildDealMetadata(deal: Deal): Metadata {
  const location = deal.specs.location ?? DATACENTER_LOCATION;
  const title = `${deal.name} — ${deal.specs.ram} VPS in ${DATACENTER_CITY} for €${deal.price.toFixed(2)}/mo`;
  const description = `${deal.name} from LuxVPS at €${deal.price.toFixed(2)}/month: ${deal.specs.ram} RAM, ${deal.specs.cpu}, ${deal.specs.disk} storage, ${deal.specs.bandwidth} bandwidth, hosted in ${location}. ${deal.inStock ? 'In stock — order now.' : 'Currently out of stock.'}`;
  const url = `${SITE_URL}/deals/${deal.slug}`;

  return {
    title,
    description,
    keywords: [
      deal.name,
      `${deal.name} price`,
      'LuxVPS',
      `${deal.specs.ram} VPS`,
      `VPS ${DATACENTER_CITY}`,
      deal.category === 'ryzen-kvm'
        ? 'Ryzen KVM VPS Germany'
        : deal.category === 'kvm-rootserver'
          ? 'KVM root server Germany'
          : 'EPYC KVM VPS Germany',
      'cheap VPS Germany',
      `€${deal.price.toFixed(2)} VPS`,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function buildProductSchema(deal: Deal) {
  const location = deal.specs.location ?? DATACENTER_LOCATION;
  const description =
    deal.description ??
    `${deal.name} — ${deal.specs.ram} RAM, ${deal.specs.cpu}, ${deal.specs.disk} storage, ${deal.specs.bandwidth} bandwidth. KVM VPS hosted by LuxVPS in ${location}.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: deal.name,
    description,
    image: 'https://billing.luxvps.net/assets/img/logo.png',
    sku: deal.id,
    mpn: deal.id,
    category: 'VPS Hosting',
    url: `${SITE_URL}/deals/${deal.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'LuxVPS',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'RAM', value: deal.specs.ram },
      { '@type': 'PropertyValue', name: 'CPU', value: deal.specs.cpu },
      { '@type': 'PropertyValue', name: 'Storage', value: deal.specs.disk },
      { '@type': 'PropertyValue', name: 'Bandwidth', value: deal.specs.bandwidth },
      { '@type': 'PropertyValue', name: 'Virtualization', value: 'KVM' },
      { '@type': 'PropertyValue', name: 'Datacenter location', value: location },
    ],
    offers: {
      '@type': 'Offer',
      price: deal.price.toFixed(2),
      priceCurrency: 'EUR',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      availability: deal.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: deal.sourceUrl,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: deal.price.toFixed(2),
        priceCurrency: 'EUR',
        unitCode: 'MON',
        billingIncrement: 1,
        referenceQuantity: {
          '@type': 'QuantitativeValue',
          value: 1,
          unitCode: 'MON',
        },
      },
      availableAtOrFrom: DATACENTER_PLACE,
      areaServed: {
        '@type': 'Place',
        name: 'Worldwide',
      },
      seller: {
        '@type': 'Organization',
        name: 'LuxVPS',
        url: 'https://luxvps.net',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: DATACENTER_COUNTRY,
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: DATACENTER_COUNTRY,
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      },
    },
  };
}

export function buildItemListSchema(deals: Deal[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `LuxVPS VPS Deals — ${DATACENTER_LOCATION}`,
    description: `The best LuxVPS VPS deals — Xeon, Ryzen, and EPYC KVM servers hosted in ${DATACENTER_LOCATION}`,
    numberOfItems: deals.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: deals.map((deal, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: deal.name,
        url: `${SITE_URL}/deals/${deal.slug}`,
        sku: deal.id,
        brand: { '@type': 'Brand', name: 'LuxVPS' },
        offers: {
          '@type': 'Offer',
          price: deal.price.toFixed(2),
          priceCurrency: 'EUR',
          availability: deal.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          availableAtOrFrom: DATACENTER_PLACE,
        },
      },
    })),
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en',
    description: `Find the best LuxVPS VPS deals — Xeon, Ryzen, and EPYC KVM servers hosted in ${DATACENTER_LOCATION}.`,
    publisher: {
      '@type': 'Organization',
      name: 'LuxVPS',
      url: 'https://luxvps.net',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LuxVPS',
    url: 'https://luxvps.net',
    logo: 'https://billing.luxvps.net/assets/img/logo.png',
    description: `LuxVPS provides KVM, Ryzen and EPYC virtual private servers hosted in ${DATACENTER_LOCATION}.`,
    areaServed: DATACENTER_PLACE,
    sameAs: ['https://luxvps.net', 'https://billing.luxvps.net', SITE_URL],
  };
}

function faqPage(entries: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.q,
      acceptedAnswer: { '@type': 'Answer', text: e.a },
    })),
  };
}

/**
 * Deal FAQ entries. Rendered visibly on the deal page AND fed to FAQPage schema —
 * Google drops rich results for FAQ markup with no matching on-page text, so these
 * two must always come from the same source.
 */
export function dealFaqEntries(deal: Deal): { q: string; a: string }[] {
  const location = deal.specs.location ?? DATACENTER_LOCATION;
  return [
    {
      q: `What specs does the ${deal.name} include?`,
      a: `The ${deal.name} includes ${deal.specs.ram} RAM, ${deal.specs.cpu}, ${deal.specs.disk} storage, and ${deal.specs.bandwidth} bandwidth, hosted in ${location}.`,
    },
    {
      q: `How much does the ${deal.name} cost?`,
      a: `The ${deal.name} costs €${deal.price.toFixed(2)} per month, billed by LuxVPS in EUR. Prices on this page are re-checked against the LuxVPS store every 24 hours.`,
    },
    {
      q: `Is the ${deal.name} currently in stock?`,
      a: deal.inStock
        ? `Yes, the ${deal.name} is in stock and available to order immediately at €${deal.price.toFixed(2)}/month. Stock is pulled from the LuxVPS API every 5 minutes.`
        : `The ${deal.name} is currently out of stock. Stock is pulled from the LuxVPS API every 5 minutes, so check back soon or browse other LuxVPS deals.`,
    },
    {
      q: `Where is the ${deal.name} hosted?`,
      a: `The ${deal.name} is hosted in ${location}, one of Europe's largest internet exchange hubs — which keeps latency low across Germany and the EU. It runs on KVM virtualization with full root access, and the datacenter is GDPR compliant.`,
    },
    {
      q: `Can I order the ${deal.name} on a monthly basis?`,
      a: `Yes, the ${deal.name} is available for €${deal.price.toFixed(2)}/month with no long-term contract required. Click Order Now to configure and purchase directly on LuxVPS.`,
    },
  ];
}

export function buildFaqSchema(deal: Deal) {
  return faqPage(dealFaqEntries(deal));
}

/** Home-page FAQ — rendered visibly on `/`, so it may carry FAQPage markup. */
export function homeFaqEntries(dealCount: number, cheapest?: number): { q: string; a: string }[] {
  return [
    {
      q: 'Where are LuxVPS servers located?',
      a: `All LuxVPS servers are hosted in ${DATACENTER_LOCATION}. Frankfurt is home to DE-CIX, the world's largest internet exchange, which gives single-digit millisecond latency to most of Germany and 10–30 ms across Western Europe. The datacenter is GDPR compliant and operates under German data protection law.`,
    },
    {
      q: 'What is the cheapest LuxVPS deal?',
      a: cheapest
        ? `The cheapest LuxVPS plan currently listed starts at €${cheapest.toFixed(2)} per month. All ${dealCount} plans are compared side by side on this page and re-checked against the LuxVPS store every 24 hours.`
        : `All ${dealCount} LuxVPS plans are compared side by side on this page and re-checked against the LuxVPS store every 24 hours.`,
    },
    {
      q: 'What is the difference between the KVM, Ryzen and EPYC lines?',
      a: 'KVM root servers run on Xeon hardware and are the cheapest entry point. Ryzen KVM uses AMD Ryzen 9 5900X CPUs with high single-core clocks — best for game servers and latency-sensitive apps. EPYC KVM uses server-grade AMD EPYC CPUs with more cores, built for sustained multi-core workloads like databases, CI runners and virtualization.',
    },
    {
      q: 'Do LuxVPS plans include full root access?',
      a: 'Yes. Every plan uses KVM virtualization, so you get a fully isolated virtual machine with root access, your own kernel, and the ability to install any Linux distribution or run custom kernels and Docker.',
    },
    {
      q: 'How accurate are the prices and stock levels on this site?',
      a: 'Prices are scraped from the official LuxVPS store every 24 hours and stock comes straight from the LuxVPS API every 5 minutes. Every deal links directly to billing.luxvps.net, where the price is confirmed at checkout.',
    },
    {
      q: 'Is this the official LuxVPS website?',
      a: 'This is the LuxVPS Deal Finder, a price-comparison front end for LuxVPS plans. Orders, billing and support all happen on luxvps.net and billing.luxvps.net.',
    },
  ];
}

export function buildHomeFaqSchema(dealCount: number, cheapest?: number) {
  return faqPage(homeFaqEntries(dealCount, cheapest));
}

/** Category FAQ — rendered visibly on the category page. */
export function categoryFaqEntries(
  label: string,
  dealCount: number,
  cheapest?: number
): { q: string; a: string }[] {
  return [
    {
      q: `Where are LuxVPS ${label} hosted?`,
      a: `All LuxVPS ${label} run in ${DATACENTER_LOCATION}, next to the DE-CIX internet exchange. That means low latency across Germany and Western Europe, and a GDPR-compliant, German-law datacenter.`,
    },
    {
      q: `How much do LuxVPS ${label} cost?`,
      a: cheapest
        ? `LuxVPS ${label} start at €${cheapest.toFixed(2)} per month. There are ${dealCount} plans in this line, all listed on this page with live stock.`
        : `There are ${dealCount} LuxVPS ${label} plans listed on this page, each with its current monthly price in EUR.`,
    },
    {
      q: `Do LuxVPS ${label} come with full root access?`,
      a: `Yes — every plan in this line uses KVM virtualization, giving you a fully isolated VM with root access and your own kernel.`,
    },
  ];
}

export function buildCategoryFaqSchema(label: string, dealCount: number, cheapest?: number) {
  return faqPage(categoryFaqEntries(label, dealCount, cheapest));
}

export function buildCategoryMetadata(
  category: string,
  label: string,
  description: string
): Metadata {
  const url = `${SITE_URL}/category/${category}`;
  const title = `${label} in ${DATACENTER_CITY}, Germany — LuxVPS Deals`;
  return {
    title,
    description,
    keywords: [
      `${label} Germany`,
      `${label} Frankfurt`,
      'LuxVPS',
      'cheap VPS Germany',
      'KVM VPS Frankfurt',
      'German VPS hosting',
    ],
    alternates: { canonical: url },
    openGraph: {
      type: 'website' as const,
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
    },
  };
}

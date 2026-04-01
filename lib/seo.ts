import type { Metadata } from 'next';
import type { Deal } from './deals';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deals.luxvps.net';
const SITE_NAME = 'LuxVPS Deal Finder';

export function buildHomeMetadata(): Metadata {
  const title = 'LuxVPS Deal Finder — Cheap KVM & Ryzen VPS Deals | Best Prices 2026';
  const description =
    'Find the best LuxVPS deals. Cheap KVM VPS, Ryzen VPS servers and root servers at unbeatable prices. Compare plans, filter by specs, order instantly.';

  return {
    title,
    description,
    keywords: [
      'LuxVPS deals',
      'cheap VPS',
      'KVM VPS deals',
      'Ryzen VPS',
      'root server deals',
      'best VPS prices',
      'affordable VPS hosting',
      'LuxVPS offers',
      'KVM root server',
      'buy LuxVPS',
      'VPS special offers',
      'cheap root server',
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
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'LuxVPS Deal Finder — Best VPS Deals',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
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
  const title = `${deal.name} — ${deal.specs.ram} ${deal.specs.cpu} VPS for €${deal.price}/mo | LuxVPS Deal Finder`;
  const description = `Buy ${deal.name} from LuxVPS for just €${deal.price}/month. Includes ${deal.specs.ram} RAM, ${deal.specs.cpu}, ${deal.specs.disk} storage${deal.specs.location ? `, hosted in ${deal.specs.location}` : ''}. Order now — ${deal.inStock ? 'In Stock' : 'Limited availability'}.`;
  const url = `${SITE_URL}/deals/${deal.slug}`;

  return {
    title,
    description,
    keywords: [
      deal.name,
      'LuxVPS',
      'LuxVPS deal',
      `${deal.specs.ram} VPS`,
      `${deal.category === 'ryzen-kvm' ? 'Ryzen KVM VPS' : deal.category === 'kvm-rootserver' ? 'KVM root server' : 'VPS special offer'}`,
      'cheap VPS',
      'buy VPS',
      `€${deal.price} VPS`,
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
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${deal.name} — LuxVPS Deal Finder`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export function buildProductSchema(deal: Deal) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: deal.name,
    description:
      deal.description ??
      `${deal.name} VPS — ${deal.specs.ram} RAM, ${deal.specs.cpu}, ${deal.specs.disk}${deal.specs.location ? `, ${deal.specs.location}` : ''}`,
    brand: {
      '@type': 'Brand',
      name: 'LuxVPS',
    },
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
      seller: {
        '@type': 'Organization',
        name: 'LuxVPS',
        url: 'https://luxvps.net',
      },
    },
  };
}

export function buildItemListSchema(deals: Deal[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'LuxVPS VPS Deals',
    description: 'The best LuxVPS VPS deals — KVM, Ryzen, and special offers',
    numberOfItems: deals.length,
    itemListElement: deals.map((deal, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: deal.name,
        url: `${SITE_URL}/deals/${deal.slug}`,
        offers: {
          '@type': 'Offer',
          price: deal.price.toFixed(2),
          priceCurrency: 'EUR',
          availability: deal.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
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
    description:
      'Find the best LuxVPS VPS deals — KVM, Ryzen, and special offers at unbeatable prices.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

import { MetadataRoute } from 'next';
import { getAllDeals } from '@/lib/scraper';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deals.luxvps.net';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // No stock in a sitemap — skip the API call so this route keeps its 24h cadence.
  const deals = await getAllDeals({ includeStock: false });

  const dealEntries: MetadataRoute.Sitemap = deals.map((deal) => ({
    url: `${SITE_URL}/deals/${deal.slug}`,
    lastModified: new Date(deal.fetchedAt),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = [
    'kvm-rootserver',
    'ryzen-kvm',
    'epyc',
  ].map((cat) => ({
    url: `${SITE_URL}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...categoryEntries,
    ...dealEntries,
  ];
}

import { getAllDeals } from '@/lib/scraper';
import { buildHomeMetadata, buildItemListSchema, buildWebsiteSchema } from '@/lib/seo';
import HeroBanner from '@/components/HeroBanner';
import DealGrid from '@/components/DealGrid';
import type { Metadata } from 'next';

export const revalidate = 86400; // 24h ISR

export const metadata: Metadata = buildHomeMetadata();

export default async function HomePage() {
  const deals = await getAllDeals();

  if (deals.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-3">Deals unavailable right now</h1>
        <p className="text-brand-muted">
          Could not fetch deals from billing.luxvps.net. The scraper needs attention.
        </p>
      </div>
    );
  }

  const specialDeals = deals.filter((d) => d.category === 'special-offer');

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebsiteSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildItemListSchema(deals)) }}
      />

      {/* Hero */}
      <HeroBanner specialDeals={specialDeals} />

      {/* SEO intro text */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <h2 className="text-2xl font-bold text-white mb-2">
          Best LuxVPS Deals — KVM & Ryzen VPS at Unbeatable Prices
        </h2>
        <p className="text-brand-muted text-sm max-w-2xl">
          Browse {deals.length}+ VPS deals from LuxVPS including KVM root servers, Ryzen KVM VPS, and exclusive special offers. Filter by RAM, location, or price — and compare plans side by side before you order.
        </p>
      </section>

      {/* Deal grid with filters */}
      <DealGrid deals={deals} />
    </>
  );
}

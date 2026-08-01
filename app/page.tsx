import { getAllDeals } from '@/lib/scraper';
import {
  buildHomeMetadata,
  buildItemListSchema,
  buildWebsiteSchema,
  buildHomeFaqSchema,
  homeFaqEntries,
  DATACENTER_LOCATION,
} from '@/lib/seo';
import HeroBanner from '@/components/HeroBanner';
import DealGrid from '@/components/DealGrid';
import FaqSection from '@/components/FaqSection';
import type { Metadata } from 'next';

// Stock comes from the reseller API (STOCK_REVALIDATE_SECONDS in lib/stock.ts); the
// scraped catalog underneath is still cached for 24h.
export const revalidate = 300;

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

  const featuredDeals = [...deals]
    .filter((d) => d.inStock && d.price > 0)
    .sort((a, b) => a.price - b.price);

  const cheapest = featuredDeals[0]?.price;
  const faqEntries = homeFaqEntries(deals.length, cheapest);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildHomeFaqSchema(deals.length, cheapest)),
        }}
      />

      {/* Hero */}
      <HeroBanner deals={featuredDeals} totalDeals={deals.length} />

      {/* SEO intro text */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <h2 className="text-2xl font-bold text-white mb-2">
          Best LuxVPS Deals — KVM, Ryzen &amp; EPYC VPS in {DATACENTER_LOCATION}
        </h2>
        <p className="text-brand-muted text-sm max-w-3xl">
          Browse {deals.length} VPS deals from LuxVPS including KVM root servers, Ryzen KVM VPS, and
          EPYC KVM servers — every one of them hosted in {DATACENTER_LOCATION}. Filter by RAM, CPU or
          price, and compare plans side by side before you order.
        </p>
      </section>

      {/* Deal grid with filters */}
      <DealGrid deals={deals} />

      {/* Location context — the whole fleet sits in one Frankfurt facility */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <h2 className="text-2xl font-bold text-white mb-3">
          Why a VPS in {DATACENTER_LOCATION}?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Europe’s biggest peering hub',
              body: `Frankfurt hosts DE-CIX, the largest internet exchange in the world by traffic. That means short, direct routes to most European networks — typically single-digit millisecond latency inside Germany and 10–30 ms across Western Europe.`,
            },
            {
              title: 'German data protection',
              body: 'Servers sit under German and EU law, so the datacenter is GDPR compliant out of the box — useful if you host customer data, analytics, or anything that has to stay in the EU.',
            },
            {
              title: 'One location, no guesswork',
              body: `Every LuxVPS plan on this page — KVM root servers, Ryzen KVM and EPYC KVM alike — runs from the same ${DATACENTER_LOCATION} facility, so latency and routing are identical whichever deal you pick.`,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-brand-card border border-brand-border rounded-xl p-5"
            >
              <h3 className="text-brand-text font-semibold mb-2">{card.title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <FaqSection entries={faqEntries} heading="LuxVPS Deals — Frequently Asked Questions" />
    </>
  );
}

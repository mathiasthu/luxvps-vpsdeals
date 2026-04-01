import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllDeals, getDealBySlug } from '@/lib/scraper';
import { buildDealMetadata, buildProductSchema, buildBreadcrumbSchema, buildFaqSchema } from '@/lib/seo';
import { CATEGORY_LABELS, BADGE_LABELS, BADGE_COLORS, Deal } from '@/lib/deals';
import type { Metadata } from 'next';

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const deals = await getAllDeals();
  return deals.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);
  if (!deal) return {};
  // Remove og:image override — Next.js picks up opengraph-image.tsx automatically
  const meta = buildDealMetadata(deal);
  if (meta.openGraph && typeof meta.openGraph === 'object') {
    const og = { ...meta.openGraph };
    delete (og as Record<string, unknown>).images;
    meta.openGraph = og;
  }
  if (meta.twitter && typeof meta.twitter === 'object') {
    const tw = { ...meta.twitter };
    delete (tw as Record<string, unknown>).images;
    meta.twitter = tw;
  }
  return meta;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deals.luxvps.net';

const SPEC_ITEMS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4m6-18h4a2 2 0 012 2v14a2 2 0 01-2 2h-4m-6 0V3m6 0v18" />
      </svg>
    ),
    color: 'text-brand-yellow',
    label: 'RAM',
    key: 'ram' as const,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m16-6h-2m2 6h-2M7 19H5a2 2 0 01-2-2V7a2 2 0 012-2h2m10 14h2a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 7h6v10H9V7z" />
      </svg>
    ),
    color: 'text-brand-green',
    label: 'CPU',
    key: 'cpu' as const,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    color: 'text-brand-red',
    label: 'Storage',
    key: 'disk' as const,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    color: 'text-blue-400',
    label: 'Bandwidth',
    key: 'bandwidth' as const,
  },
];

function RelatedDeals({ deals, currentSlug }: { deals: Deal[]; currentSlug: string }) {
  if (deals.length === 0) return null;
  return (
    <div className="mt-12">
      <h2 className="text-white font-bold text-lg mb-4">More Deals in This Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {deals.map((d) => (
          <Link
            key={d.id}
            href={`/deals/${d.slug}`}
            className="bg-brand-card border border-brand-border hover:border-brand-border-light rounded-xl p-4 transition-colors group"
          >
            <div className="text-brand-text font-semibold text-sm group-hover:text-brand-red transition-colors mb-1">
              {d.name}
            </div>
            <div className="text-white font-bold text-lg">€{d.price.toFixed(2)}<span className="text-brand-muted text-xs font-normal">/mo</span></div>
            <div className="text-brand-muted text-xs mt-1">{d.specs.ram} · {d.specs.cpu}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function DealPage({ params }: PageProps) {
  const { slug } = await params;
  const [deal, allDeals] = await Promise.all([getDealBySlug(slug), getAllDeals()]);
  if (!deal) notFound();

  const relatedDeals = allDeals
    .filter((d) => d.category === deal.category && d.slug !== slug)
    .slice(0, 3);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: CATEGORY_LABELS[deal.category], url: `${SITE_URL}/category/${deal.category}` },
    { name: deal.name, url: `${SITE_URL}/deals/${deal.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductSchema(deal)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(deal)) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-brand-muted mb-6 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-text transition-colors">Home</Link>
          <svg className="w-3 h-3 text-brand-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/category/${deal.category}`} className="hover:text-brand-text transition-colors">
            {CATEGORY_LABELS[deal.category]}
          </Link>
          <svg className="w-3 h-3 text-brand-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-brand-text">{deal.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted border border-brand-border px-2 py-0.5 rounded">
                  {CATEGORY_LABELS[deal.category]}
                </span>
                {deal.badge && (
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${BADGE_COLORS[deal.badge]}`}>
                    {BADGE_LABELS[deal.badge]}
                  </span>
                )}
                <span className={`text-xs font-semibold ${deal.inStock ? 'text-brand-green' : 'text-brand-red'}`}>
                  {deal.inStock ? '● In Stock' : '● Out of Stock'}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{deal.name}</h1>
              {deal.description && (
                <p className="text-brand-muted text-base leading-relaxed">{deal.description}</p>
              )}
            </div>

            {/* Specs table */}
            <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-brand-border">
                <h2 className="text-brand-text font-semibold text-sm uppercase tracking-wide">Full Specifications</h2>
              </div>
              <div className="divide-y divide-brand-border/50">
                {SPEC_ITEMS.map(({ icon, color, label, key }) => (
                  <div key={key} className="flex items-center justify-between px-5 py-3.5">
                    <div className={`flex items-center gap-3 ${color}`}>
                      {icon}
                      <span className="text-brand-muted text-sm">{label}</span>
                    </div>
                    <span className="text-brand-text font-medium text-sm">{deal.specs[key]}</span>
                  </div>
                ))}
                {deal.specs.location && (
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-brand-muted text-sm">Location</span>
                    </div>
                    <span className="text-brand-text font-medium text-sm">{deal.specs.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Why LuxVPS section */}
            <div className="bg-brand-card border border-brand-border rounded-xl p-5">
              <h2 className="text-brand-text font-semibold mb-3">Why Choose LuxVPS?</h2>
              <ul className="space-y-2">
                {[
                  'Full KVM virtualization — complete root access',
                  'NVMe SSD storage for blazing fast performance',
                  'Instant provisioning after order',
                  'Competitive pricing updated regularly',
                  'German data centers — GDPR compliant',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-brand-muted">
                    <svg className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar — order box */}
          <div className="md:col-span-1">
            <div className="sticky top-20 bg-brand-card border-2 border-brand-red/50 rounded-xl p-6 shadow-lg shadow-brand-red/10">
              <div className="text-center mb-4">
                <div className="text-4xl font-extrabold text-white">€{deal.price.toFixed(2)}</div>
                <div className="text-brand-muted text-sm mt-0.5">per month</div>
                {deal.priceAnnual && (
                  <div className="text-brand-green text-xs mt-1">Annual: €{deal.priceAnnual.toFixed(2)}/yr</div>
                )}
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between text-sm py-1.5 border-b border-brand-border/50">
                  <span className="text-brand-muted">RAM</span>
                  <span className="text-brand-text font-medium">{deal.specs.ram}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1.5 border-b border-brand-border/50">
                  <span className="text-brand-muted">CPU</span>
                  <span className="text-brand-text font-medium">{deal.specs.cpu}</span>
                </div>
                <div className="flex items-center justify-between text-sm py-1.5">
                  <span className="text-brand-muted">Storage</span>
                  <span className="text-brand-text font-medium">{deal.specs.disk}</span>
                </div>
              </div>

              <a
                href={deal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center font-bold py-3 rounded-xl transition-colors text-sm uppercase tracking-wide ${
                  deal.inStock
                    ? 'bg-brand-red hover:bg-brand-red-dark text-white'
                    : 'bg-brand-border text-brand-muted cursor-not-allowed'
                }`}
                {...(!deal.inStock && { 'aria-disabled': 'true' })}
              >
                {deal.inStock ? 'Order Now at LuxVPS →' : 'Out of Stock'}
              </a>

              <p className="text-brand-muted text-xs text-center mt-3">
                You will be redirected to billing.luxvps.net
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/#deals" className="text-brand-muted hover:text-brand-text text-sm transition-colors inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all deals
              </Link>
            </div>
          </div>
        </div>

        {/* Related deals */}
        <RelatedDeals deals={relatedDeals} currentSlug={slug} />
      </div>
    </>
  );
}

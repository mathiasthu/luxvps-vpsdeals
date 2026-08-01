import { notFound } from 'next/navigation';
import { getAllDeals } from '@/lib/scraper';
import { buildCategoryMetadata, buildItemListSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { CATEGORY_LABELS, type DealCategory } from '@/lib/deals';
import DealGrid from '@/components/DealGrid';
import type { Metadata } from 'next';

export const revalidate = 86400;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deals.luxvps.net';

const CATEGORY_CONTENT: Record<DealCategory, { description: string; intro: string }> = {
  'kvm-rootserver': {
    description: 'Cheap KVM root servers from LuxVPS. Full root access, KVM virtualization, SSD storage, and unmetered bandwidth from €4.99/month.',
    intro: 'LuxVPS KVM root servers give you full root access with KVM virtualization. Perfect for hosting websites, game servers, or any workload that needs dedicated resources at an affordable price.',
  },
  'ryzen-kvm': {
    description: 'AMD Ryzen KVM VPS servers from LuxVPS — powered by Ryzen 9 5900X CPUs with NVMe storage and unmetered bandwidth. Best performance per euro.',
    intro: 'LuxVPS Ryzen KVM servers run on AMD Ryzen™ 9 5900X processors with fast NVMe storage in RAID 1. These offer the best raw CPU performance for the price — ideal for CPU-intensive workloads, game servers, and low-latency applications.',
  },
  'epyc': {
    description: 'AMD EPYC KVM VPS servers from LuxVPS — server-grade EPYC CPUs with NVMe storage and unmetered bandwidth. Datacenter performance at VPS prices.',
    intro: 'LuxVPS EPYC KVM servers run on server-grade AMD EPYC™ processors with fast NVMe storage. Built for sustained multi-core workloads — databases, virtualization, CI runners, and busy production apps — with full root access and KVM virtualization.',
  },
};

type ValidCategory = DealCategory;

function isValidCategory(cat: string): cat is ValidCategory {
  return ['kvm-rootserver', 'ryzen-kvm', 'epyc'].includes(cat);
}

interface PageProps {
  params: Promise<{ cat: string }>;
}

export async function generateStaticParams() {
  return [
    { cat: 'kvm-rootserver' },
    { cat: 'ryzen-kvm' },
    { cat: 'epyc' },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cat } = await params;
  if (!isValidCategory(cat)) return {};
  const { description } = CATEGORY_CONTENT[cat];
  return buildCategoryMetadata(cat, CATEGORY_LABELS[cat], description);
}

export default async function CategoryPage({ params }: PageProps) {
  const { cat } = await params;
  if (!isValidCategory(cat)) notFound();

  const allDeals = await getAllDeals();
  const deals = allDeals.filter((d) => d.category === cat);
  const { description, intro } = CATEGORY_CONTENT[cat];
  const label = CATEGORY_LABELS[cat];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: label, url: `${SITE_URL}/category/${cat}` },
  ]);

  const itemListSchema = buildItemListSchema(deals);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Category hero */}
      <section className="border-b border-brand-border bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-brand-muted mb-4" aria-label="Breadcrumb">
            <a href="/" className="hover:text-brand-text transition-colors">Home</a>
            <svg className="w-3 h-3 text-brand-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-brand-text">{label}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            {label}
            <span className="text-brand-red"> — LuxVPS</span>
          </h1>
          <p className="text-brand-muted max-w-2xl text-base leading-relaxed mb-4">{intro}</p>
          <p className="text-brand-muted text-sm">
            <span className="text-brand-green font-semibold">{deals.length}</span> deal{deals.length !== 1 ? 's' : ''} available
            {' · '}
            <span className="text-brand-muted">Prices in EUR · Updated every 24h</span>
          </p>
        </div>
      </section>

      {/* SEO description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <p className="text-brand-muted text-sm max-w-3xl">{description}</p>
      </div>

      {/* Deals */}
      {deals.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-white font-bold text-xl mb-2">No deals available right now</h2>
          <p className="text-brand-muted text-sm">Check back soon or <a href="/#deals" className="text-brand-red hover:underline">view all deals</a>.</p>
        </div>
      ) : (
        <DealGrid deals={deals} />
      )}
    </>
  );
}

import Link from 'next/link';
import { buildBreadcrumbSchema } from '@/lib/seo';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deals.luxvps.net';

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaItems = items.map((item) => ({
    name: item.name,
    url: item.href ? `${SITE_URL}${item.href}` : SITE_URL,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(schemaItems)) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-brand-muted mb-6">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <svg className="w-3 h-3 text-brand-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-brand-text transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? 'text-brand-text' : ''}>{item.name}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

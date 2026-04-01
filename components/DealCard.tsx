'use client';

import Link from 'next/link';
import { Deal, BADGE_LABELS, BADGE_COLORS, CATEGORY_BORDER_COLORS } from '@/lib/deals';
import { useCurrency } from '@/context/CurrencyContext';

interface DealCardProps {
  deal: Deal;
  onCompare?: (id: string) => void;
  isComparing?: boolean;
  isCompareDisabled?: boolean;
}

const RAM_ICON = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4m6-18h4a2 2 0 012 2v14a2 2 0 01-2 2h-4m-6 0V3m6 0v18" />
  </svg>
);

const CPU_ICON = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m16-6h-2m2 6h-2M7 19H5a2 2 0 01-2-2V7a2 2 0 012-2h2m10 14h2a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 7h6v10H9V7z" />
  </svg>
);

const DISK_ICON = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
  </svg>
);

const BW_ICON = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const LOC_ICON = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function DealCard({ deal, onCompare, isComparing, isCompareDisabled }: DealCardProps) {
  const { formatPrice } = useCurrency();
  const borderColor = CATEGORY_BORDER_COLORS[deal.category];

  return (
    <article
      className={`group relative bg-brand-card border border-brand-border border-l-4 ${borderColor} rounded-xl overflow-hidden hover:border-brand-border-light hover:bg-brand-card-hover transition-all duration-200 flex flex-col`}
    >
      {/* Badge */}
      {deal.badge && (
        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${BADGE_COLORS[deal.badge]}`}>
            {BADGE_LABELS[deal.badge]}
          </span>
        </div>
      )}

      {/* Out of stock overlay */}
      {!deal.inStock && (
        <div className="absolute inset-0 bg-brand-dark/60 z-20 flex items-center justify-center rounded-xl">
          <span className="bg-brand-border text-brand-muted px-4 py-2 rounded-lg font-semibold text-sm uppercase tracking-wider">
            Out of Stock
          </span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Name */}
        <h3 className="text-brand-text font-bold text-lg mb-1 pr-20 leading-tight">
          <Link href={`/deals/${deal.slug}`} className="hover:text-brand-red transition-colors">
            {deal.name}
          </Link>
        </h3>

        {/* Price */}
        <div className="mb-4">
          <span className="text-3xl font-extrabold text-white">{formatPrice(deal.price)}</span>
          <span className="text-brand-muted text-sm ml-1">/month</span>
          {deal.priceAnnual && (
            <div className="text-brand-green text-xs mt-0.5">
              Save with annual: {formatPrice(deal.priceAnnual)}/yr
            </div>
          )}
        </div>

        {/* Specs */}
        <ul className="space-y-2 mb-5 flex-1">
          <li className="flex items-center gap-2 text-sm text-brand-muted">
            <span className="text-brand-yellow">{RAM_ICON}</span>
            <span className="text-brand-text">{deal.specs.ram}</span>
            <span className="text-brand-border">RAM</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-brand-muted">
            <span className="text-brand-green">{CPU_ICON}</span>
            <span className="text-brand-text">{deal.specs.cpu}</span>
            <span className="text-brand-border">CPU</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-brand-muted">
            <span className="text-brand-red">{DISK_ICON}</span>
            <span className="text-brand-text">{deal.specs.disk}</span>
            <span className="text-brand-border">Storage</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-brand-muted">
            <span className="text-blue-400">{BW_ICON}</span>
            <span className="text-brand-text">{deal.specs.bandwidth}</span>
            <span className="text-brand-border">Bandwidth</span>
          </li>
          {deal.specs.location && (
            <li className="flex items-center gap-2 text-sm text-brand-muted">
              <span className="text-purple-400">{LOC_ICON}</span>
              <span className="text-brand-text">{deal.specs.location}</span>
            </li>
          )}
        </ul>

        {/* CTAs */}
        <div className="space-y-2">
          <a
            href={deal.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-brand-red hover:bg-brand-red-dark text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-150 text-sm uppercase tracking-wide"
          >
            Order Now
          </a>

          {onCompare && (
            <button
              onClick={() => onCompare(deal.id)}
              disabled={isCompareDisabled && !isComparing}
              className={`w-full text-center py-2 px-4 rounded-lg border text-sm font-medium transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100 ${
                isComparing
                  ? 'border-brand-green text-brand-green bg-brand-green/10'
                  : isCompareDisabled
                  ? 'border-brand-border text-brand-muted cursor-not-allowed opacity-30'
                  : 'border-brand-border text-brand-muted hover:border-brand-border-light hover:text-brand-text'
              }`}
            >
              {isComparing ? '✓ Comparing' : '+ Compare'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

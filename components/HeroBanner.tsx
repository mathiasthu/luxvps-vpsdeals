'use client';

import Link from 'next/link';
import { Deal } from '@/lib/deals';
import { useCurrency } from '@/context/CurrencyContext';

interface HeroBannerProps {
  specialDeals: Deal[];
}

export default function HeroBanner({ specialDeals }: HeroBannerProps) {
  const { formatPrice } = useCurrency();
  const topDeal = specialDeals[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-[#1a0408] to-brand-dark border-b border-brand-border">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/40 text-brand-red text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
              Limited Time Deals
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              LuxVPS{' '}
              <span className="text-brand-red">Deal</span>{' '}
              <span className="text-brand-yellow">Finder</span>
            </h1>

            <p className="text-brand-muted text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
              Cheap KVM & Ryzen VPS servers at unbeatable prices. Compare plans, filter by specs, and grab the best deal instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="#deals"
                className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm uppercase tracking-wide"
              >
                View All Deals
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <Link
                href="#compare"
                className="inline-flex items-center justify-center gap-2 border border-brand-border hover:border-brand-border-light text-brand-text font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Compare Plans
              </Link>
            </div>
          </div>

          {/* Featured deal card */}
          {topDeal && (
            <div className="flex-shrink-0 w-full md:w-72">
              <div className="relative bg-brand-card border-2 border-brand-red/60 rounded-2xl p-6 shadow-2xl shadow-brand-red/20">
                <div className="absolute -top-3 left-4">
                  <span className="bg-brand-red text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    🔥 Special Offer
                  </span>
                </div>

                <h3 className="text-white font-bold text-lg mt-2 mb-1">{topDeal.name}</h3>
                <div className="text-3xl font-extrabold text-white mb-3">
                  {formatPrice(topDeal.price)}
                  <span className="text-brand-muted text-sm font-normal ml-1">/mo</span>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {[
                    topDeal.specs.ram + ' RAM',
                    topDeal.specs.cpu,
                    topDeal.specs.disk,
                    topDeal.specs.bandwidth + ' Bandwidth',
                  ].map((spec, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-brand-muted">
                      <svg className="w-3.5 h-3.5 text-brand-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-brand-text">{spec}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={topDeal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-brand-red hover:bg-brand-red-dark text-white font-bold py-2.5 rounded-lg transition-colors text-sm uppercase tracking-wide"
                >
                  Grab This Deal →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-brand-muted">
          <div className="flex items-center gap-2">
            <span className="text-brand-green font-bold text-lg">{specialDeals.length}+</span>
            Special Offers
          </div>
          <div className="w-px h-5 bg-brand-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-brand-yellow font-bold text-lg">24h</span>
            Price Updates
          </div>
          <div className="w-px h-5 bg-brand-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-brand-red font-bold text-lg">KVM</span>
            Full Root Access
          </div>
        </div>
      </div>
    </section>
  );
}

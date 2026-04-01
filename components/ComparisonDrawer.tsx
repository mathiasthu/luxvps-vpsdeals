'use client';

import { Deal } from '@/lib/deals';
import { useCurrency } from '@/context/CurrencyContext';

interface ComparisonDrawerProps {
  deals: Deal[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

function parseRamGB(ram: string): number {
  const m = ram.match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function parsePriceNum(price: number): number {
  return price;
}

function getBestIdx(values: (number | null)[], higherIsBetter: boolean): number {
  const valid = values.map((v, i) => ({ v, i })).filter((x) => x.v !== null) as { v: number; i: number }[];
  if (valid.length === 0) return -1;
  return valid.reduce((best, cur) =>
    higherIsBetter ? (cur.v > best.v ? cur : best) : cur.v < best.v ? cur : best
  ).i;
}

const SPEC_ROWS: {
  key: string;
  label: string;
  extract: (d: Deal) => string;
  numericExtract?: (d: Deal) => number | null;
  higherIsBetter?: boolean;
}[] = [
  { key: 'price', label: 'Price/mo', extract: (d) => `€${d.price.toFixed(2)}`, numericExtract: (d) => d.price, higherIsBetter: false },
  { key: 'ram', label: 'RAM', extract: (d) => d.specs.ram, numericExtract: (d) => parseRamGB(d.specs.ram), higherIsBetter: true },
  { key: 'cpu', label: 'CPU', extract: (d) => d.specs.cpu },
  { key: 'disk', label: 'Storage', extract: (d) => d.specs.disk },
  { key: 'bw', label: 'Bandwidth', extract: (d) => d.specs.bandwidth },
  { key: 'loc', label: 'Location', extract: (d) => d.specs.location ?? '—' },
  { key: 'stock', label: 'Availability', extract: (d) => (d.inStock ? 'In Stock' : 'Out of Stock') },
];

export default function ComparisonDrawer({ deals, onRemove, onClose }: ComparisonDrawerProps) {
  const { formatPrice } = useCurrency();

  if (deals.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-label="Compare VPS Deals">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative bg-brand-dark border-t-2 border-brand-red rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-brand-dark/95 backdrop-blur z-10 flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <h2 className="text-white font-bold text-lg">
            Comparing {deals.length} Plan{deals.length > 1 ? 's' : ''}
          </h2>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-white transition-colors p-1 rounded-lg hover:bg-brand-card"
            aria-label="Close comparison"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left px-6 py-3 text-brand-muted text-sm font-medium w-32">Spec</th>
                {deals.map((deal) => (
                  <th key={deal.id} className="px-4 py-3 text-center min-w-44">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-brand-text font-bold text-sm">{deal.name}</span>
                      <button
                        onClick={() => onRemove(deal.id)}
                        className="text-brand-muted hover:text-brand-red text-xs transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((row) => {
                const values = deals.map((d) => row.numericExtract?.(d) ?? null);
                const bestIdx = row.numericExtract
                  ? getBestIdx(values, row.higherIsBetter ?? true)
                  : -1;

                return (
                  <tr key={row.key} className="border-b border-brand-border/50 hover:bg-brand-card/40 transition-colors">
                    <td className="px-6 py-3 text-brand-muted text-sm font-medium">{row.label}</td>
                    {deals.map((deal, idx) => {
                      const isBest = bestIdx === idx;
                      const displayValue =
                        row.key === 'price'
                          ? `${formatPrice(deal.price)}/mo`
                          : row.extract(deal);

                      return (
                        <td
                          key={deal.id}
                          className={`px-4 py-3 text-center text-sm ${
                            isBest
                              ? 'text-brand-green font-bold'
                              : row.key === 'stock'
                              ? deal.inStock
                                ? 'text-brand-green'
                                : 'text-brand-red'
                              : 'text-brand-text'
                          }`}
                        >
                          {isBest && (
                            <span className="inline-flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {displayValue}
                            </span>
                          )}
                          {!isBest && displayValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Order buttons */}
              <tr>
                <td className="px-6 py-4 text-brand-muted text-sm">Order</td>
                {deals.map((deal) => (
                  <td key={deal.id} className="px-4 py-4 text-center">
                    <a
                      href={deal.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-wide"
                    >
                      Order Now
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

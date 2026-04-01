'use client';

import { useState, useMemo } from 'react';
import { Deal, DealCategory } from '@/lib/deals';
import DealCard from './DealCard';
import FilterBar, { FilterState, SortOption } from './FilterBar';
import ComparisonDrawer from './ComparisonDrawer';

interface DealGridProps {
  deals: Deal[];
}

function parseRamGB(ram: string): number {
  const m = ram.match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

function sortDeals(deals: Deal[], sort: SortOption): Deal[] {
  return [...deals].sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'ram-desc':
        return parseRamGB(b.specs.ram) - parseRamGB(a.specs.ram);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
}

function filterDeals(deals: Deal[], filters: FilterState): Deal[] {
  return deals.filter((d) => {
    if (filters.category !== 'all' && d.category !== filters.category) return false;
    if (filters.minRam > 0 && parseRamGB(d.specs.ram) < filters.minRam) return false;
    if (filters.maxPrice < 999 && d.price > filters.maxPrice) return false;
    if (filters.location && d.specs.location !== filters.location) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = `${d.name} ${d.specs.ram} ${d.specs.cpu} ${d.specs.disk} ${d.specs.location ?? ''}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export default function DealGrid({ deals }: DealGridProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    minRam: 0,
    maxPrice: 999,
    location: '',
    sort: 'price-asc',
    search: '',
  });

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const locations = useMemo(() => {
    const locs = deals.map((d) => d.specs.location).filter(Boolean) as string[];
    return [...new Set(locs)].sort();
  }, [deals]);

  const filtered = useMemo(() => {
    return sortDeals(filterDeals(deals, filters), filters.sort);
  }, [deals, filters]);

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  const compareDeals = deals.filter((d) => compareIds.includes(d.id));

  return (
    <div id="deals">
      <FilterBar
        filters={filters}
        onChange={setFilters}
        locations={locations}
        dealCount={filtered.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-brand-text font-semibold text-lg mb-2">No deals found</h3>
            <p className="text-brand-muted text-sm">
              Try adjusting your filters to see more results.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onCompare={toggleCompare}
                isComparing={compareIds.includes(deal.id)}
                isCompareDisabled={compareIds.length >= 4}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky compare bar */}
      {compareIds.length >= 1 && !drawerOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand-card border-t-2 border-brand-red p-4 animate-slide-up">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto">
              <span className="text-brand-muted text-sm whitespace-nowrap">
                {compareIds.length} selected
              </span>
              {compareDeals.map((d) => (
                <span
                  key={d.id}
                  className="flex items-center gap-1.5 bg-brand-dark border border-brand-border rounded-lg px-3 py-1 text-sm text-brand-text whitespace-nowrap"
                >
                  {d.name}
                  <button
                    onClick={() => toggleCompare(d.id)}
                    className="text-brand-muted hover:text-brand-red ml-1"
                    aria-label={`Remove ${d.name} from comparison`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {compareIds.length >= 2 && (
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="bg-brand-red hover:bg-brand-red-dark text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors uppercase tracking-wide"
                >
                  Compare ({compareIds.length})
                </button>
              )}
              <button
                onClick={() => setCompareIds([])}
                className="text-brand-muted hover:text-brand-red text-sm transition-colors px-2"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison drawer */}
      {drawerOpen && (
        <ComparisonDrawer
          deals={compareDeals}
          onRemove={(id) => {
            toggleCompare(id);
            if (compareIds.length <= 1) setDrawerOpen(false);
          }}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}

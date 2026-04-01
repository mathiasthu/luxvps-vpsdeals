'use client';

import { DealCategory, CATEGORY_LABELS } from '@/lib/deals';

export type SortOption = 'price-asc' | 'price-desc' | 'ram-desc' | 'name-asc';

export interface FilterState {
  category: DealCategory | 'all';
  minRam: number;
  maxPrice: number;
  location: string;
  sort: SortOption;
  search: string;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  locations: string[];
  dealCount: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'ram-desc', label: 'Most RAM' },
  { value: 'name-asc', label: 'Name A–Z' },
];

const RAM_OPTIONS = [0, 1, 2, 4, 8, 16, 32];

const CATEGORIES: { value: DealCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Deals' },
  { value: 'special-offer', label: CATEGORY_LABELS['special-offer'] },
  { value: 'kvm-rootserver', label: CATEGORY_LABELS['kvm-rootserver'] },
  { value: 'ryzen-kvm', label: CATEGORY_LABELS['ryzen-kvm'] },
];

export default function FilterBar({ filters, onChange, locations, dealCount }: FilterBarProps) {
  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="sticky top-0 z-30 bg-brand-dark/95 backdrop-blur border-b border-brand-border py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => set('category', cat.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                filters.category === cat.value
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-card border border-brand-border text-brand-muted hover:border-brand-border-light hover:text-brand-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="ml-auto text-sm text-brand-muted self-center">
            {dealCount} deal{dealCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Search + filters row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-40">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search deals..."
              value={filters.search}
              onChange={(e) => set('search', e.target.value)}
              className="w-full bg-brand-card border border-brand-border text-brand-text text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-brand-red placeholder:text-brand-muted/60 transition-colors"
            />
          </div>

          {/* Min RAM */}
          <div className="flex items-center gap-2">
            <label className="text-brand-muted text-xs whitespace-nowrap">Min RAM</label>
            <select
              value={filters.minRam}
              onChange={(e) => set('minRam', Number(e.target.value))}
              className="bg-brand-card border border-brand-border text-brand-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-brand-red transition-colors"
            >
              {RAM_OPTIONS.map((gb) => (
                <option key={gb} value={gb}>
                  {gb === 0 ? 'Any' : `${gb} GB`}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          {locations.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-brand-muted text-xs whitespace-nowrap">Location</label>
              <select
                value={filters.location}
                onChange={(e) => set('location', e.target.value)}
                className="bg-brand-card border border-brand-border text-brand-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-brand-red transition-colors"
              >
                <option value="">Any</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-brand-muted text-xs whitespace-nowrap">Sort</label>
            <select
              value={filters.sort}
              onChange={(e) => set('sort', e.target.value as SortOption)}
              className="bg-brand-card border border-brand-border text-brand-text text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-brand-red transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset */}
          {(filters.category !== 'all' ||
            filters.minRam > 0 ||
            filters.location ||
            filters.search ||
            filters.sort !== 'price-asc') && (
            <button
              onClick={() =>
                onChange({
                  category: 'all',
                  minRam: 0,
                  maxPrice: 999,
                  location: '',
                  sort: 'price-asc',
                  search: '',
                })
              }
              className="text-brand-muted hover:text-brand-red text-xs transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

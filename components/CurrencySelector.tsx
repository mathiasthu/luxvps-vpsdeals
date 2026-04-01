'use client';

import { SUPPORTED_CURRENCIES, CURRENCY_SYMBOLS, type SupportedCurrency } from '@/lib/currency';
import { useCurrency } from '@/context/CurrencyContext';

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="relative">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
        className="appearance-none bg-brand-card border border-brand-border text-brand-text text-sm rounded-lg px-3 py-1.5 pr-7 cursor-pointer focus:outline-none focus:border-brand-red hover:border-brand-border-light transition-colors"
        aria-label="Select currency"
      >
        {SUPPORTED_CURRENCIES.map((c) => (
          <option key={c} value={c}>
            {CURRENCY_SYMBOLS[c]} {c}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <svg className="w-3.5 h-3.5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

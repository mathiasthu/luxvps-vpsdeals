'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SUPPORTED_CURRENCIES,
  CURRENCY_SYMBOLS,
  type SupportedCurrency,
  type ExchangeRates,
} from '@/lib/currency';

interface CurrencyContextValue {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  rates: ExchangeRates;
  formatPrice: (eurPrice: number) => string;
  symbol: string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'EUR',
  setCurrency: () => {},
  rates: { eur: 1 },
  formatPrice: (p) => `€${p.toFixed(2)}`,
  symbol: '€',
  loading: false,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<SupportedCurrency>('EUR');
  const [rates, setRates] = useState<ExchangeRates>({ eur: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exchange-rates')
      .then((r) => r.json())
      .then((data: ExchangeRates) => {
        setRates({ eur: 1, ...data });
      })
      .catch(() => {
        // Fallback silently
      })
      .finally(() => setLoading(false));
  }, []);

  // Persist currency in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('preferred-currency') as SupportedCurrency | null;
    if (saved && SUPPORTED_CURRENCIES.includes(saved)) {
      setCurrencyState(saved);
    }
  }, []);

  function setCurrency(c: SupportedCurrency) {
    setCurrencyState(c);
    localStorage.setItem('preferred-currency', c);
  }

  function formatPrice(eurPrice: number): string {
    const rate = rates[currency.toLowerCase()] ?? 1;
    const converted = eurPrice * rate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        formatPrice,
        symbol: CURRENCY_SYMBOLS[currency],
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export const SUPPORTED_CURRENCIES = [
  'EUR', 'USD', 'GBP', 'CHF', 'PLN', 'SEK',
  'NOK', 'DKK', 'CAD', 'AUD', 'JPY', 'INR',
  'SGD', 'NZD', 'HUF', 'CZK', 'BRL', 'TRY', 'AED',
  'MXN', 'ZAR', 'THB', 'MYR', 'PHP', 'IDR',
  'KRW', 'SAR', 'QAR', 'UAH', 'RON', 'BGN', 'HRK',
] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  CHF: 'Fr',
  PLN: 'zł',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  CAD: 'CA$',
  AUD: 'A$',
  JPY: '¥',
  INR: '₹',
  SGD: 'S$',
  NZD: 'NZ$',
  HUF: 'Ft',
  CZK: 'Kč',
  BRL: 'R$',
  TRY: '₺',
  AED: 'د.إ',
  MXN: 'MX$',
  ZAR: 'R',
  THB: '฿',
  MYR: 'RM',
  PHP: '₱',
  IDR: 'Rp',
  KRW: '₩',
  SAR: '﷼',
  QAR: 'QR',
  UAH: '₴',
  RON: 'lei',
  BGN: 'лв',
  HRK: 'kn',
};

export type ExchangeRates = Record<string, number>;

const RATES_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json';

// Fallback rates in case API is unavailable
const FALLBACK_RATES: ExchangeRates = {
  eur: 1,
  usd: 1.08,
  gbp: 0.86,
  chf: 0.97,
  pln: 4.28,
  sek: 11.2,
  nok: 11.6,
  dkk: 7.46,
  cad: 1.47,
  aud: 1.65,
  jpy: 162,
  inr: 89.5,
  sgd: 1.45,
  nzd: 1.78,
  huf: 395,
  czk: 25.1,
  brl: 5.5,
  try: 35.2,
  aed: 3.97,
  mxn: 19.8,
  zar: 20.1,
  thb: 38.5,
  myr: 5.05,
  php: 62.5,
  idr: 17500,
  krw: 1450,
  sar: 4.05,
  qar: 3.93,
  uah: 44.5,
  ron: 4.97,
  bgn: 1.96,
  hrk: 7.53,
};

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    const res = await fetch(RATES_URL, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.warn('[currency] Failed to fetch exchange rates, using fallback');
      return FALLBACK_RATES;
    }

    const data = await res.json();
    // Response shape: { date: "...", eur: { usd: 1.08, gbp: 0.86, ... } }
    const rates: ExchangeRates = data?.eur ?? {};
    rates['eur'] = 1;
    return rates;
  } catch (err) {
    console.error('[currency] Error fetching exchange rates:', err);
    return FALLBACK_RATES;
  }
}

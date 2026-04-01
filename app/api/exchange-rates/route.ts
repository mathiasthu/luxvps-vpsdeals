import { NextResponse } from 'next/server';
import { fetchExchangeRates } from '@/lib/currency';

export const revalidate = 86400;

export async function GET() {
  const rates = await fetchExchangeRates();
  return NextResponse.json(rates, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
    },
  });
}

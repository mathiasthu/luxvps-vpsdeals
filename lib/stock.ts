/**
 * Live stock from the reseller API — the same source Luxvps-stock-bot polls.
 *
 * Server-only. The API base URL and token come from the environment and are never
 * serialised into a page, a prop, or a response body: pages ship nothing but the
 * boolean each deal ends up with, so a visitor can't see where stock came from.
 *
 * Read-only by design — this module issues GETs and nothing else.
 */
import { CATALOG, DEFAULT_LINES } from './stock-catalog';

/** How long a stock read stays fresh. Drives ISR for every page that shows stock. */
export const STOCK_REVALIDATE_SECONDS = 300;

const FETCH_TIMEOUT_MS = 10_000;

/** A packet as the reseller API returns it. Only `active` matters here. */
interface Packet {
  id?: string;
  active?: number;
  [key: string]: unknown;
}

function assertServer(): void {
  if (typeof window !== 'undefined') {
    throw new Error('lib/stock is server-only — never import it from a client component');
  }
}

function baseUrl(): string {
  return (process.env.LUXVPS_API_BASE_URL ?? '').replace(/\/+$/, '');
}

function token(): string {
  return process.env.LUXVPS_API_TOKEN ?? '';
}

function lines(): string[] {
  const override = process.env.LUXVPS_API_LINES;
  if (!override) return DEFAULT_LINES;
  return override.split(',').map((s) => s.trim()).filter(Boolean);
}

/**
 * Strip a secret out of anything on its way to a log or an error message. The token
 * rides in the query string, so fetch's own errors embed it.
 */
function redact(value: unknown): string {
  let s = String(value);
  const secret = token();
  if (secret) s = s.split(secret).join('<redacted>');
  return s;
}

/**
 * A packet is orderable when its `active` flag is non-zero.
 *   0 -> sold out / disabled
 *   1 -> in stock now (dynamicstock=1, live-tracked)
 *   2 -> available, not stock-limited (dynamicstock=0)
 *
 * Mirrors Luxvps-stock-bot's availability.py — change both together.
 */
export function isAvailable(packet: Packet): boolean {
  return packet.active === 1 || packet.active === 2;
}

/**
 * Reduce a billing.luxvps.net store URL to a stable key: the `rp` route
 * (`/store/epyc/epyc-tiny`), or the path if there isn't one.
 */
export function normalizeStoreUrl(url: string): string {
  try {
    const parsed = new URL(url, 'https://billing.luxvps.net');
    const rp = parsed.searchParams.get('rp');
    const path = (rp ?? parsed.pathname).trim();
    return path.toLowerCase().replace(/\/+$/, '');
  } catch {
    return url.trim().toLowerCase().replace(/\/+$/, '');
  }
}

async function fetchLine(slug: string): Promise<Packet[]> {
  const url = `${baseUrl()}/kvmserver/line/${encodeURIComponent(slug)}?token=${encodeURIComponent(token())}`;

  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        next: { revalidate: STOCK_REVALIDATE_SECONDS },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(`unexpected response shape: ${typeof data}`);
      return data as Packet[];
    } catch (err) {
      if (attempt === 0) continue;
      throw new Error(`line '${slug}': ${redact(err instanceof Error ? err.message : err)}`);
    }
  }
  return [];
}

/**
 * Live availability keyed by normalized store URL.
 *
 * A packet only appears in the map when it was actually observed this cycle — a line
 * that fails to fetch leaves its packets *absent*, never `false`, so a transient API
 * hiccup can't be mistaken for a sell-out. Callers fall back to whatever the store page
 * said. An empty map means "no live stock available"; it never means "everything's gone".
 */
export async function getStockByStoreUrl(): Promise<Map<string, boolean>> {
  assertServer();

  const stock = new Map<string, boolean>();
  if (!baseUrl() || !token()) {
    console.warn('[stock] LUXVPS_API_BASE_URL / LUXVPS_API_TOKEN not set — falling back to scraped stock');
    return stock;
  }

  const byId = new Map(CATALOG.map((p) => [p.id, p]));

  const results = await Promise.allSettled(lines().map((slug) => fetchLine(slug)));
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[stock]', redact(result.reason?.message ?? result.reason));
      continue;
    }
    for (const packet of result.value) {
      if (!packet || typeof packet !== 'object') continue;
      const entry = packet.id ? byId.get(packet.id) : undefined;
      if (!entry) continue;
      stock.set(normalizeStoreUrl(entry.orderUrl), isAvailable(packet));
    }
  }

  console.log(`[stock] ${stock.size}/${CATALOG.length} packages resolved from the reseller API`);
  return stock;
}

# HANDOFF

_Last updated: 2026-08-01_

## What this is

"LuxVPS Deal Finder" — public Next.js site at **https://deals.luxvps.net** (repo `mathiasthu/luxvps-vpsdeals`). It scrapes billing.luxvps.net store pages at build/ISR time (24h revalidate) and lists the packages as deals. No database; `lib/scraper.ts` fetches and cheerio-parses the WHMCS product cards. **Stock is not scraped** — it comes from the reseller API, the same source Luxvps-stock-bot polls (see below).

Default branch is `claude/vps-deal-finder-seo-5Opgm` — there is no `main`.

## Current state

- **2026-08-01: SEO pass + Frankfurt as the canonical location.** Every LuxVPS node is in
  the same Frankfurt facility, but the store pages almost never say so, so most deals had
  no location at all. `lib/scraper.ts` now exports `DEFAULT_LOCATION = 'Frankfurt, Germany'`
  and `normalizeLocation()` — anything the pages say that means Germany/Frankfurt collapses
  to that one string, and an unparsed location falls back to it. `lib/seo.ts` re-exports it
  as `DATACENTER_LOCATION`/`DATACENTER_CITY` so copy, metadata and schema.org can't drift.
  - Titles/descriptions rewritten around "VPS in Frankfurt, Germany" and trimmed toward
    ~60 chars; keywords now target German/Frankfurt intent.
  - **The FAQ markup was ineligible before** — deal pages emitted `FAQPage` JSON-LD with no
    matching on-page text, which Google ignores. `components/FaqSection.tsx` now renders the
    same entries the schema is built from (`dealFaqEntries` / `homeFaqEntries` /
    `categoryFaqEntries` in `lib/seo.ts`). Keep those two fed from one source.
  - Home and category pages gained visible FAQ blocks (with schema); home also has a
    "Why a VPS in Frankfurt?" section — real crawlable copy on the location keyword.
  - Product schema gained `additionalProperty` specs, a monthly `UnitPriceSpecification`,
    and `availableAtOrFrom` pointing at the Frankfurt Place; `ItemList` entries carry
    `sku`/`brand`; Organization/WebSite gained descriptions and a publisher.
  - **Fixed a broken OG image**: home and category metadata pointed at `/og-image.png`,
    which does not exist in `public/`. Removed those hardcoded paths and added
    `app/opengraph-image.tsx` (generated, applies to every route except deal pages, which
    keep their own). Satori is strict — any element with more than one child needs an
    explicit `display`.
  - Footer no longer says "Vibe coded"; it's just "Made with ❤️". The dead
    `<link rel="alternate icon" href="/favicon.ico">` is gone (there is no such file), so
    the console 404 on the homepage is gone too.
  - Both `<a href="/">` internal links on the category page are now `<Link>` — that was the
    2 lint errors listed under Next steps.

- **2026-08-01: stock now comes from the reseller API, not the store pages.** The WHMCS
  `<span class="qty">` counter was a fixed number ("30 Available" on every EPYC tier), so
  everything read as in stock forever. Now `lib/stock.ts` polls the same reseller API
  endpoint as Luxvps-stock-bot (`GET {base}/kvmserver/line/{slug}?token=…`) and applies
  the same rule — `active ∈ (1, 2)` is available, `0` is sold out.
  - `lib/stock-catalog.ts` is generated from `Luxvps-stock-bot/config.json`: the 10 line
    slugs plus a packet-id → store-URL map for all 24 packages. The join onto scraped
    deals is `Deal.sourceUrl` ↔ `order_urls`, normalized to the `rp=/store/...` route —
    verified exact, 24/24 both ways, no orphans.
  - **Failure is "unknown", never "sold out"**: a line that errors leaves its packets out
    of the map and those deals keep their scraped value, so an API hiccup can't fake a
    sell-out. No env configured at all → warns once and falls back entirely.
  - Pages that show stock revalidate every **5 min** (`STOCK_REVALIDATE_SECONDS`); the
    scraped catalog underneath still has its own 24h fetch cache, so this only re-renders,
    it doesn't re-scrape. `sitemap.xml` calls `getAllDeals({ includeStock: false })` and
    stays at 24h.
- **2026-08-01: Special Offers removed, EPYC line added.** Categories are now `kvm-rootserver` / `ryzen-kvm` / `epyc`, matching the Luxvps-stock-bot lineup (Xeon 10 / Ryzen 8 / EPYC 6 = 24 deals). The `special-offer` scrape source, category, and `'special'` badge are gone everywhere (types, labels, FilterBar, nav/footer, category pages, sitemap, SEO copy, OG image).
- HeroBanner no longer takes `specialDeals` — it takes `deals` (in-stock, price-sorted; featured card = cheapest) plus `totalDeals`.
- **Deployed and verified live**: `/` returns 200 with EPYC KVM in the nav and zero special-offer references, `/category/epyc` returns 200 showing 6 deals, `/category/special-offer` returns 404.

## Secrets / env

`lib/stock.ts` needs `LUXVPS_API_BASE_URL` + `LUXVPS_API_TOKEN` (optionally
`LUXVPS_API_LINES`) — see `.env.example`. Copy the values from Luxvps-stock-bot's `.env`
(`/opt/luxvps-stock-bot/.env` on `155.94.150.24`).

On Plesk they go in **Node.js panel → Custom environment variables**, or in `.env.local`
at the app root (`chmod 600`, gitignored). Never prefix them with `NEXT_PUBLIC_`.

Nothing about the upstream reaches the browser: the fetch happens during server render,
and pages ship only the resulting boolean. Verified against a mock API — rendered HTML and
`.next/static` contain no token, base URL, packet id, or line slug.

## Deployment

No Plesk Git integration and no CI — deploys are manual over SSH. The server holds a full clone with `.git` at the app root.

- **Host**: Plesk (`plesk.luxvps.net`), subscription `luxvps.xyz`, domain id 248 / dom_id 46.
- **App root**: `/var/www/vhosts/luxvps.xyz/deals.luxvps.net`
- **System user**: `luxvps.xyz_bgbqbpflohp` · **Node**: 23.11.1 · **Startup file**: `.next/standalone/server.js`

Runbook:

1. Push to GitHub from local.
2. Root SSH terminal (`https://plesk.luxvps.net/modules/ssh-terminal/index.php`): `cd` to the app root, `git pull`.
3. Build **as the subscription user**, never as root — either the Node.js panel's *Run script → build*, or from root:
   `su - luxvps.xyz_bgbqbpflohp -s /bin/bash -c 'cd /var/www/vhosts/luxvps.xyz/deals.luxvps.net && npm run build'`
4. *Restart App* in the Node.js panel (or `touch tmp/restart.txt`).

## Gotchas

- **Two different SSH terminals.** The one opened from Websites & Domains runs as the subscription user; `/modules/ssh-terminal/index.php` runs as root. Root has no `npm` on its PATH (Plesk's Node lives under `/opt/plesk/node/`), and the subscription user can't write root-owned files — which terminal you're in decides which commands work.
- **Ownership convention — this broke the site on 2026-08-01.** The document root *directory itself* must be `luxvps.xyz_bgbqbpflohp:psaserv` mode 750 (Apache is in `psaserv` and needs to traverse it); the files *inside* are group `psacln`. A recursive `chown -R ...:psacln` on the app root flattens that and Apache starts returning a **403 Forbidden** (Plesk's own error page, served through Cloudflare). Fix: `chown <user>:psaserv <docroot>` on that one directory, no `-R`. Compare against a working sibling domain with `ls -ld`. `plesk repair fs deals.luxvps.net` restores the conventions if more is off.
- App files were historically owned by `root` from an early deploy, which made every build fail with `EACCES … .next/trace`. Now corrected to the subscription user; keep it that way by never building as root.
- Dependencies were cleaned up on 2026-08-01 — plain `npm install` and `npm ci` both work now, no `--legacy-peer-deps`. If that flag ever becomes necessary again, something has drifted; fix the conflict rather than papering over it with the flag.
- Scraper category slugs (`epyc` etc.) must match the billing store URL path segments; order URLs come straight from the scraped page.
- Cloudflare sits in front of the origin — hard-refresh when verifying, and don't mistake an origin error for a CDN one (`cf-cache-status: DYNAMIC` plus a Plesk error page means it came from the origin).
- No `public/favicon.ico`. The `<link>` referencing it was removed, but browsers still probe `/favicon.ico` on their own, so a 404 for it in the network log is expected. `favicon.svg` covers every current browser.
- FAQ copy lives in `lib/seo.ts` (`dealFaqEntries` / `homeFaqEntries` / `categoryFaqEntries`) and is rendered by `components/FaqSection.tsx`. Changing one without the other silently kills the rich result — the markup must match visible text.

## Next steps

- **The server still has April's `node_modules`.** The next deploy should run `npm install` (now that it works cleanly) before `npm run build`, as the subscription user, so the server picks up eslint 9 and the regenerated lockfile.
- `npm run lint` reports 1 error + 3 warnings: a `setState`-in-effect in `context/CurrencyContext.tsx:50` and three unused vars. None block the build.
- **The reseller API integration has never run against the live endpoint** — it was verified
  end to end against a local mock (24/24 packages resolved; the two packets mocked
  `active: 0` rendered "Out of Stock" and `schema.org/OutOfStock`). On the first real
  deploy, check the build log for `[stock] 24/24 packages resolved from the reseller API`;
  a lower number means the catalog and the live lines have drifted apart.
- `lib/stock-catalog.ts` duplicates Luxvps-stock-bot's `config.json`. Adding or removing a
  package means editing both. If that gets annoying, point this site at the bot's
  `stock.json` snapshot instead — it's already token-free, just not deployed yet.
- Optionally add a favicon.

# HANDOFF

_Last updated: 2026-08-01_

## What this is

"LuxVPS Deal Finder" — public Next.js site (repo `mathiasthu/luxvps-vpsdeals`) that scrapes billing.luxvps.net store pages at build/ISR time (24h revalidate) and lists the packages as deals. No database; `lib/scraper.ts` fetches + cheerio-parses the WHMCS product cards.

## Current state

- **2026-08-01: Special Offers removed, EPYC added.** Categories are now `kvm-rootserver` / `ryzen-kvm` / `epyc`, matching the Luxvps-stock-bot lineup (Xeon 10 / Ryzen 8 / EPYC 6 = 24 deals). The `special-offer` store page and the `'special'` badge type are gone everywhere (types, labels, FilterBar, nav/footer, category pages, sitemap, SEO copy, OG image).
- HeroBanner no longer takes `specialDeals` — it takes `deals` (in-stock, sorted by price; featured card = cheapest) + `totalDeals`.
- Build verified: `npm run build` passes, live scrape returns 10+8+6 deals, `/category/epyc` renders, `/category/special-offer` 404s.
- Not yet committed/pushed as of this writing.

## Gotchas

- `npm install` fails on a peer-dep conflict (eslint 10 vs eslint-config-next wants <10) and the lockfile is out of sync so `npm ci` fails too — use `npm install --legacy-peer-deps`.
- Scraper category slugs (`epyc` etc.) must match the billing store URL path segments; order URLs come straight from the scraped page.
- Favicon 404s (no `public/favicon.ico`) — cosmetic, pre-existing.

## Next steps

- Commit + push (deploy follows the repo's usual pipeline).
- Optionally add a favicon.

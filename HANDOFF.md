# HANDOFF

_Last updated: 2026-08-01_

## What this is

"LuxVPS Deal Finder" — public Next.js site at **https://deals.luxvps.net** (repo `mathiasthu/luxvps-vpsdeals`). It scrapes billing.luxvps.net store pages at build/ISR time (24h revalidate) and lists the packages as deals. No database; `lib/scraper.ts` fetches and cheerio-parses the WHMCS product cards.

Default branch is `claude/vps-deal-finder-seo-5Opgm` — there is no `main`.

## Current state

- **2026-08-01: Special Offers removed, EPYC line added.** Categories are now `kvm-rootserver` / `ryzen-kvm` / `epyc`, matching the Luxvps-stock-bot lineup (Xeon 10 / Ryzen 8 / EPYC 6 = 24 deals). The `special-offer` scrape source, category, and `'special'` badge are gone everywhere (types, labels, FilterBar, nav/footer, category pages, sitemap, SEO copy, OG image).
- HeroBanner no longer takes `specialDeals` — it takes `deals` (in-stock, price-sorted; featured card = cheapest) plus `totalDeals`.
- **Deployed and verified live**: `/` returns 200 with EPYC KVM in the nav and zero special-offer references, `/category/epyc` returns 200 showing 6 deals, `/category/special-offer` returns 404.

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
- **Local installs need `npm install --legacy-peer-deps`** — eslint 10 conflicts with what eslint-config-next wants, and the lockfile is out of sync so `npm ci` fails too.
- Scraper category slugs (`epyc` etc.) must match the billing store URL path segments; order URLs come straight from the scraped page.
- Cloudflare sits in front of the origin — hard-refresh when verifying, and don't mistake an origin error for a CDN one (`cf-cache-status: DYNAMIC` plus a Plesk error page means it came from the origin).
- No `public/favicon.ico`, so the site 404s on it. Cosmetic, pre-existing.

## Next steps

- Optionally add a favicon.
- The lockfile / eslint peer-dep mismatch is worth cleaning up so plain `npm install` works on the server.

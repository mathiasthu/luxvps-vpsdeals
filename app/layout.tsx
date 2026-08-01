import type { Metadata } from 'next';
import './globals.css';
import { CurrencyProvider } from '@/context/CurrencyContext';
import CurrencySelector from '@/components/CurrencySelector';
import Link from 'next/link';
import { buildHomeMetadata, buildOrganizationSchema } from '@/lib/seo';

export const metadata: Metadata = {
  ...buildHomeMetadata(),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deals.luxvps.net'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://billing.luxvps.net" />
        <meta name="theme-color" content="#E63946" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-dark text-brand-text antialiased">
        <CurrencyProvider>
          {/* Navigation */}
          <header className="border-b border-brand-border bg-brand-dark/95 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 font-extrabold text-lg tracking-tight"
              >
                <span className="text-brand-red">Lux</span>
                <span className="text-white">VPS</span>
                <span className="text-brand-yellow ml-1 font-medium text-sm hidden sm:inline">
                  Deal Finder
                </span>
              </Link>

              <nav className="hidden sm:flex items-center gap-6 text-sm text-brand-muted">
                <Link href="/#deals" className="hover:text-brand-text transition-colors">
                  All Deals
                </Link>
                <Link href="/category/kvm-rootserver" className="hover:text-brand-text transition-colors">
                  Root Servers
                </Link>
                <Link href="/category/ryzen-kvm" className="hover:text-brand-text transition-colors">
                  Ryzen KVM
                </Link>
                <Link href="/category/epyc" className="hover:text-brand-text transition-colors">
                  EPYC KVM
                </Link>
              </nav>

              <div className="flex items-center gap-3">
                <CurrencySelector />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-brand-border bg-brand-dark mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="font-extrabold text-lg mb-1">
                    <span className="text-brand-red">Lux</span>
                    <span className="text-white">VPS</span>
                    <span className="text-brand-muted ml-1 font-normal text-sm">Deal Finder</span>
                  </div>
                  <p className="text-brand-muted text-sm max-w-sm">
                    Aggregating the best VPS deals from LuxVPS — Xeon, Ryzen, and EPYC KVM servers
                    hosted in Frankfurt, Germany, updated daily.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 text-sm text-brand-muted">
                  <div>
                    <div className="text-brand-text font-semibold mb-2">Deals</div>
                    <ul className="space-y-1.5">
                      <li><Link href="/category/kvm-rootserver" className="hover:text-brand-text transition-colors">KVM Root Servers</Link></li>
                      <li><Link href="/category/ryzen-kvm" className="hover:text-brand-text transition-colors">Ryzen KVM VPS</Link></li>
                      <li><Link href="/category/epyc" className="hover:text-brand-text transition-colors">EPYC KVM VPS</Link></li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-brand-text font-semibold mb-2">LuxVPS</div>
                    <ul className="space-y-1.5">
                      <li>
                        <a href="https://luxvps.net" target="_blank" rel="noopener noreferrer" className="hover:text-brand-text transition-colors">
                          LuxVPS.net
                        </a>
                      </li>
                      <li>
                        <a href="https://billing.luxvps.net" target="_blank" rel="noopener noreferrer" className="hover:text-brand-text transition-colors">
                          Billing Portal
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-brand-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-muted">
                <p>© {new Date().getFullYear()} LuxVPS Deal Finder. Prices in EUR, updated every 24 hours.</p>
                <div className="flex items-center gap-4">
                  <p>
                    All deals link directly to{' '}
                    <a href="https://billing.luxvps.net" target="_blank" rel="noopener noreferrer" className="hover:text-brand-text">
                      billing.luxvps.net
                    </a>
                  </p>
                  <p>Made with ❤️</p>
                </div>
              </div>
            </div>
          </footer>
        </CurrencyProvider>
      </body>
    </html>
  );
}

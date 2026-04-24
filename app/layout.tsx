import type { Metadata } from 'next';
import Link from 'next/link';

import { MobileNav } from '@/app/components/mobile-nav';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'PnP Hub — Print-and-Play Board Game Marketplace',
    template: '%s — PnP Hub',
  },
  description: 'Discover, buy, and optimize beautifully merchandised print-and-play board games. A warm, craft-inspired marketplace built with Next.js and SQLite.',
  keywords: ['print-and-play', 'board games', 'tabletop', 'marketplace', 'print optimizer', 'craft'],
  authors: [{ name: 'PnP Hub Contributors' }],
  openGraph: {
    title: 'PnP Hub — Print-and-Play Board Game Marketplace',
    description: 'Find a game tonight, print with confidence, and craft something beautiful by dinner.',
    siteName: 'PnP Hub',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/optimizer', label: 'Print Optimizer' },
  { href: '/designer', label: 'Designer Dashboard' },
  { href: '/community', label: 'Community' },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <div className="border-b border-[var(--border-light)] bg-[var(--bg-banner)] backdrop-blur-sm">
          <div className="section-shell flex flex-wrap items-center justify-between gap-4 py-3 text-sm text-[var(--text-secondary)]">
            <p>Local-first MVP demo · SQLite seeded with 30+ print-and-play titles</p>
            <p className="font-medium text-[var(--forest)]">Craft faster. Waste less paper.</p>
          </div>
        </div>
        <header className="sticky top-0 z-20 border-b border-[var(--border-light)] bg-[var(--bg-header)] backdrop-blur-md">
          <div className="section-shell flex items-center justify-between gap-4 py-4">
            <Link href="/" className="focus-ring flex items-center gap-3 rounded-full px-2 py-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--forest)] text-lg font-semibold text-white">PnP</span>
              <div>
                <p className="text-lg font-semibold text-[var(--ink)]">Hub</p>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--terracotta)]">Print & play marketplace</p>
              </div>
            </Link>
            <nav className="hidden items-center gap-2 text-sm font-medium text-[var(--text-body)] md:flex" aria-label="Main navigation">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="focus-ring rounded-full px-4 py-2 transition hover:bg-white/70">
                  {item.label}
                </Link>
              ))}
            </nav>
            <MobileNav items={navigation} />
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="mt-20 border-t border-[var(--border-light)] bg-[var(--bg-banner)] py-10">
          <div className="section-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--ink)]">PnP Hub</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                Discover, buy, and optimize beautifully merchandised print-and-play games. This MVP demonstrates the catalog,
                designer tooling, print workflow, and community surfaces from the PnP Hub PRD.
              </p>
            </div>
            <nav aria-label="Footer navigation" className="grid gap-3 text-sm text-[var(--text-body)] sm:grid-cols-2">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="focus-ring rounded-2xl px-4 py-3 transition hover:bg-white/70">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}

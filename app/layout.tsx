import type { Metadata } from 'next';
import Link from 'next/link';

import './globals.css';

export const metadata: Metadata = {
  title: 'PnP Hub',
  description: 'A warm, craft-inspired print-and-play marketplace MVP built with Next.js and SQLite.',
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
        <div className="border-b border-[rgba(77,57,36,0.08)] bg-[rgba(255,248,240,0.78)] backdrop-blur-sm">
          <div className="section-shell flex flex-wrap items-center justify-between gap-4 py-3 text-sm text-[rgba(58,43,31,0.72)]">
            <p>Local-first MVP demo · SQLite seeded with 30+ print-and-play titles</p>
            <p className="font-medium text-[var(--forest)]">Craft faster. Waste less paper.</p>
          </div>
        </div>
        <header className="sticky top-0 z-20 border-b border-[rgba(77,57,36,0.08)] bg-[rgba(251,246,237,0.92)] backdrop-blur-md">
          <div className="section-shell flex flex-wrap items-center justify-between gap-4 py-4">
            <Link href="/" className="focus-ring flex items-center gap-3 rounded-full px-2 py-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--forest)] text-lg font-semibold text-white">PnP</span>
              <div>
                <p className="text-lg font-semibold text-[var(--ink)]">Hub</p>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--terracotta)]">Print & play marketplace</p>
              </div>
            </Link>
            <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-[rgba(58,43,31,0.76)]">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="focus-ring rounded-full px-4 py-2 transition hover:bg-white/70">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-20 border-t border-[rgba(77,57,36,0.08)] bg-[rgba(255,248,240,0.78)] py-10">
          <div className="section-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--ink)]">PnP Hub</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[rgba(58,43,31,0.74)]">
                Discover, buy, and optimize beautifully merchandised print-and-play games. This MVP demonstrates the catalog,
                designer tooling, print workflow, and community surfaces from the PnP Hub PRD.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-[rgba(58,43,31,0.78)] sm:grid-cols-2">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="focus-ring rounded-2xl px-4 py-3 transition hover:bg-white/70">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

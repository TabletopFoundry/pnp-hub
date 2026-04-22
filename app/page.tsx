import Link from 'next/link';
import type { Metadata } from 'next';

import { GameCard } from '@/app/components/game-card';
import { MockActionButton } from '@/app/components/mock-action-button';
import { SubscriptionGrid } from '@/app/components/subscription-grid';
import { getFeaturedGames, getMonthlyCraftGame } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'PnP Hub — Print-and-Play Board Game Marketplace',
  description: 'Discover, buy, and optimize beautifully merchandised print-and-play board games.',
};

const categories = ['Strategy', 'Party', 'Solo', 'Family', 'Educational', 'Cooperative', '2-Player'];

export default function HomePage() {
  const featuredGames = getFeaturedGames();
  const craftAlong = getMonthlyCraftGame();

  return (
    <div className="pb-20">
      <section className="section-shell grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-18">
        <div className="paper-panel paper-texture rounded-[2.4rem] border border-[var(--border-light)] px-7 py-8 sm:px-10 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--terracotta)]">Print-and-play, thoughtfully merchandised</p>
          <h1 className="section-title mt-5 max-w-3xl font-semibold text-[var(--ink)]">Find a game tonight, print with confidence, and craft something beautiful by dinner.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-body)]">
            PnP Hub bundles marketplace discovery, print optimization, designer analytics, and community inspiration into one warm, paper-first experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/marketplace" className="focus-ring rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Browse the marketplace
            </Link>
            <Link href="/optimizer" className="focus-ring rounded-full border border-[var(--border-accent)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70">
              Open print optimizer
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ['30+', 'Seeded PnP games'],
              ['7', 'Curated marketplace categories'],
              ['75/25', 'Designer revenue split'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[1.5rem] bg-white/70 p-4">
                <p className="text-3xl font-semibold text-[var(--terracotta)]">{value}</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">How it works</p>
            <div className="mt-4 space-y-4">
              {[
                ['Discover', 'Search a catalog full of clear player counts, component lists, and price labels.'],
                ['Optimize', 'Choose Letter or A4, color or grayscale, and preview a home-printer-friendly layout.'],
                ['Craft', 'Use tutorials, community inspiration, and download-ready files to build with confidence.'],
              ].map(([title, body], index) => (
                <div key={title} className="flex gap-4 rounded-[1.5rem] bg-white/70 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--forest)] text-sm font-semibold text-white">0{index + 1}</span>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--ink)]">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Popular categories</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link key={category} href={`/marketplace?category=${encodeURIComponent(category)}`} className="focus-ring rounded-full bg-white/70 px-4 py-3 text-sm font-medium transition hover:bg-white">
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Featured marketplace picks</p>
            <h2 className="section-title mt-3 font-semibold text-[var(--ink)]">Warm, printable games curated for tonight’s table</h2>
          </div>
          <Link href="/marketplace" className="focus-ring rounded-full border border-[var(--border-medium)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70">
            See all games
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      <section className="section-shell mt-20 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Monthly craft along</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--ink)]">{craftAlong?.title ?? 'Festival of Kites'}</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--text-body)]">
            {craftAlong?.description ?? 'Follow a guided community build with printable extras, paper stock tips, and a tutorial bundle.'}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[var(--bg-gold-tint)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink)]">This month’s focus</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">Bright card fronts, low-ink backs, and a friendly cardstock-friendly assembly guide.</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--bg-forest-subtle)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink)]">Perfect for</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">Weekend makers who want a tidy build with plenty of table charm and room to personalize.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/community" className="focus-ring rounded-full bg-[var(--terracotta)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Join the community build
            </Link>
            {craftAlong ? (
              <Link href={`/games/${craftAlong.slug}`} className="focus-ring rounded-full border border-[var(--border-medium)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70">
                View featured game
              </Link>
            ) : null}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Subscription tiers</p>
          <h2 className="section-title mt-3 font-semibold text-[var(--ink)]">Upgrade for included games, deeper tutorials, and smarter print defaults</h2>
          <div className="mt-7">
            <SubscriptionGrid />
          </div>
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="paper-panel rounded-[2.2rem] border border-[var(--border-light)] px-7 py-8 sm:px-10">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Designer CTA</p>
              <h2 className="mt-3 text-3xl font-semibold text-[var(--ink)]">Bring your print-and-play catalog to a store built for home crafters.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-body)]">
                Upload new titles, track downloads and revenue, visualize geography trends, and show buyers exactly how your files are meant to print.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/designer" className="focus-ring rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Open designer dashboard
              </Link>
              <MockActionButton
                defaultLabel="Preview creator onboarding"
                activeLabel="Designer preview launched"
                className="focus-ring rounded-full border border-[var(--border-medium)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

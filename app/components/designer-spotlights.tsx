import Link from 'next/link';

import { StatePanel } from '@/app/components/state-panel';
import { formatCurrency } from '@/lib/format';
import type { DesignerProfile } from '@/lib/types';

type DesignerSpotlightsProps = {
  designers: DesignerProfile[];
};

export function DesignerSpotlights({ designers }: DesignerSpotlightsProps) {
  if (!designers.length) {
    return (
      <StatePanel
        eyebrow="Designer spotlights"
        title="Creator spotlights are warming up"
        description="Designer bios and featured catalog picks will appear here once the local seed dataset loads."
      />
    );
  }

  return (
    <section id="designer-spotlights" className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Designer spotlights</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Meet the makers behind the catalog</h2>
        </div>
        <span className="rounded-full bg-[var(--bg-forest-tint)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">
          {designers.length} featured creators
        </span>
      </div>
      <div className="mt-5 space-y-4">
        {designers.map((designer) => (
          <article key={designer.slug} className="rounded-[1.6rem] border border-[var(--border-light)] bg-white/80 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[var(--ink)]">{designer.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--terracotta)]">{designer.location} · {designer.headline}</p>
              </div>
              <div className="rounded-[1.25rem] bg-[var(--bg-gold-tint)] px-4 py-3 text-right text-sm text-[var(--text-body)]">
                <p className="font-semibold text-[var(--ink)]">{designer.gameCount} games</p>
                <p>{designer.totalDownloads.toLocaleString()} downloads</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--text-body)]">{designer.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {designer.specialties.map((specialty) => (
                <span key={specialty} className="rounded-full bg-[var(--bg-gold-medium)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">
                  {specialty}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
              <span>Joined {designer.joinedAt}</span>
              <span>•</span>
              <span>{formatCurrency(designer.totalRevenueCents)} revenue</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {designer.featuredGameSlug ? (
                <Link href={`/games/${designer.featuredGameSlug}`} className="focus-ring inline-flex rounded-full border border-[var(--border-medium)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70">
                  View featured game
                </Link>
              ) : null}
              <Link
                href={`/marketplace?q=${encodeURIComponent(designer.name)}`}
                className="focus-ring inline-flex rounded-full px-4 py-2 text-sm font-semibold text-[var(--forest)] underline-offset-4 hover:underline"
              >
                Browse designer catalog
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

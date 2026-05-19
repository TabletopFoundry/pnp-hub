import Link from 'next/link';

import type { CraftAlongFeature } from '@/lib/types';

type CraftAlongCalendarProps = {
  schedule: CraftAlongFeature[];
};

export function CraftAlongCalendar({ schedule }: CraftAlongCalendarProps) {
  return (
    <section id="craft-along-calendar" className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Craft-along calendar</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">See the full year of planned builds</h2>
        </div>
        <span className="rounded-full bg-[var(--bg-gold-tint)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">
          {schedule.length} months mapped
        </span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {schedule.map((entry) => (
          <article
            key={entry.id}
            className={`rounded-[1.6rem] border p-4 ${entry.isCurrent ? 'border-[var(--bg-forest-strong)] bg-[var(--bg-forest-subtle)]' : 'border-[var(--border-light)] bg-white/80'}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--terracotta)]">{entry.monthLabel}</p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--ink)]">{entry.gameTitle}</h3>
              </div>
              <span className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${entry.isCurrent ? 'bg-white text-[var(--forest)]' : 'bg-[var(--bg-gold-medium)] text-[var(--ink)]'}`}>
                {entry.isCurrent ? 'Current build' : 'Upcoming'}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">{entry.summary}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--ink)]">Material focus:</span> {entry.materialFocus}
            </p>
            <Link href={`/games/${entry.gameSlug}`} className="focus-ring mt-4 inline-flex rounded-full border border-[var(--border-medium)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70">
              Open {entry.gameTitle}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

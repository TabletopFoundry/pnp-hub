import Link from 'next/link';

import { StatePanel } from '@/app/components/state-panel';
import type { Tutorial } from '@/lib/types';

type TutorialLibraryProps = {
  tutorials: Tutorial[];
};

export function TutorialLibrary({ tutorials }: TutorialLibraryProps) {
  return (
    <section className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Tutorial library</p>
      <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Crafting tutorials</h2>
      <div className="mt-5 space-y-4">
        {tutorials.length ? (
          tutorials.map((tutorial) => (
            <article key={tutorial.id} className="rounded-[1.5rem] bg-white/80 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">{tutorial.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--terracotta)]">
                    {tutorial.difficulty} · {tutorial.estimatedTime} · {tutorial.technique}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${tutorial.accessType === 'free' ? 'bg-[var(--bg-forest-tint)] text-[var(--forest)]' : 'bg-[var(--bg-gold-medium)] text-[var(--ink)]'}`}>
                  {tutorial.accessType === 'free' ? 'Free tutorial' : 'Subscriber tutorial'}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">{tutorial.summary}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {tutorial.linkedGameSlug ? (
                  <Link
                    href={`/games/${tutorial.linkedGameSlug}`}
                    className="focus-ring inline-flex rounded-full border border-[var(--border-medium)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70"
                  >
                    Open related game
                  </Link>
                ) : (
                  <Link
                    href="/marketplace"
                    className="focus-ring inline-flex rounded-full border border-[var(--border-medium)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70"
                  >
                    Browse marketplace
                  </Link>
                )}
                {tutorial.accessType === 'subscriber' ? (
                  <Link
                    href="/community#subscription-comparison"
                    className="focus-ring inline-flex rounded-full px-4 py-2 text-sm font-semibold text-[var(--forest)] underline-offset-4 hover:underline"
                  >
                    Compare support tiers
                  </Link>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <StatePanel title="No tutorials yet" description="Tutorial cards will appear here once content is seeded into the local database." />
        )}
      </div>
    </section>
  );
}

import Link from 'next/link';

import { StatePanel } from '@/app/components/state-panel';
import { formatCurrency } from '@/lib/format';
import type { GameListingView } from '@/lib/types';

type DesignerGamesTableProps = {
  games: GameListingView[];
  sectionId?: string;
};

export function DesignerGamesTable({ games, sectionId }: DesignerGamesTableProps) {
  return (
    <section id={sectionId} className="mt-8 paper-panel rounded-[2rem] border border-[var(--border-light)] p-6 scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">My games</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Live catalog and current drafts</h2>
        </div>
        <span className="rounded-full bg-[var(--bg-gold-tint)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">{games.length} tracked titles</span>
      </div>
      {games.length ? (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[760px] border-separate border-spacing-y-3 text-sm text-[var(--text-body)]">
            <caption className="pb-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--terracotta)]">
              Titles managed by Paper Sparrow Studio. Published rows include live listing links, while draft rows stay local until editorial review finishes.
            </caption>
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.18em] text-[var(--terracotta)]">
                <th className="px-4">Game</th>
                <th className="px-4">Status</th>
                <th className="px-4">Downloads</th>
                <th className="px-4">Rating</th>
                <th className="px-4">Revenue</th>
                <th className="px-4">Files</th>
                <th className="px-4">Next step</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => {
                const isPublished = game.status === 'published';

                return (
                  <tr key={game.slug} className="rounded-[1.4rem] bg-white/80">
                    <td className="rounded-l-[1.4rem] px-4 py-4">
                      {isPublished ? (
                        <Link href={`/games/${game.slug}`} className="focus-ring rounded-lg font-semibold text-[var(--ink)] transition hover:text-[var(--forest)] hover:underline">
                          {game.title}
                        </Link>
                      ) : (
                        <p className="font-semibold text-[var(--ink)]">{game.title}</p>
                      )}
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{game.category}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${isPublished ? 'bg-[var(--bg-forest-tint)] text-[var(--forest)]' : 'bg-[var(--bg-terracotta-tint)] text-[var(--terracotta)]'}`}>
                        {game.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">{game.downloadCount}</td>
                    <td className="px-4 py-4">{game.rating ? `★ ${game.rating.toFixed(1)}` : 'Pending review'}</td>
                    <td className="px-4 py-4">{formatCurrency(game.revenueCents)}</td>
                    <td className="px-4 py-4">{game.uploadedFiles?.length ? game.uploadedFiles.join(', ') : 'Seeded catalog bundle'}</td>
                    <td className="rounded-r-[1.4rem] px-4 py-4">
                      {isPublished ? (
                        <Link href={`/games/${game.slug}`} className="focus-ring inline-flex rounded-full border border-[var(--border-medium)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink)] transition hover:bg-white/70">
                          Open live listing
                        </Link>
                      ) : (
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">Awaiting editorial review</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5">
          <StatePanel title="No games yet" description="Create your first submission to populate the dashboard and start tracking download analytics." />
        </div>
      )}
    </section>
  );
}

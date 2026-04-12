import Link from 'next/link';

import { GameArt } from '@/app/components/game-art';
import { accessLabel, complexityLabel, displayPrice, playerLabel, premiumBadge } from '@/lib/format';
import type { GameSummary } from '@/lib/types';

type GameCardProps = {
  game: GameSummary;
};

export function GameCard({ game }: GameCardProps) {
  return (
    <article className="paper-panel card-lift rounded-[1.9rem] border border-[rgba(77,57,36,0.08)] p-4">
      <Link href={`/games/${game.slug}`} className="block focus-ring rounded-[1.5rem]">
        <GameArt title={game.title} subtitle={game.tagline} category={game.category} heightClassName="h-56" />
        <div className="px-2 pb-2 pt-4">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-[rgba(54,90,76,0.12)] px-3 py-1 text-[var(--forest)]">{game.category}</span>
            <span className="rounded-full bg-[rgba(216,165,65,0.14)] px-3 py-1 text-[var(--ink)]">{accessLabel(game.accessType)}</span>
            <span className="rounded-full bg-[rgba(181,110,79,0.12)] px-3 py-1 text-[var(--terracotta)]">{premiumBadge(game.accessType)}</span>
          </div>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-[var(--ink)]">{game.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[rgba(58,43,31,0.72)]">{game.tagline}</p>
            </div>
            <p className="whitespace-nowrap text-sm font-semibold text-[var(--terracotta)]">{displayPrice(game)}</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[rgba(58,43,31,0.76)] sm:grid-cols-4">
            <span>{playerLabel(game.playerMin, game.playerMax)}</span>
            <span>{game.playTime}</span>
            <span>{complexityLabel(game.complexity)}</span>
            <span>
              ★ {game.rating.toFixed(1)} <span className="text-xs">({game.ratingCount})</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

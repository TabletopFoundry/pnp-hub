import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DownloadButton } from '@/app/components/download-button';
import { GameArt } from '@/app/components/game-art';
import { GameCard } from '@/app/components/game-card';
import { accessLabel, complexityLabel, displayPrice, playerLabel, primaryCta } from '@/lib/format';
import { getGameBySlug, getRelatedGames, getReviewsForGame } from '@/lib/data';

export const dynamic = 'force-dynamic';

type GameDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) notFound();

  const reviews = getReviewsForGame(game.id);
  const relatedGames = getRelatedGames(game.category, game.slug);

  return (
    <div className="section-shell py-12">
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="paper-panel rounded-[2rem] border border-[rgba(77,57,36,0.08)] p-5 sm:p-6">
            <GameArt title={game.title} subtitle={game.tagline} category={game.category} heightClassName="h-[22rem]" />
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-[rgba(54,90,76,0.12)] px-3 py-1 text-[var(--forest)]">{game.category}</span>
              <span className="rounded-full bg-[rgba(216,165,65,0.14)] px-3 py-1 text-[var(--ink)]">{accessLabel(game.accessType)}</span>
              <span className="rounded-full bg-[rgba(181,110,79,0.12)] px-3 py-1 text-[var(--terracotta)]">{displayPrice(game)}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-[var(--ink)]">{game.title}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[rgba(58,43,31,0.76)]">{game.description}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Players', playerLabel(game.playerMin, game.playerMax)],
                ['Play time', game.playTime],
                ['Complexity', complexityLabel(game.complexity)],
                ['Age range', game.ageRange],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.4rem] bg-white/70 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--terracotta)]">{label}</dt>
                  <dd className="mt-3 text-sm font-medium text-[var(--ink)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="paper-panel rounded-[2rem] border border-[rgba(77,57,36,0.08)] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Preview gallery</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Screenshot and layout highlights</h2>
              </div>
              <span className="text-sm text-[rgba(58,43,31,0.72)]">Designed by {game.designerName}</span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {game.gallery.map((caption, index) => (
                <div key={caption} className="rounded-[1.5rem] border border-[rgba(77,57,36,0.08)] bg-white/80 p-4">
                  <div className="aspect-[4/3] rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(216,165,65,0.18),rgba(54,90,76,0.16),rgba(181,110,79,0.14))]" />
                  <p className="mt-3 text-sm font-semibold text-[var(--ink)]">Preview {index + 1}</p>
                  <p className="mt-1 text-xs leading-5 text-[rgba(58,43,31,0.72)]">{caption}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="paper-panel rounded-[2rem] border border-[rgba(77,57,36,0.08)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Component list</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">What you will build</h2>
              <p className="mt-3 text-sm leading-6 text-[rgba(58,43,31,0.74)]">{game.componentSummary}</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[rgba(58,43,31,0.82)]">
                {game.components.map((component) => (
                  <li key={component} className="flex gap-2">
                    <span className="mt-1 text-[var(--forest)]">•</span>
                    <span>{component}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="paper-panel rounded-[2rem] border border-[rgba(77,57,36,0.08)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Print optimizer snapshot</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Home printer guidance</h2>
              <dl className="mt-5 space-y-4 text-sm leading-6 text-[rgba(58,43,31,0.82)]">
                <div>
                  <dt className="font-semibold text-[var(--ink)]">Paper requirements</dt>
                  <dd>{game.paperRequirements}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--ink)]">Estimated ink usage</dt>
                  <dd>{game.estimatedInk}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--ink)]">Difficulty rating</dt>
                  <dd>{game.cutDifficulty} cuts · {game.assemblyEffort}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--ink)]">Paper stock recommendation</dt>
                  <dd>{game.paperStockRecommendation}</dd>
                </div>
              </dl>
              <Link href={`/optimizer?game=${game.slug}`} className="focus-ring mt-6 inline-flex rounded-full bg-[var(--terracotta)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Open full optimizer
              </Link>
            </div>
          </div>

          <div className="paper-panel rounded-[2rem] border border-[rgba(77,57,36,0.08)] p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Ratings & reviews</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">What players are saying</h2>
              </div>
              <div className="rounded-[1.5rem] bg-[rgba(216,165,65,0.12)] px-4 py-3 text-sm text-[rgba(58,43,31,0.78)]">★ {game.rating.toFixed(1)} average · {game.ratingCount} ratings</div>
            </div>
            <div className="mt-5 space-y-4">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-[1.5rem] bg-white/80 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--ink)]">{review.title}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--terracotta)]">{review.author} · verified downloader</p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--forest)]">★ {review.rating}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[rgba(58,43,31,0.78)]">{review.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="paper-panel rounded-[2rem] border border-[rgba(77,57,36,0.08)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Acquire this game</p>
            <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">{displayPrice(game)}</p>
            <p className="mt-4 text-sm leading-6 text-[rgba(58,43,31,0.74)]">{primaryCta(game)} · latest printable version available now with guided prep notes.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <DownloadButton label={primaryCta(game)} />
              <Link href="/community" className="focus-ring inline-flex items-center justify-center rounded-full border border-[rgba(77,57,36,0.12)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-white/70">
                Watch tutorials
              </Link>
            </div>
            <div className="mt-6 rounded-[1.5rem] bg-[rgba(54,90,76,0.1)] p-4 text-sm leading-6 text-[rgba(58,43,31,0.8)]">
              <p className="font-semibold text-[var(--ink)]">Designer</p>
              <p className="mt-1">{game.designerName}</p>
              <p className="mt-4 font-semibold text-[var(--ink)]">Downloads</p>
              <p className="mt-1">{game.downloadCount} total downloads</p>
            </div>
          </div>

          <div className="paper-panel rounded-[2rem] border border-[rgba(77,57,36,0.08)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">More like this</p>
            <div className="mt-4 space-y-4">
              {relatedGames.map((relatedGame) => (
                <GameCard key={relatedGame.slug} game={relatedGame} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

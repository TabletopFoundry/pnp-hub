import Link from 'next/link';

import { SubscriptionGrid } from '@/app/components/subscription-grid';
import { StatePanel } from '@/app/components/state-panel';
import { getCraftGallery, getMonthlyCraftGame, getTutorials } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default function CommunityPage() {
  const craftGallery = getCraftGallery();
  const tutorials = getTutorials();
  const craftAlong = getMonthlyCraftGame();

  return (
    <div className="section-shell py-12">
      <div className="paper-panel rounded-[2.2rem] border border-[var(--border-light)] p-7 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Community</p>
        <h1 className="section-title mt-3 font-semibold text-[var(--ink)]">See what other makers built, learn new craft tricks, and join a monthly build spotlight</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-body)]">
          The community hub combines a craft gallery, practical tutorials, a featured craft-along title, and subscription prompts for deeper making support.
        </p>
      </div>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Craft gallery</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">User-submitted builds from cozy tables around the world</h2>
            </div>
            <span className="rounded-full bg-[var(--bg-gold-tint)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">{craftGallery.length} shared builds</span>
          </div>
          {craftGallery.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {craftGallery.map((item) => (
                <article key={item.id} className="rounded-[1.6rem] border border-[var(--border-light)] bg-white/80 p-4">
                  <div className="aspect-[4/3] rounded-[1.2rem]" role="img" aria-label={`Preview image for ${item.title}`} style={{ background: `linear-gradient(135deg, ${item.color}, rgba(255,255,255,0.85))` }} />
                  <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--terracotta)]">By {item.maker} · {item.location}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">{item.caption}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5">
              <StatePanel title="Gallery coming soon" description="Community uploads are empty right now, but the layout is ready for future maker submissions." />
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Monthly craft along</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">{craftAlong?.title ?? 'Festival of Kites'}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-body)]">
              Build this month’s featured game with community-friendly material swaps, guided paper picks, and a tidy cut sequence.
            </p>
            {craftAlong ? (
              <Link href={`/games/${craftAlong.slug}`} className="focus-ring mt-5 inline-flex rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                View the spotlight game
              </Link>
            ) : null}
          </div>
          <div className="paper-panel rounded-[2rem] border border-[var(--border-light)] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Tutorial library</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Crafting tutorials</h2>
            <div className="mt-5 space-y-4">
              {tutorials.length ? (
                tutorials.map((tutorial) => (
                  <article key={tutorial.id} className="rounded-[1.5rem] bg-white/80 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--ink)]">{tutorial.title}</h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--terracotta)]">{tutorial.difficulty} · {tutorial.estimatedTime} · {tutorial.technique}</p>
                      </div>
                      <span className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${tutorial.accessType === 'free' ? 'bg-[var(--bg-forest-tint)] text-[var(--forest)]' : 'bg-[var(--bg-gold-medium)] text-[var(--ink)]'}`}>
                        {tutorial.accessType === 'free' ? 'Free tutorial' : 'Subscriber tutorial'}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">{tutorial.summary}</p>
                  </article>
                ))
              ) : (
                <StatePanel title="No tutorials yet" description="Tutorial cards will appear here once content is seeded into the local database." />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Subscription comparison</p>
        <h2 className="section-title mt-3 font-semibold text-[var(--ink)]">Choose the support tier that matches your craft table</h2>
        <div className="mt-7">
          <SubscriptionGrid />
        </div>
      </section>
    </div>
  );
}

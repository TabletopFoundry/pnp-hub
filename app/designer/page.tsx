import type { Metadata } from 'next';

import { AnalyticsChart } from '@/app/components/analytics-chart';
import { DesignerFlash } from '@/app/components/designer-flash';
import { DesignerGamesTable } from '@/app/components/designer-games-table';
import { UploadForm } from '@/app/components/upload-form';
import { getDesignerDashboard } from '@/lib/data';
import { formatCurrency } from '@/lib/format';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Designer Dashboard',
  description: 'Upload games, track analytics, and manage your print-and-play portfolio.',
};

type DesignerPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const MY_GAMES_SECTION_ID = 'my-games';

export default async function DesignerPage({ searchParams }: DesignerPageProps) {
  const dashboard = getDesignerDashboard();
  const resolved = await searchParams;
  const submitted = typeof resolved.submitted === 'string';

  return (
    <div className="section-shell py-12">
      <div className="paper-panel rounded-[2.2rem] border border-[var(--border-light)] p-7 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--terracotta)]">Designer dashboard</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="section-title font-semibold text-[var(--ink)]">Manage uploads, understand demand, and track the 75/25 revenue split</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-body)]">
              The dashboard mixes seeded catalog analytics with a working SQLite-backed upload wizard so new drafts persist across refreshes.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white/70 px-4 py-3 text-sm text-[var(--text-secondary)]">Signed in as Paper Sparrow Studio</div>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {[
            ['Downloads', dashboard.summary.totalDownloads.toLocaleString()],
            ['Revenue', formatCurrency(dashboard.summary.totalRevenue)],
            ['Avg rating', dashboard.summary.averageRating.toFixed(1)],
            ['Published games', dashboard.summary.publishedCount.toString()],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[1.5rem] bg-white/75 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--terracotta)]">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--ink)]">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <DesignerFlash submitted={submitted} targetId={MY_GAMES_SECTION_ID} />

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <UploadForm successHash={MY_GAMES_SECTION_ID} />
        <div className="paper-panel rounded-[1.9rem] border border-[var(--border-light)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Revenue tracking</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Transparent marketplace economics</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[var(--bg-forest-subtle)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">Designer share</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--forest)]">{formatCurrency(dashboard.summary.payoutShare)}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">75% of gross revenue goes back to the designer on every paid sale and included catalog pool.</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--bg-gold-tint)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">Platform share</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--terracotta)]">{formatCurrency(dashboard.summary.platformShare)}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">25% funds payment processing, editorial review, optimizer tooling, and community surfaces.</p>
            </div>
          </div>
          <div className="mt-5 rounded-[1.5rem] bg-white/75 p-5 text-sm leading-6 text-[var(--text-body)]">
            <p className="font-semibold text-[var(--ink)]">Mock payout readiness</p>
            <p className="mt-2">Terms accepted · Payout profile connected · Last catalog sync completed successfully 2 hours ago.</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <AnalyticsChart metrics={dashboard.metrics} geography={dashboard.geography} />
      </div>

      <DesignerGamesTable games={dashboard.games} sectionId={MY_GAMES_SECTION_ID} />
    </div>
  );
}

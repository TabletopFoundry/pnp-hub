import { UploadForm } from '@/app/components/upload-form';
import { AnalyticsChart } from '@/app/components/analytics-chart';
import { StatePanel } from '@/app/components/state-panel';
import { getDesignerDashboard } from '@/lib/data';
import { formatCurrency } from '@/lib/format';

export const dynamic = 'force-dynamic';

type DesignerPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DesignerPage({ searchParams }: DesignerPageProps) {
  const dashboard = getDesignerDashboard();
  const resolved = await searchParams;
  const submitted = typeof resolved.submitted === 'string';
  const errorMessage = typeof resolved.error === 'string' ? resolved.error : '';

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

      {submitted ? (
        <div className="mt-6 rounded-[1.6rem] border border-[var(--bg-forest-strong)] bg-[var(--bg-forest-subtle)] px-5 py-4 text-sm text-[var(--ink)]">
          Draft saved to SQLite. Refresh the page or scroll to “My games” to see the new submission.
        </div>
      ) : null}
      {errorMessage ? (
        <div className="mt-6 rounded-[1.6rem] border border-[var(--bg-terracotta-strong)] bg-[var(--bg-terracotta-subtle)] px-5 py-4 text-sm text-[var(--ink)]">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <UploadForm />
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

      <div className="mt-8 paper-panel rounded-[2rem] border border-[var(--border-light)] p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">My games</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Live catalog and current drafts</h2>
          </div>
          <span className="rounded-full bg-[var(--bg-gold-tint)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">{dashboard.games.length} tracked titles</span>
        </div>
        {dashboard.games.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[640px] border-separate border-spacing-y-3 text-sm text-[var(--text-body)]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-[var(--terracotta)]">
                  <th className="px-4">Game</th>
                  <th className="px-4">Status</th>
                  <th className="px-4">Downloads</th>
                  <th className="px-4">Rating</th>
                  <th className="px-4">Revenue</th>
                  <th className="px-4">Files</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.games.map((game) => (
                  <tr key={game.slug} className="rounded-[1.4rem] bg-white/80">
                    <td className="rounded-l-[1.4rem] px-4 py-4">
                      <p className="font-semibold text-[var(--ink)]">{game.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{game.category}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${game.status === 'published' ? 'bg-[var(--bg-forest-tint)] text-[var(--forest)]' : 'bg-[var(--bg-terracotta-tint)] text-[var(--terracotta)]'}`}>
                        {game.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">{game.downloadCount}</td>
                    <td className="px-4 py-4">{game.rating ? `★ ${game.rating.toFixed(1)}` : 'Pending review'}</td>
                    <td className="px-4 py-4">{formatCurrency(game.revenueCents)}</td>
                    <td className="rounded-r-[1.4rem] px-4 py-4">{game.uploadedFiles?.length ? game.uploadedFiles.join(', ') : 'Seeded catalog bundle'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5">
            <StatePanel title="No games yet" description="Create your first submission to populate the dashboard and start tracking download analytics." />
          </div>
        )}
      </div>
    </div>
  );
}

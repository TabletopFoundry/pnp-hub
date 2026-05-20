'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from 'recharts';

import type { DashboardMetric, GeographyMetric } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

type AnalyticsChartProps = {
  metrics: DashboardMetric[];
  geography: GeographyMetric[];
};

function formatTooltipValue(value: unknown, name: unknown) {
  const numericValue = Number(value);
  const label = String(name);
  return label === 'revenue'
    ? [formatCurrency(numericValue), 'Revenue']
    : [numericValue.toLocaleString(), label.charAt(0).toUpperCase() + label.slice(1)];
}

export function AnalyticsChart({ metrics, geography }: AnalyticsChartProps) {
  const totalDownloads = metrics.reduce((sum, entry) => sum + entry.downloads, 0);
  const peakDay = metrics.reduce<DashboardMetric | null>((best, entry) => {
    if (!best || entry.downloads > best.downloads) return entry;
    return best;
  }, null);
  const totalRegionalDownloads = geography.reduce((sum, entry) => sum + entry.downloads, 0);
  const topRegion = geography.reduce<GeographyMetric | null>((best, entry) => {
    if (!best || entry.downloads > best.downloads) return entry;
    return best;
  }, null);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
      <figure className="paper-panel rounded-[1.8rem] border border-[var(--border-light)] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Downloads over time</p>
            <h3 className="mt-2 text-xl font-semibold text-[var(--ink)]">14-day release pulse</h3>
          </div>
          <span className="rounded-full bg-[var(--bg-forest-tint)] px-3 py-1 text-xs font-semibold text-[var(--forest)]">Updated daily</span>
        </div>
        <figcaption className="sr-only">Downloads over time chart showing the last 14 daily download counts.</figcaption>
        <div className="h-72" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics}>
              <defs>
                <linearGradient id="downloads" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#365a4c" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#365a4c" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(58,43,31,0.08)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#5f4a35', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#5f4a35', fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip formatter={formatTooltipValue} />
              <Area type="monotone" dataKey="downloads" stroke="#365a4c" fill="url(#downloads)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 rounded-[1.4rem] bg-white/75 p-4 text-sm leading-6 text-[var(--text-body)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--terracotta)]">Quick read</p>
          <p className="mt-2">
            {peakDay
              ? `${totalDownloads.toLocaleString()} downloads landed over the last ${metrics.length} days, peaking on ${peakDay.label} with ${peakDay.downloads.toLocaleString()} downloads.`
              : 'No download data is available yet.'}
          </p>
        </div>
        <details className="mt-4 rounded-[1.4rem] border border-[var(--border-light)] bg-white/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--ink)]">View 14-day data table</summary>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[var(--text-body)]">
              <caption className="pb-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--terracotta)]">Downloads over time data table</caption>
              <thead>
                <tr className="text-xs uppercase tracking-[0.16em] text-[var(--terracotta)]">
                  <th scope="col" className="pb-2 pr-4">Day</th>
                  <th scope="col" className="pb-2 pr-4">Downloads</th>
                  <th scope="col" className="pb-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {metrics.length ? (
                  metrics.map((entry) => (
                    <tr key={entry.label} className="border-t border-[var(--border-light)]">
                      <th scope="row" className="py-3 pr-4 font-medium text-[var(--ink)]">{entry.label}</th>
                      <td className="py-3 pr-4">{entry.downloads.toLocaleString()}</td>
                      <td className="py-3">{formatCurrency(entry.revenue)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-[var(--border-light)]">
                    <td colSpan={3} className="py-3 text-[var(--text-secondary)]">No download rows are available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </details>
      </figure>
      <figure className="paper-panel rounded-[1.8rem] border border-[var(--border-light)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Geographic mix</p>
        <h3 className="mt-2 text-xl font-semibold text-[var(--ink)]">Where makers are printing</h3>
        <figcaption className="sr-only">Geographic distribution chart showing download counts by region.</figcaption>
        <div className="mt-4 h-72" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={geography} layout="vertical" margin={{ left: 18, right: 12 }}>
              <CartesianGrid stroke="rgba(58,43,31,0.08)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="region" type="category" width={96} tick={{ fill: '#5f4a35', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={formatTooltipValue} />
              <Bar dataKey="downloads" radius={[0, 999, 999, 0]} fill="#d17c5d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 rounded-[1.4rem] bg-white/75 p-4 text-sm leading-6 text-[var(--text-body)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--terracotta)]">Quick read</p>
          <p className="mt-2">
            {topRegion
              ? `${topRegion.region} leads with ${topRegion.downloads.toLocaleString()} downloads, representing ${Math.round((topRegion.downloads / Math.max(totalRegionalDownloads, 1)) * 100)}% of tracked regional activity.`
              : 'No regional download data is available yet.'}
          </p>
        </div>
        <details className="mt-4 rounded-[1.4rem] border border-[var(--border-light)] bg-white/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--ink)]">View regional data table</summary>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[var(--text-body)]">
              <caption className="pb-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--terracotta)]">Regional downloads data table</caption>
              <thead>
                <tr className="text-xs uppercase tracking-[0.16em] text-[var(--terracotta)]">
                  <th scope="col" className="pb-2 pr-4">Region</th>
                  <th scope="col" className="pb-2">Downloads</th>
                </tr>
              </thead>
              <tbody>
                {geography.length ? (
                  geography.map((entry) => (
                    <tr key={entry.region} className="border-t border-[var(--border-light)]">
                      <th scope="row" className="py-3 pr-4 font-medium text-[var(--ink)]">{entry.region}</th>
                      <td className="py-3">{entry.downloads.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-[var(--border-light)]">
                    <td colSpan={2} className="py-3 text-[var(--text-secondary)]">No regional rows are available yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </details>
      </figure>
    </div>
  );
}

'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from 'recharts';

import type { DashboardMetric, GeographyMetric } from '@/lib/types';
import { formatCurrency } from '@/lib/format';

type AnalyticsChartProps = {
  metrics: DashboardMetric[];
  geography: GeographyMetric[];
};

export function AnalyticsChart({ metrics, geography }: AnalyticsChartProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
      <div className="paper-panel rounded-[1.8rem] border border-[var(--border-light)] p-5" role="figure" aria-label="Downloads over time chart showing 14-day release pulse">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Downloads over time</p>
            <h3 className="mt-2 text-xl font-semibold text-[var(--ink)]">14-day release pulse</h3>
          </div>
          <span className="rounded-full bg-[var(--bg-forest-tint)] px-3 py-1 text-xs font-semibold text-[var(--forest)]">Updated daily</span>
        </div>
        <div className="h-72">
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
              <Tooltip
                formatter={(value, name) => {
                  const v = Number(value);
                  const n = String(name);
                  return n === 'revenue'
                    ? [formatCurrency(v), 'Revenue']
                    : [v.toLocaleString(), n.charAt(0).toUpperCase() + n.slice(1)];
                }}
              />
              <Area type="monotone" dataKey="downloads" stroke="#365a4c" fill="url(#downloads)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="paper-panel rounded-[1.8rem] border border-[var(--border-light)] p-5" role="figure" aria-label="Geographic distribution chart showing where makers are printing">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Geographic mix</p>
        <h3 className="mt-2 text-xl font-semibold text-[var(--ink)]">Where makers are printing</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={geography} layout="vertical" margin={{ left: 18, right: 12 }}>
              <CartesianGrid stroke="rgba(58,43,31,0.08)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="region" type="category" width={96} tick={{ fill: '#5f4a35', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value, name) => {
                  const v = Number(value);
                  const n = String(name);
                  return n === 'revenue'
                    ? [formatCurrency(v), 'Revenue']
                    : [v.toLocaleString(), n.charAt(0).toUpperCase() + n.slice(1)];
                }}
              />
              <Bar dataKey="downloads" radius={[0, 999, 999, 0]} fill="#d17c5d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { StatePanel } from '@/app/components/state-panel';
import { formatCurrency } from '@/lib/format';
import type { GameSummary } from '@/lib/types';

type OptimizerToolProps = {
  games: GameSummary[];
  initialSlug?: string;
  compact?: boolean;
};

const STORAGE_KEY = 'pnp-hub-printer-profile';

export function OptimizerTool({ games, initialSlug, compact = false }: OptimizerToolProps) {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug ?? games[0]?.slug ?? '');
  const [profile, setProfile] = useState<{ paperSize: 'Letter' | 'A4'; colorMode: 'Color' | 'B&W'; duplex: 'Simplex' | 'Duplex' }>(
    () => {
      if (typeof window === 'undefined') {
        return { paperSize: 'Letter', colorMode: 'Color', duplex: 'Simplex' };
      }

      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return { paperSize: 'Letter', colorMode: 'Color', duplex: 'Simplex' };
      }

      return JSON.parse(saved) as { paperSize: 'Letter' | 'A4'; colorMode: 'Color' | 'B&W'; duplex: 'Simplex' | 'Duplex' };
    }
  );

  const { paperSize, colorMode, duplex } = profile;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const selectedGame = useMemo(() => games.find((game) => game.slug === selectedSlug) ?? games[0], [games, selectedSlug]);

  if (!selectedGame) {
    return (
      <StatePanel
        eyebrow="Optimizer"
        title="No optimizer-ready games"
        description="Seed data did not return any eligible titles yet. Try browsing the marketplace first or refresh the demo database."
      />
    );
  }

  const paperMultiplier = paperSize === 'A4' ? 1.05 : 1;
  const colorMultiplier = colorMode === 'Color' ? 0.18 : 0.08;
  const duplexSavings = duplex === 'Duplex' ? 0.86 : 1;
  const estimatedCost = Math.round(selectedGame.sheetCount * paperMultiplier * (0.16 + colorMultiplier) * duplexSavings * 100);
  const estimatedSheets = Math.max(1, Math.ceil(selectedGame.sheetCount * (paperSize === 'A4' ? 1.05 : 1) * (duplex === 'Duplex' ? 0.88 : 1)));

  return (
    <div className={compact ? 'grid gap-5 lg:grid-cols-[1.1fr_0.9fr]' : 'grid gap-6 xl:grid-cols-[1.1fr_0.9fr]'}>
      <div className="paper-panel rounded-[1.9rem] border border-[rgba(77,57,36,0.08)] p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Print optimizer</p>
            <h3 className="mt-2 text-2xl font-semibold text-[var(--ink)]">Tune the print run to your home setup</h3>
          </div>
          {!compact ? (
            <Link href={`/games/${selectedGame.slug}`} className="text-sm font-semibold text-[var(--forest)] underline-offset-4 hover:underline">
              Back to {selectedGame.title}
            </Link>
          ) : null}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Game
            <select
              value={selectedSlug}
              onChange={(event) => setSelectedSlug(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3"
            >
              {games.map((game) => (
                <option key={game.slug} value={game.slug}>
                  {game.title}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Paper size
            <select
              value={paperSize}
              onChange={(event) =>
                setProfile((current) => ({ ...current, paperSize: event.target.value as 'Letter' | 'A4' }))
              }
              className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3"
            >
              <option value="Letter">US Letter</option>
              <option value="A4">A4</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Color mode
            <select
              value={colorMode}
              onChange={(event) =>
                setProfile((current) => ({ ...current, colorMode: event.target.value as 'Color' | 'B&W' }))
              }
              className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3"
            >
              <option value="Color">Color</option>
              <option value="B&W">B&W</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Duplex mode
            <select
              value={duplex}
              onChange={(event) =>
                setProfile((current) => ({ ...current, duplex: event.target.value as 'Simplex' | 'Duplex' }))
              }
              className="focus-ring w-full rounded-2xl border border-[rgba(77,57,36,0.12)] bg-white/80 px-4 py-3"
            >
              <option value="Simplex">Single-sided</option>
              <option value="Duplex">Double-sided</option>
            </select>
          </label>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.4rem] bg-[rgba(216,165,65,0.1)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">Estimated sheets</p>
            <p className="mt-3 text-2xl font-semibold text-[var(--terracotta)]">{estimatedSheets}</p>
          </div>
          <div className="rounded-[1.4rem] bg-[rgba(54,90,76,0.1)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">Ink usage</p>
            <p className="mt-3 text-2xl font-semibold text-[var(--forest)]">{colorMode === 'Color' ? selectedGame.estimatedInk : 'Low'}</p>
          </div>
          <div className="rounded-[1.4rem] bg-[rgba(181,110,79,0.12)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">Estimated cost</p>
            <p className="mt-3 text-2xl font-semibold text-[var(--terracotta)]">{formatCurrency(estimatedCost)}</p>
          </div>
        </div>
      </div>
      <div className="paper-panel rounded-[1.9rem] border border-[rgba(77,57,36,0.08)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Optimized layout preview</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: Math.min(4, Math.max(2, Math.ceil(estimatedSheets / 3))) }, (_, index) => (
            <div key={index} className="rounded-[1.4rem] border border-[rgba(77,57,36,0.08)] bg-white/80 p-4">
              <div className="aspect-[3/4] rounded-[1rem] border border-dashed border-[rgba(77,57,36,0.18)] bg-[linear-gradient(180deg,rgba(250,247,241,1),rgba(242,233,217,1))] p-3">
                <div className="grid h-full grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[rgba(54,90,76,0.16)]" />
                  <div className="rounded-xl bg-[rgba(216,165,65,0.18)]" />
                  <div className="rounded-xl bg-[rgba(181,110,79,0.16)]" />
                  <div className="rounded-xl bg-[rgba(108,138,168,0.16)]" />
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-[var(--ink)]">Sheet {index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[rgba(58,43,31,0.72)]">{selectedGame.previewLayout}</p>
            </div>
          ))}
        </div>
        <dl className="mt-5 space-y-4 text-sm leading-6 text-[rgba(58,43,31,0.8)]">
          <div>
            <dt className="font-semibold text-[var(--ink)]">Paper stock recommendation</dt>
            <dd>{selectedGame.paperStockRecommendation}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--ink)]">Cutting guide</dt>
            <dd>{selectedGame.cutGuide}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--ink)]">Printer profile note</dt>
            <dd>Your last-used paper size and color mode are remembered locally for the next optimization run.</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

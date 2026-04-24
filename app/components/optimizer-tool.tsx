'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { StatePanel } from '@/app/components/state-panel';
import {
  A4_PAPER_MULTIPLIER,
  BASE_SHEET_COST,
  BW_INK_COST,
  COLOR_INK_COST,
  DUPLEX_COST_SAVINGS,
  DUPLEX_SHEET_SAVINGS,
  PRINTER_PROFILE_STORAGE_KEY,
} from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import type { OptimizerGame } from '@/lib/types';

type OptimizerToolProps = {
  games: OptimizerGame[];
  initialSlug?: string;
  compact?: boolean;
};

type PrinterProfile = { paperSize: 'Letter' | 'A4'; colorMode: 'Color' | 'B&W'; duplex: 'Simplex' | 'Duplex' };
const DEFAULT_PROFILE: PrinterProfile = { paperSize: 'Letter', colorMode: 'Color', duplex: 'Simplex' };

export function OptimizerTool({ games, initialSlug, compact = false }: OptimizerToolProps) {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug ?? games[0]?.slug ?? '');
  const [profile, setProfile] = useState<PrinterProfile>(DEFAULT_PROFILE);
  const [mounted, setMounted] = useState(false);

  // Load localStorage profile after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(PRINTER_PROFILE_STORAGE_KEY);
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: hydrate from localStorage on mount
        setProfile(JSON.parse(saved) as PrinterProfile);
      }
    } catch { /* ignore malformed data */ }
    setMounted(true);
  }, []);

  const { paperSize, colorMode, duplex } = profile;

  useEffect(() => {
    if (mounted) {
      window.localStorage.setItem(PRINTER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile, mounted]);

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

  const paperMultiplier = paperSize === 'A4' ? A4_PAPER_MULTIPLIER : 1;
  const colorMultiplier = colorMode === 'Color' ? COLOR_INK_COST : BW_INK_COST;
  const duplexSavings = duplex === 'Duplex' ? DUPLEX_COST_SAVINGS : 1;
  const estimatedCost = Math.round(selectedGame.sheetCount * paperMultiplier * (BASE_SHEET_COST + colorMultiplier) * duplexSavings * 100);
  const estimatedSheets = Math.max(1, Math.ceil(selectedGame.sheetCount * (paperSize === 'A4' ? A4_PAPER_MULTIPLIER : 1) * (duplex === 'Duplex' ? DUPLEX_SHEET_SAVINGS : 1)));

  return (
    <div className={compact ? 'grid gap-5 lg:grid-cols-[1.1fr_0.9fr]' : 'grid gap-6 xl:grid-cols-[1.1fr_0.9fr]'}>
      <div className="paper-panel rounded-[1.9rem] border border-[var(--border-light)] p-5">
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
        <fieldset className="mt-6 grid gap-4 md:grid-cols-2">
          <legend className="sr-only">Printer settings</legend>
          <label className="space-y-2 text-sm font-medium text-[var(--ink)]">
            Game
            <select
              value={selectedSlug}
              onChange={(event) => setSelectedSlug(event.target.value)}
              className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
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
              className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
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
              className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
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
              className="focus-ring w-full rounded-2xl border border-[var(--border-medium)] bg-white/80 px-4 py-3"
            >
              <option value="Simplex">Single-sided</option>
              <option value="Duplex">Double-sided</option>
            </select>
          </label>
        </fieldset>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.4rem] bg-[var(--bg-gold-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">Estimated sheets</p>
            <p className="mt-3 text-2xl font-semibold text-[var(--terracotta)]">{estimatedSheets}</p>
          </div>
          <div className="rounded-[1.4rem] bg-[var(--bg-forest-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">Ink usage</p>
            <p className="mt-3 text-2xl font-semibold text-[var(--forest)]">{colorMode === 'Color' ? selectedGame.estimatedInk : 'Low'}</p>
          </div>
          <div className="rounded-[1.4rem] bg-[var(--bg-terracotta-tint)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">Estimated cost</p>
            <p className="mt-3 text-2xl font-semibold text-[var(--terracotta)]">{formatCurrency(estimatedCost)}</p>
          </div>
        </div>
      </div>
      <div className="paper-panel rounded-[1.9rem] border border-[var(--border-light)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--terracotta)]">Optimized layout preview</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: Math.min(4, Math.max(2, Math.ceil(estimatedSheets / 3))) }, (_, index) => (
            <div key={index} className="rounded-[1.4rem] border border-[var(--border-light)] bg-white/80 p-4">
              <div className="aspect-[3/4] rounded-[1rem] border border-dashed border-[var(--border-dashed)] bg-[linear-gradient(180deg,rgba(250,247,241,1),rgba(242,233,217,1))] p-3">
                <div className="grid h-full grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[var(--bg-forest-strong)]" />
                  <div className="rounded-xl bg-[var(--bg-gold-strong)]" />
                  <div className="rounded-xl bg-[var(--bg-terracotta-strong)]" />
                  <div className="rounded-xl bg-[var(--bg-blue-tint)]" />
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-[var(--ink)]">Sheet {index + 1}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{selectedGame.previewLayout}</p>
            </div>
          ))}
        </div>
        <dl className="mt-5 space-y-4 text-sm leading-6 text-[var(--text-body)]">
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

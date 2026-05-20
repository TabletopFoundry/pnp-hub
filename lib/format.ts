/**
 * Display formatting utilities for PnP Hub.
 *
 * Pure helper functions used across UI components to format currency,
 * access labels, pricing CTAs, complexity, and player counts. All functions
 * are deterministic and side-effect free, making them easy to unit test.
 *
 * @module
 */

import type { AccessType, GameSummary } from '@/lib/types';

/** Format a value in cents as a USD currency string (e.g. 799 → "$7.99"). */
export function formatCurrency(valueInCents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: valueInCents % 100 === 0 ? 0 : 2,
  }).format(valueInCents / 100);
}

/** Return a human-readable label for a game's access type. */
export function accessLabel(accessType: AccessType) {
  if (accessType === 'free') return 'Free';
  if (accessType === 'included') return 'Included';
  return 'Purchase-only';
}

/** Return the primary call-to-action label for acquiring a game. */
export function primaryCta(game: Pick<GameSummary, 'accessType' | 'priceCents'>) {
  if (game.accessType === 'free') return 'Download Free';
  if (game.accessType === 'included') return 'Included with Maker';
  return `Buy for ${formatCurrency(game.priceCents)}`;
}

/** Return a badge label — "Free" or "Premium". */
export function premiumBadge(accessType: AccessType) {
  return accessType === 'free' ? 'Free' : 'Premium';
}

/** Return the display price string for a game (e.g. "Free", "$7.99"). */
export function displayPrice(game: Pick<GameSummary, 'accessType' | 'priceCents'>) {
  if (game.accessType === 'free') return 'Free';
  if (game.accessType === 'included') return 'Included with Maker';
  return formatCurrency(game.priceCents);
}

/** Return the review byline copy, including verification only when earned. */
export function reviewByline(author: string, verified: boolean) {
  return verified ? `${author} · verified downloader` : author;
}

/** Map a numeric complexity (1-5) to a human-readable label. */
export function complexityLabel(value: number) {
  if (value <= 2) return 'Light';
  if (value === 3) return 'Medium';
  return 'Crunchy';
}

/** Format a player count range as a readable string (e.g. "2-4 players"). */
export function playerLabel(min: number, max: number) {
  if (min === max) return min === 1 ? '1 player' : `${min} players`;
  return `${min}-${max} players`;
}

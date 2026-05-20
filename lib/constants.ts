/**
 * Application-wide constants for PnP Hub.
 *
 * Centralizes magic numbers, business rules, and configuration defaults
 * so they can be referenced (and tested) from a single location.
 */

// ---------------------------------------------------------------------------
// Revenue split
// ---------------------------------------------------------------------------

/** Fraction of gross revenue paid out to designers (0-1). */
export const DESIGNER_REVENUE_SHARE = 0.75;

/** Fraction retained by the platform (0-1). */
export const PLATFORM_REVENUE_SHARE = 1 - DESIGNER_REVENUE_SHARE;

// ---------------------------------------------------------------------------
// Validation limits
// ---------------------------------------------------------------------------

/** Maximum length of a game title in characters. */
export const MAX_TITLE_LENGTH = 200;

/** Maximum length of a game description in characters. */
export const MAX_DESCRIPTION_LENGTH = 5000;

// ---------------------------------------------------------------------------
// Pagination defaults
// ---------------------------------------------------------------------------

/** Default number of marketplace items per page. */
export const DEFAULT_PAGE_SIZE = 24;

/** Maximum number of reviews shown on a game detail page. */
export const MAX_REVIEWS_PER_GAME = 6;

/** Maximum number of featured games on the home page. */
export const DEFAULT_FEATURED_LIMIT = 6;

/** Maximum number of related games on a game detail page. */
export const MAX_RELATED_GAMES = 3;

// ---------------------------------------------------------------------------
// Print optimizer defaults
// ---------------------------------------------------------------------------

/** localStorage key for persisted printer profile. */
export const PRINTER_PROFILE_STORAGE_KEY = 'pnp-hub-printer-profile';

/** Paper size multiplier for A4 sheets (vs US Letter baseline of 1.0). */
export const A4_PAPER_MULTIPLIER = 1.05;

/** Per-sheet base printing cost in dollars. */
export const BASE_SHEET_COST = 0.16;

/** Additional per-sheet cost for color printing. */
export const COLOR_INK_COST = 0.18;

/** Additional per-sheet cost for B&W printing. */
export const BW_INK_COST = 0.08;

/** Sheet-count savings multiplier when printing duplex (double-sided). */
export const DUPLEX_COST_SAVINGS = 0.86;

/** Sheet-count reduction multiplier when printing duplex. */
export const DUPLEX_SHEET_SAVINGS = 0.88;

// ---------------------------------------------------------------------------
// Game categories — single source of truth for UI + validation
// ---------------------------------------------------------------------------

/** All valid game categories. Used in filters, upload forms, and validation. */
export const GAME_CATEGORIES = [
  'Strategy',
  'Party',
  'Family',
  'Solo',
  'Cooperative',
  'Card',
  'Educational',
  '2-Player',
] as const;

/** Valid access types for games. */
export const ACCESS_TYPES = ['free', 'included', 'purchase'] as const;

/** Stable shell banner copy that should not drift from live catalog counts. */
export const SITE_BANNER_MESSAGE = 'Local-first MVP demo · SQLite-seeded print-and-play catalog';

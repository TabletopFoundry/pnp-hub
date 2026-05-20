import {
  DEFAULT_FEATURED_LIMIT,
  DEFAULT_PAGE_SIZE,
  DESIGNER_REVENUE_SHARE,
  MAX_RELATED_GAMES,
  MAX_REVIEWS_PER_GAME,
} from '@/lib/constants';
import { getDatabase } from '@/lib/db';
import { CURRENT_DESIGNER_SLUG } from '@/lib/seed';
import type {
  CraftAlongFeature,
  CraftGalleryItem,
  DashboardMetric,
  DesignerProfile,
  GameCategory,
  GameListingView,
  GameSummary,
  GeographyMetric,
  MarketplaceFilters,
  OptimizerGame,
  Review,
  SortKey,
  Tutorial,
} from '@/lib/types';

// --- Safe JSON parsing (P1-7) ---

/** Parse a JSON string, returning `fallback` on null/undefined/malformed input. */
function safeJsonParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// --- Row types ---

type GameRow = {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  player_min: number;
  player_max: number;
  play_time: string;
  complexity: number;
  price_cents: number;
  access_type: GameSummary['accessType'];
  rating: number;
  rating_count: number;
  designer_name: string;
  designer_slug: string;
  published_at: string;
  popularity: number;
  is_featured: number;
  is_monthly_craft: number;
  age_range: string;
  assembly_effort: string;
  paper_requirements: string;
  estimated_ink: string;
  sheet_count: number;
  cut_difficulty: string;
  paper_stock_recommendation: string;
  cut_guide: string;
  preview_layout: string;
  component_summary: string;
  components_json: string;
  gallery_json: string;
  revenue_cents: number;
  download_count: number;
  status: GameSummary['status'];
  uploaded_files_json: string;
};

type DesignerProfileRow = {
  slug: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  specialties_json: string;
  joined_at: string;
  featured_game_slug: string | null;
  game_count: number;
  total_revenue_cents: number;
  total_downloads: number;
};

type CraftAlongRow = {
  id: number;
  month_label: string;
  game_slug: string;
  game_title: string;
  theme: string;
  summary: string;
  material_focus: string;
  is_current: number;
};

// --- Shared mapper (P1-2: DRY extraction) ---

type CommonGameRow = Omit<GameRow, 'components_json' | 'gallery_json'>;

function mapCommonFields(row: CommonGameRow): Omit<GameSummary, 'components' | 'gallery'> {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    category: row.category as GameCategory,
    playerMin: row.player_min,
    playerMax: row.player_max,
    playTime: row.play_time,
    complexity: row.complexity,
    priceCents: row.price_cents,
    accessType: row.access_type,
    rating: row.rating,
    ratingCount: row.rating_count,
    designerName: row.designer_name,
    designerSlug: row.designer_slug,
    publishedAt: row.published_at,
    popularity: row.popularity,
    isFeatured: Boolean(row.is_featured),
    isMonthlyCraft: Boolean(row.is_monthly_craft),
    ageRange: row.age_range,
    assemblyEffort: row.assembly_effort,
    paperRequirements: row.paper_requirements,
    estimatedInk: row.estimated_ink,
    sheetCount: row.sheet_count,
    cutDifficulty: row.cut_difficulty,
    paperStockRecommendation: row.paper_stock_recommendation,
    cutGuide: row.cut_guide,
    previewLayout: row.preview_layout,
    componentSummary: row.component_summary,
    revenueCents: row.revenue_cents,
    downloadCount: row.download_count,
    status: row.status,
    uploadedFiles: safeJsonParse<string[]>(row.uploaded_files_json, []),
  };
}

function mapGame(row: GameRow): GameSummary {
  return {
    ...mapCommonFields(row),
    components: safeJsonParse<string[]>(row.components_json, []),
    gallery: safeJsonParse<string[]>(row.gallery_json, []),
  };
}

// Columns needed for card/listing views (excludes heavy JSON columns)
const LISTING_COLUMNS = `id, slug, title, tagline, description, category, player_min, player_max,
  play_time, complexity, price_cents, access_type, rating, rating_count, designer_name, designer_slug,
  published_at, popularity, is_featured, is_monthly_craft, age_range, assembly_effort, paper_requirements,
  estimated_ink, sheet_count, cut_difficulty, paper_stock_recommendation, cut_guide, preview_layout,
  component_summary, revenue_cents, download_count, status, uploaded_files_json`;
const JOINED_GAME_LISTING_COLUMNS = LISTING_COLUMNS.split(',').map((column) => `games.${column.trim()}`).join(', ');

type ListingGameRow = Omit<GameRow, 'components_json' | 'gallery_json'>;

function mapListingGame(row: ListingGameRow): GameListingView {
  return mapCommonFields(row);
}

// --- P0-1: Sort allowlist for SQL interpolation safety ---

const SORT_MAP: Record<SortKey, string> = {
  newest: 'published_at DESC',
  popular: 'popularity DESC',
  rated: 'rating DESC, rating_count DESC',
  price: 'price_cents ASC, title ASC',
} as const;

function isSortKey(value: string): value is SortKey {
  return value in SORT_MAP;
}

function resolveOrderBy(sort: string | undefined): string {
  const key = sort ?? 'newest';
  if (isSortKey(key)) return SORT_MAP[key];
  return SORT_MAP.newest;
}

// --- Data-fetching functions (P0-3: removed all noStore() calls) ---

export function getFeaturedGames(limit = DEFAULT_FEATURED_LIMIT) {
  const rows = getDatabase()
    .prepare(`SELECT ${LISTING_COLUMNS} FROM games WHERE status = 'published' AND is_featured = 1 ORDER BY published_at DESC LIMIT ?`)
    .all(limit) as ListingGameRow[];

  return rows.map(mapListingGame);
}

export function getGameBySlug(slug: string) {
  const row = getDatabase().prepare(
    `SELECT ${LISTING_COLUMNS}, components_json, gallery_json FROM games WHERE slug = ? AND status = 'published'`
  ).get(slug) as GameRow | undefined;
  return row ? mapGame(row) : null;
}

export function getRelatedGames(category: string, excludeSlug: string) {
  const rows = getDatabase()
    .prepare(`SELECT ${LISTING_COLUMNS} FROM games WHERE status = 'published' AND category = ? AND slug != ? ORDER BY rating DESC LIMIT ?`)
    .all(category, excludeSlug, MAX_RELATED_GAMES) as ListingGameRow[];
  return rows.map(mapListingGame);
}

// --- P1-6: Pagination support ---

/** Maximum allowed page size to prevent excessive query results. */
const MAX_PAGE_SIZE = 100;

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function getMarketplaceGames(
  filters: MarketplaceFilters,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): PaginatedResult<GameListingView> {
  const conditions = [`status = 'published'`];
  const params: Array<string | number> = [];
  const clampedPageSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);

  if (filters.query) {
    conditions.push(`(title LIKE ? ESCAPE '\\' OR tagline LIKE ? ESCAPE '\\' OR designer_name LIKE ? ESCAPE '\\')`);
    const escaped = filters.query.trim().replace(/[%_\\]/g, '\\$&');
    const match = `%${escaped}%`;
    params.push(match, match, match);
  }

  if (filters.category) {
    conditions.push('category = ?');
    params.push(filters.category);
  }

  if (filters.access) {
    conditions.push('access_type = ?');
    params.push(filters.access);
  }

  if (filters.players) {
    if (filters.players === '5+') {
      conditions.push('player_max >= 5');
    } else {
      conditions.push('player_min <= ? AND player_max >= ?');
      params.push(Number(filters.players), Number(filters.players));
    }
  }

  if (filters.complexity) {
    if (filters.complexity === 'light') conditions.push('complexity <= 2');
    if (filters.complexity === 'medium') conditions.push('complexity = 3');
    if (filters.complexity === 'heavy') conditions.push('complexity >= 4');
  }

  if (filters.price) {
    if (filters.price === 'free') conditions.push("access_type = 'free'");
    if (filters.price === 'paid') conditions.push('price_cents > 0');
    if (filters.price === 'under5') conditions.push('price_cents > 0 AND price_cents <= 500');
    if (filters.price === 'under10') conditions.push('price_cents > 0 AND price_cents <= 1000');
  }

  if (filters.rating) {
    conditions.push('rating >= ?');
    params.push(Number(filters.rating));
  }

  const orderBy = resolveOrderBy(filters.sort);
  const whereClause = conditions.join(' AND ');

  // Count total matches (defensive copy so count and paginated queries stay independent)
  const countSql = `SELECT COUNT(*) as total FROM games WHERE ${whereClause}`;
  const filterParams = [...params];
  const { total } = getDatabase().prepare(countSql).get(...filterParams) as { total: number };

  // Paginated query
  const totalPages = total === 0 ? 0 : Math.ceil(total / clampedPageSize);
  const safePage = totalPages > 0 ? Math.min(Math.max(1, page), totalPages) : 1;
  const offset = (safePage - 1) * clampedPageSize;
  const sql = `SELECT ${LISTING_COLUMNS} FROM games WHERE ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
  const rows = getDatabase().prepare(sql).all(...filterParams, clampedPageSize, offset) as ListingGameRow[];

  return {
    items: rows.map(mapListingGame),
    total,
    page: safePage,
    pageSize: clampedPageSize,
    totalPages,
  };
}

export function getReviewsForGame(gameId: number) {
  return getDatabase()
    .prepare(`SELECT id, game_id AS gameId, author, title, body, rating, created_at AS createdAt, verified FROM reviews WHERE game_id = ? ORDER BY created_at DESC LIMIT ?`)
    .all(gameId, MAX_REVIEWS_PER_GAME) as Review[];
}

export function getTutorials() {
  return getDatabase().prepare(`SELECT id, title, difficulty, estimated_time AS estimatedTime, thumbnail_label AS thumbnailLabel, access_type AS accessType, technique, linked_game_slug AS linkedGameSlug, summary FROM tutorials ORDER BY id ASC`).all() as Tutorial[];
}

export function getCraftGallery() {
  return getDatabase().prepare(`SELECT id, title, maker, caption, location, color FROM craft_gallery ORDER BY id ASC`).all() as CraftGalleryItem[];
}

export function getDesignerProfiles() {
  const rows = getDatabase()
    .prepare(`
      SELECT slug, name, headline, bio, location, specialties_json, joined_at, featured_game_slug,
             game_count, total_revenue_cents, total_downloads
      FROM designers
      ORDER BY total_revenue_cents DESC, game_count DESC, name ASC
    `)
    .all() as DesignerProfileRow[];

  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    headline: row.headline,
    bio: row.bio,
    location: row.location,
    specialties: safeJsonParse<string[]>(row.specialties_json, []),
    joinedAt: row.joined_at,
    featuredGameSlug: row.featured_game_slug,
    gameCount: row.game_count,
    totalRevenueCents: row.total_revenue_cents,
    totalDownloads: row.total_downloads,
  })) as DesignerProfile[];
}

export function getCraftAlongSchedule() {
  return getDatabase()
    .prepare(`
      SELECT craft_alongs.id, craft_alongs.month_label, craft_alongs.game_slug, games.title AS game_title,
             craft_alongs.theme, craft_alongs.summary, craft_alongs.material_focus, craft_alongs.is_current
      FROM craft_alongs
      JOIN games ON games.slug = craft_alongs.game_slug
      ORDER BY craft_alongs.id ASC
    `)
    .all()
    .map((row) => {
      const craftRow = row as CraftAlongRow;
      return {
        id: craftRow.id,
        monthLabel: craftRow.month_label,
        gameSlug: craftRow.game_slug,
        gameTitle: craftRow.game_title,
        theme: craftRow.theme,
        summary: craftRow.summary,
        materialFocus: craftRow.material_focus,
        isCurrent: Boolean(craftRow.is_current),
      } satisfies CraftAlongFeature;
    });
}

export function getMonthlyCraftGame() {
  const row = getDatabase().prepare(`
    SELECT ${JOINED_GAME_LISTING_COLUMNS}
    FROM craft_alongs
    JOIN games ON games.slug = craft_alongs.game_slug
    WHERE craft_alongs.is_current = 1 AND games.status = 'published'
    ORDER BY craft_alongs.id DESC
    LIMIT 1
  `).get() as ListingGameRow | undefined;

  if (row) return mapListingGame(row);

  const fallback = getDatabase().prepare(`SELECT ${LISTING_COLUMNS} FROM games WHERE status = 'published' AND is_monthly_craft = 1 LIMIT 1`).get() as
    | ListingGameRow
    | undefined;
  return fallback ? mapListingGame(fallback) : null;
}

export function getGameOptions() {
  const rows = getDatabase().prepare(`SELECT slug, title FROM games WHERE status = 'published' ORDER BY title ASC`).all() as Array<{
    slug: string;
    title: string;
  }>;
  return rows;
}

export function getOptimizerGames(): OptimizerGame[] {
  const rows = getDatabase()
    .prepare(
      `SELECT slug, title, sheet_count, estimated_ink, paper_stock_recommendation, cut_guide, preview_layout
       FROM games WHERE status = 'published' ORDER BY title ASC`
    )
    .all() as Array<{
    slug: string;
    title: string;
    sheet_count: number;
    estimated_ink: string;
    paper_stock_recommendation: string;
    cut_guide: string;
    preview_layout: string;
  }>;
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    sheetCount: row.sheet_count,
    estimatedInk: row.estimated_ink,
    paperStockRecommendation: row.paper_stock_recommendation,
    cutGuide: row.cut_guide,
    previewLayout: row.preview_layout,
  }));
}

export function getDesignerDashboard() {
  const games = (getDatabase()
    .prepare(`SELECT ${LISTING_COLUMNS} FROM games WHERE designer_slug = ? ORDER BY CASE WHEN status = 'draft' THEN 0 ELSE 1 END, published_at DESC`)
    .all(CURRENT_DESIGNER_SLUG) as ListingGameRow[]).map(mapListingGame);

  const metrics = getDatabase()
    .prepare(`SELECT label, downloads, revenue FROM designer_metrics WHERE designer_slug = ? ORDER BY id ASC`)
    .all(CURRENT_DESIGNER_SLUG) as DashboardMetric[];

  const geography = getDatabase()
    .prepare(`SELECT region, downloads FROM designer_geography WHERE designer_slug = ? ORDER BY downloads DESC`)
    .all(CURRENT_DESIGNER_SLUG) as GeographyMetric[];

  const totalRevenue = games.reduce((sum, game) => sum + game.revenueCents, 0);
  const publishedGames = games.filter((game) => game.status === 'published');
  const totalDownloads = publishedGames.reduce((sum, game) => sum + game.downloadCount, 0);
  const averageRating = publishedGames.length
    ? Number((publishedGames.reduce((sum, game) => sum + game.rating, 0) / publishedGames.length).toFixed(1))
    : 0;

  return {
    games,
    metrics,
    geography,
    summary: {
      totalRevenue,
      totalDownloads,
      averageRating,
      publishedCount: publishedGames.length,
      payoutShare: Math.round(totalRevenue * DESIGNER_REVENUE_SHARE),
      platformShare: totalRevenue - Math.round(totalRevenue * DESIGNER_REVENUE_SHARE),
    },
  };
}

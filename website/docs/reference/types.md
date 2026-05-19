---
title: Types
description: Public TypeScript types you'll touch when extending PnP Hub.
---

# Types

PnP Hub uses a [composable type pattern](../concepts/data-model#the-composable-type-pattern). This page lists the public types most likely to appear in code you write.

All types live in [`lib/types.ts`](https://github.com/TabletopFoundry/pnp-hub/blob/main/lib/types.ts).

## Enums

```ts
export type AccessType   = 'free' | 'included' | 'purchase';
export type GameStatus   = 'published' | 'draft';
export type GameCategory =
  | 'Strategy' | 'Party' | 'Family' | 'Solo'
  | 'Cooperative' | 'Card' | 'Educational' | '2-Player';
```

Validate at runtime against `ACCESS_TYPES`, `GAME_CATEGORIES` from `lib/constants.ts`.

## Composable groups

These are the small types that other views compose from. You'll rarely consume them directly.

```ts
export type GameCore         = { id; slug; title; tagline; description; category; status };
export type GamePlayInfo     = { playerMin; playerMax; playTime; complexity; ageRange };
export type GamePricing      = { priceCents; accessType };
export type GamePrintProfile = { assemblyEffort; paperRequirements; estimatedInk;
                                 sheetCount; cutDifficulty; paperStockRecommendation;
                                 cutGuide; previewLayout; componentSummary };
export type GameDesignerInfo = { designerName; designerSlug; revenueCents;
                                 downloadCount; uploadedFiles?: string[] };
export type GameCatalogMeta  = { rating; ratingCount; publishedAt; popularity;
                                 isFeatured; isMonthlyCraft };
export type GameDetailContent = { components: string[]; gallery: string[] };
```

## Aggregate views

| Type | Use it when |
|---|---|
| `GameSummary` | You need everything — designer dashboard, detail page server load. |
| `GameListingView` | Marketplace listing with print profile but no gallery/components. |
| `GameCardView` | Compact card UI — only the fields the card actually renders. |
| `OptimizerGame` | Pickled subset for the optimizer's game selector. |

`GameCardView`'s composition is worth quoting because it's the cleanest example of the pattern:

```ts
export type GameCardView = GameCore
  & Pick<GamePlayInfo, 'playerMin' | 'playerMax' | 'playTime' | 'complexity'>
  & GamePricing
  & Pick<GameCatalogMeta, 'rating' | 'ratingCount'>;
```

## Other public types

```ts
export type Review = {
  id: number;
  gameId: number;
  author: string;
  title: string;
  body: string;
  rating: number;     // 1-5
  createdAt: string;  // ISO 8601
  verified: boolean;
};

export type DesignerProfile = {
  slug: string;
  name: string;
  bio: string;
  yearStarted: number;
  links: { website?: string; mastodon?: string };
};

export type Tutorial = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  linkedGameSlug?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readMinutes: number;
  publishedAt: string;
};

export type CraftGalleryItem = {
  id: number;
  author: string;
  gameSlug?: string;
  caption: string;
  imageUrl: string;
};

export type CraftAlongFeature = {
  month: string;       // 'YYYY-MM'
  gameSlug: string;
  theme: string;
  prompt: string;
};

export type MarketplaceFilters = {
  category?: GameCategory;
  accessType?: AccessType;
  search?: string;
  sort?: SortKey;
};

export type SortKey = 'popularity' | 'rating' | 'newest' | 'price-asc' | 'price-desc';
```

## Adding a type

1. If the new field belongs to an existing concern (play info, pricing, etc.), add it to the relevant `Game<Concern>` group and to the database schema.
2. If it's a new concern, add a new group type and include it in the aggregate views that need it.
3. The TypeScript compiler will tell you exactly which call sites need updating — that's the whole point of the pattern.

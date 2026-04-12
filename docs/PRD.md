# Gap Analysis

| Gap Area | What was missing or unclear in the original PRD | Delivery risk created | How this enhanced PRD resolves it |
|---|---|---|---|
| Scope boundary | Marketplace, subscriptions, designer tooling, classroom licensing, community, and POD bridge were presented at the same priority level | Team could overbuild v1 and miss launch window | Splits work into v1, out of scope, and v2+; sequences high-complexity items such as POD bridge and classroom licensing to later phases [INFERRED] |
| User stories | Features were listed, but not tied to concrete user goals | Engineering cannot validate outcomes per persona | Adds persona-specific user stories for each functional requirement |
| Acceptance criteria | No Given/When/Then acceptance criteria | Ambiguous implementation and QA expectations | Adds testable acceptance criteria for every in-scope requirement |
| Edge cases | No handling for failed payments, unsupported printers, delisted titles, copyright claims, or expired entitlements | High support burden and inconsistent behavior | Adds edge cases and fallback behavior per requirement |
| Monetization model | Free downloads, subscriptions, and paid purchases were not reconciled | Confusion over catalog access and entitlement logic | Defines three catalog states—Free, Included, Purchase-only [INFERRED] |
| Print optimizer definition | “Smart print optimizer” was compelling but operationally vague | High build risk for a core differentiator | Defines inputs, outputs, supported formats, limits, printer profile behavior, and fallback rules |
| Moderation and trust | Editorial review was mentioned, but content rights verification and takedown flow were undefined | Copyright and marketplace trust risk | Adds submission attestation, review queue, takedown workflow, and audit expectations |
| Non-functional requirements | No performance, availability, accessibility, browser, retention, or security targets | Engineers cannot size infrastructure or QA scope | Adds explicit NFR targets with p95 goals and support matrix [INFERRED] |
| Data model | Core entities and entitlement relationships were implicit | Increased risk of rework in backend and analytics | Adds conceptual data model, relationships, and PII flags |
| Metrics | Only top-line business metrics existed | Team could optimize for vanity metrics instead of funnel health | Adds launch KPIs for activation, conversion, optimizer usage, and review SLA [INFERRED] |
| Dependencies | External services were named, but failure modes and integration contracts were not | Hidden operational risk | Adds integration points and failure handling expectations |
| Open decisions | Several decisions were assumed but not surfaced | Untracked ambiguity during implementation | Captures [NEEDS INPUT] items with proposed defaults so the team can proceed |

# PRD: PnP Hub — Print-and-Play Digital Marketplace & Subscription

> Unless otherwise noted, quantitative targets and sequencing choices added in this version are marked [INFERRED]. Unknown decisions requiring stakeholder confirmation are marked [NEEDS INPUT].

## 1. Overview

### Product Name
PnP Hub

### One-liner
A curated digital marketplace for print-and-play board games that helps players discover, buy, download, and print games successfully at home.

### Problem
The print-and-play (PnP) market is real but fragmented. Players struggle to discover high-quality games, evaluate whether files are print-ready, and assemble components without trial and error. Designers lack a purpose-built storefront with better merchandising, clearer analytics, lower fees, and structured file/version management.

### Solution
PnP Hub provides:
- A curated web marketplace for free, subscription-included, and purchase-only PnP games
- A lightweight subscription that adds value through convenience tools and included catalog access
- A print optimizer that converts approved source assets into home-printer-friendly output for common paper sizes
- Designer workflows for submission, review, publishing, versioning, and revenue tracking
- Tutorials that reduce the friction between download and successful tabletop play

### Product Principles
1. **Discovery before complexity**: users should find a worthwhile game in under 3 minutes [INFERRED].
2. **Print confidence over file dumping**: every published title must clearly state print requirements and expected assembly effort.
3. **Entitlements must be predictable**: users should always know whether a game is Free, Included, or Purchase-only [INFERRED].
4. **Supply-side trust matters**: designer uploads must be rights-cleared and editorially reviewed before publication.
5. **Desktop-first for making, responsive for browsing**: browsing should work on any device; serious print configuration is optimized for desktop [INFERRED].

### Monetization Model
To resolve ambiguity in the original concept, v1 uses three catalog access types [INFERRED]:
- **Free**: available at no cost; registered free users may download up to 2 free titles per calendar month [INFERRED].
- **Included**: available to active Maker or Maker+ subscribers.
- **Purchase-only**: requires one-time purchase even if the user has a subscription.

### Initial KPIs (first 12 months post-GA)

| KPI | Target |
|---|---|
| Registered users | 10,000 [INFERRED] |
| Paying subscribers | 1,500 [INFERRED] |
| Approved designers | 120 [INFERRED] |
| Live titles | 300 [INFERRED] |
| Total downloads | 50,000 [INFERRED] |
| Free-to-paid conversion | 8% [INFERRED] |
| Checkout completion rate | 85% [INFERRED] |
| Optimizer attach rate on eligible downloads | 40% [INFERRED] |
| First-response SLA for copyright/takedown reports | <2 business days [INFERRED] |
| Editorial review SLA compliance | 95% of submissions reviewed within 10 business days [INFERRED] |

## 2. Users & Personas

| Persona | Goals | Pain Points | Tech Comfort |
|---|---|---|---|
| **Budget Gamer Bailey** (primary buyer) | Try new games cheaply, print a fun game tonight, avoid wasting ink/paper | Hard to know which files are good, unclear assembly effort, poor discovery on forums | Medium; comfortable with ecommerce, less comfortable with print settings |
| **Craft Hobbyist Casey** (secondary buyer) | Enjoy making premium-looking home versions, learn better assembly techniques | Wants better print quality, cutting guides, and tutorials; current files vary wildly in quality | Medium-high; willing to use advanced settings if guided |
| **Indie Designer Devin** (primary supplier) | Publish games quickly, earn revenue, reach an audience, update files cleanly | Existing channels have low discoverability, high commissions, and weak analytics | High; comfortable with uploads and dashboards |
| **Educator Erin** (future expansion) | Print multiple copies for classroom use legally and affordably | Licensing is unclear, classroom printing needs repeatability and budget predictability | Medium; values clarity over customization |
| **Editorial Reviewer Riley** (internal ops) | Validate quality, rights, and metadata quickly | Needs structured submissions, repeatable criteria, and clear status tracking | High |

## 3. Scope

### In Scope for v1
- Web marketplace with SEO-friendly public game pages
- Account creation, login, email verification, password reset [INFERRED]
- Roles: buyer, designer, editor, admin [INFERRED]
- Catalog browsing, search, filtering, sorting, and category landing pages
- Game detail pages with pricing/access labels, print requirements, and assembly effort
- One-time purchases and Maker / Maker+ subscriptions
- User library with entitled downloads
- Watermarked PDF delivery for paid and included titles
- Print optimizer for approved PDF assets, US Letter and A4 paper, color/grayscale, simplex/duplex where supported [INFERRED]
- Designer onboarding, submission, metadata entry, file upload, pricing, versioning, and basic analytics
- Editorial review workflow for publish / reject / request changes
- Ratings and written reviews from entitled users
- Tutorial library with free and subscriber-only content
- Transactional email for receipts, download confirmations, version updates, and review status changes [INFERRED]

### Out of Scope for v1
- Native iOS/Android apps [INFERRED]
- Print-on-demand file conversion or direct POD order placement [INFERRED]
- Community gallery and monthly craft-along events [INFERRED]
- Designer follower/social graph [INFERRED]
- Multi-currency pricing and localized tax rules beyond supported Stripe defaults [NEEDS INPUT]
- AI-generated pricing guidance or AI-based design assistance [INFERRED]
- Classroom site license management, seat tracking, and curriculum guides [INFERRED]
- Affiliate storefront for supplies [INFERRED]
- In-platform messaging/chat between users and designers [INFERRED]

### Future v2+
- Classroom and library licensing with multi-copy print allowances
- POD bridge to The Game Crafter / similar partner
- Community gallery, craft-along events, and creator follow system
- Additional paper sizes and printer profile presets by model
- Bundles, coupons, gifting, and regional pricing
- Advanced designer analytics (cohorts, conversion funnels, attribution) [INFERRED]

## 4. Functional Requirements

### Access Model Notes
- Every title must have exactly one access label: **Free**, **Included**, or **Purchase-only** [INFERRED].
- A user’s entitlement may come from a free download allowance, one-time purchase, admin grant, or active subscription.
- If a title is delisted after purchase, prior purchasers retain access to their last entitled version unless removed for legal reasons [INFERRED].

### FR-01 — Account, Authentication, and Roles
- **User story:** As a buyer or designer, I want an account so my purchases, downloads, submissions, and settings persist across sessions.
- **Description:** The platform must support account creation, login, logout, email verification, password reset, and role-based access. Buyers can upgrade to designers from inside their account. Editors and admins access internal workflows not visible to buyers.
- **Acceptance criteria:**
  - **Given** a new visitor with a unique email, **when** they complete sign-up and verify their email, **then** an account is created and they land in their library or intended return path.
  - **Given** an unverified account, **when** the user attempts a paid purchase or designer submission, **then** the system blocks the action and prompts email verification.
  - **Given** a user with editor role, **when** they log in, **then** they can access the editorial queue but not admin-only settings.
- **Edge cases:** duplicate email, expired verification links, too many failed login attempts, banned user attempting re-entry, user converting from buyer to designer without losing prior library.
- **Priority:** Must
- **Dependencies:** Auth service or app-managed auth [INFERRED], email provider

### FR-02 — Catalog Discovery, Search, and Filtering
- **User story:** As a buyer, I want to quickly find games that fit my budget, player count, and print setup.
- **Description:** The marketplace must support browse by category, text search, faceted filters, sorting, and curated collections. Filters should include price/access type, player count, play time, complexity, category, assembly effort, paper size compatibility, and free vs paid [INFERRED].
- **Acceptance criteria:**
  - **Given** a catalog with published titles, **when** a user filters by “2-player” and “Included,” **then** only matching published titles are shown.
  - **Given** a search term that matches title, subtitle, or designer name, **when** the user searches, **then** relevant results are returned and sorted by relevance by default [INFERRED].
  - **Given** no matching titles, **when** filters produce zero results, **then** the user sees an empty state with clear next actions.
- **Edge cases:** unpublished titles appearing in search, adult or blocked content hidden from public search [INFERRED], typo tolerance [NEEDS INPUT], zero-result filters, deleted designer profile.
- **Priority:** Must
- **Dependencies:** FR-03, search indexing [INFERRED]

### FR-03 — Game Detail Page and Merchandising Metadata
- **User story:** As a buyer, I want to evaluate a game before acquiring it so I know what I will print and assemble.
- **Description:** Each published title requires a public detail page with cover art, description, designer, access label, price, player count, play time, age range, complexity, component list, page count, print requirements, assembly effort, tutorial links if available, rating summary, and version changelog.
- **Acceptance criteria:**
  - **Given** a published title, **when** a user opens its detail page, **then** they see the latest approved version metadata and the correct acquire CTA based on entitlement state.
  - **Given** a user who already owns the game, **when** they revisit the detail page, **then** the primary CTA changes to “Go to Library” or “Download.”
  - **Given** a title with a newer version, **when** a prior purchaser views the page, **then** they can see the latest changelog.
- **Edge cases:** missing cover image fallback, delisted-but-owned title, unsupported printer options clearly called out, tutorial absent, rating count under threshold [INFERRED].
- **Priority:** Must
- **Dependencies:** FR-02, FR-05, FR-11

### FR-04 — Checkout, Subscription Management, and Entitlements
- **User story:** As a buyer, I want to buy a game or subscribe without confusion about what I get.
- **Description:** Support one-time purchases for Purchase-only titles and recurring subscriptions for Included titles. Users can start, upgrade, downgrade, cancel, and resume subscriptions. Successful payment must create or update entitlement records.
- **Acceptance criteria:**
  - **Given** a logged-in buyer without entitlement, **when** they successfully complete checkout for a Purchase-only title, **then** a purchase record and perpetual entitlement are created within 30 seconds [INFERRED].
  - **Given** a logged-in buyer, **when** they subscribe to Maker or Maker+, **then** Included titles become downloadable immediately after successful payment confirmation.
  - **Given** an active subscriber, **when** they cancel, **then** access remains through the current paid period and then expires automatically.
  - **Given** a free user who has already claimed 2 free titles in the current calendar month, **when** they attempt a third free-title download, **then** the system blocks the request and offers upgrade or wait-until-reset messaging [INFERRED].
- **Edge cases:** payment failure, duplicate Stripe webhook, partial tax calculation [NEEDS INPUT], chargeback/refund reversing entitlement, failed subscription renewal, plan downgrade while user has downloaded Maker+-exclusive files.
- **Priority:** Must
- **Dependencies:** Stripe, FR-01, FR-05

### FR-05 — Secure Library, Downloads, and Watermarked File Delivery
- **User story:** As an entitled user, I want a reliable library so I can re-download my games safely anytime.
- **Description:** Each user has a library showing current entitlements, version status, and download options. Paid and Included titles must deliver watermarked PDFs or equivalent protected download bundles; free files may use unsigned originals if the designer permits [INFERRED]. Downloads use short-lived signed URLs.
- **Acceptance criteria:**
  - **Given** an entitled user, **when** they open My Library, **then** they see all currently accessible titles, access source, and last available version.
  - **Given** an entitled user, **when** they click download, **then** the system provides a valid signed URL or generated watermarked asset within 60 seconds [INFERRED].
  - **Given** a user with no entitlement, **when** they request a protected asset URL directly, **then** access is denied.
- **Edge cases:** watermark job failure, expired signed URL, delisted title with retained access, legal takedown blocking access, same user downloading from multiple devices, file too large for inline generation.
- **Priority:** Must
- **Dependencies:** FR-04, object storage/CDN, watermark worker [INFERRED]

### FR-06 — Print Optimizer and Printer Profiles
- **User story:** As a buyer, I want print-ready output tailored to my setup so I waste less paper and ink.
- **Description:** The optimizer accepts approved source assets for eligible titles and generates printable output using declared component metadata. v1 supports PDF source files, US Letter and A4, grayscale/color choice, safe margins, crop marks, cut lines, and estimated sheet count. Printer profiles store preferred settings but do not require model-specific drivers [INFERRED].
- **Acceptance criteria:**
  - **Given** an entitled user on an optimizer-eligible title, **when** they choose paper size and print settings, **then** the system generates a preview and optimized output package.
  - **Given** a title whose assets cannot be optimized, **when** the user opens the optimizer, **then** the system explains why and offers original files instead.
  - **Given** a saved printer profile, **when** the user starts a new optimization job, **then** saved defaults are pre-selected.
- **Edge cases:** source PDF missing bleed, oversized board sheets, unsupported paper size, incompatible duplex settings, queue backlog, canceled job, corrupted upload source, user on mobile device [INFERRED].
- **Priority:** Must
- **Dependencies:** FR-05, Python optimization worker, metadata quality from FR-07/FR-08

### FR-07 — Designer Onboarding and Submission Workflow
- **User story:** As a designer, I want to upload a game once with clear metadata so it can be reviewed and sold.
- **Description:** Designers can create a public profile, accept marketplace terms, provide payout details, upload files, declare rights ownership, define access model and price, tag components, and submit a title for editorial review.
- **Acceptance criteria:**
  - **Given** a verified user who opts into designer mode, **when** they complete required profile and payout fields, **then** they can create draft submissions.
  - **Given** a draft submission missing required metadata or files, **when** the designer attempts to submit, **then** the system blocks submission and lists validation errors.
  - **Given** a complete submission, **when** the designer submits it, **then** the record enters the editorial queue with immutable submitted assets and metadata snapshot [INFERRED].
- **Edge cases:** unsupported payout country [NEEDS INPUT], oversized upload, duplicate game slug, designer edits after submission, missing rules file, content rights dispute after submission.
- **Priority:** Must
- **Dependencies:** FR-01, storage, payout onboarding integration [INFERRED]

### FR-08 — Editorial Review, Moderation, and Publishing
- **User story:** As an editor, I want a structured queue so I can approve high-quality, rights-cleared games efficiently.
- **Description:** Internal reviewers can inspect metadata, preview files, validate print quality, verify copyright attestation, and choose Approve, Reject, or Request Changes. Only approved versions become public. Takedown reports must create a case and allow rapid unpublishing.
- **Acceptance criteria:**
  - **Given** a submitted title, **when** an editor approves it, **then** the title becomes publicly visible and acquirable.
  - **Given** a submitted title with issues, **when** an editor requests changes, **then** the designer receives reason codes and comments.
  - **Given** a published title with a valid takedown claim, **when** an admin unpublishes it, **then** the public listing is removed and the event is audit logged.
- **Edge cases:** simultaneous reviewers, reviewer conflict, urgent legal takedown outside business hours [NEEDS INPUT], version rollback, malicious file upload, title already purchased before unpublish.
- **Priority:** Must
- **Dependencies:** FR-07, admin tooling, audit logging [INFERRED]

### FR-09 — Ratings, Reviews, and User Reporting
- **User story:** As a buyer, I want trustworthy reviews so I can judge whether a game is worth printing.
- **Description:** Entitled users can leave one star rating and one editable written review per title. Reviews may be reported for abuse. Average rating and review count appear publicly once moderation rules are met [INFERRED].
- **Acceptance criteria:**
  - **Given** a user who has downloaded a title, **when** they submit a review, **then** the review is attached to that title and their existing review is updated rather than duplicated.
  - **Given** a non-entitled user, **when** they attempt to review, **then** the system blocks submission.
  - **Given** a reported review, **when** a moderator removes it, **then** it no longer appears publicly and rating aggregates update.
- **Edge cases:** review bombing, profanity/spam, deleted users, designer replying to reviews [out of scope v1], low sample size causing misleading averages [INFERRED].
- **Priority:** Should
- **Dependencies:** FR-05, moderation tooling [INFERRED]

### FR-10 — Tutorial Library
- **User story:** As a buyer, I want practical crafting guidance so I can successfully assemble what I downloaded.
- **Description:** PnP Hub hosts or embeds tutorials organized by technique, component type, difficulty, and access tier. Tutorials can be linked from game pages where relevant.
- **Acceptance criteria:**
  - **Given** a user browsing tutorials, **when** they filter by “token making” or “beginner,” **then** relevant tutorials are shown.
  - **Given** a subscriber-only tutorial, **when** a free user opens it, **then** they see a paywall preview and upgrade CTA.
  - **Given** a game with linked tutorials, **when** a user opens the game page, **then** those tutorials are visible in context.
- **Edge cases:** broken embedded video, tutorial removed, no tutorials for a specific game, subscriber downgrade removing access.
- **Priority:** Should
- **Dependencies:** CMS/content hosting [INFERRED], FR-03

### FR-11 — Designer Analytics, Versioning, and Purchaser Notifications
- **User story:** As a designer, I want to understand performance and ship improvements without breaking customer access.
- **Description:** Designers can view daily aggregated sales/download data, revenue summary, top geographies, rating summary, and version history. Designers may upload a new version with changelog, which must go through review before replacing the current live version. Prior entitled users receive update notifications.
- **Acceptance criteria:**
  - **Given** a published title, **when** the designer opens analytics, **then** they see downloads, revenue, average rating, and top country breakdown updated at least daily [INFERRED].
  - **Given** a live title, **when** the designer submits version 1.1, **then** version 1.0 remains public until version 1.1 is approved.
  - **Given** an approved new version, **when** publication completes, **then** prior entitled users receive a version-update notification with changelog.
- **Edge cases:** bad release rollback, duplicate version number, version approved after title was delisted, geography hidden for low-volume privacy thresholds [INFERRED].
- **Priority:** Should
- **Dependencies:** FR-07, FR-08, email provider, analytics pipeline [INFERRED]

## 5. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Public catalog and game detail pages must achieve p95 server response time under 800 ms and LCP under 2.5 s on broadband desktop for cached traffic [INFERRED]. |
| Performance | Authenticated library and account pages must load primary content in under 2.0 s p95 after login [INFERRED]. |
| Performance | Checkout API responses excluding payment-provider latency must complete in under 500 ms p95 [INFERRED]. |
| Performance | Watermarked asset generation must complete in under 60 s p95 for files up to 250 MB; optimizer jobs must complete in under 45 s p95 for eligible titles up to 150 pages [INFERRED]. |
| Availability | Public marketplace, authentication, and entitled download APIs must meet 99.5% monthly availability in v1 [INFERRED]. Planned maintenance excluded with advance notice. |
| Resilience | Payment and entitlement updates must be idempotent. Target RPO <=15 minutes and RTO <=4 hours for core transactional data [INFERRED]. |
| Scalability | Architecture must support 50,000 MAU, 5,000 DAU, 10,000 live titles, 1,000 concurrent download requests, and 200 concurrent optimization jobs without re-architecture [INFERRED]. |
| Security model | RBAC required for buyer, designer, editor, admin. Use hashed passwords, TLS in transit, encrypted object storage, short-lived signed asset URLs, audit logs for admin/editor actions, malware scanning on uploads, and least-privilege service credentials [INFERRED]. |
| Commerce security | PCI data must not touch PnP Hub servers directly; use Stripe-hosted or tokenized payment flows. Support webhook signature validation and replay protection [INFERRED]. |
| Privacy | Minimize PII to account, billing, and payout needs. Support account deletion requests and export of owned-library metadata [INFERRED]. Jurisdictions requiring GDPR/CCPA support are [NEEDS INPUT]. |
| Accessibility | User-facing surfaces must meet WCAG 2.1 AA; keyboard navigation, visible focus states, semantic headings, alt text, and sufficient contrast are required [INFERRED]. |
| Internationalization | v1 UI is English-only [INFERRED], but all text systems must support UTF-8. Support USD at launch; multi-currency is [NEEDS INPUT]. |
| Data retention | Account/profile data retained until deletion request plus 30 days [INFERRED]; financial transaction records retained 7 years [INFERRED]; operational logs retained 90 days [INFERRED]; rejected uploads retained 180 days for dispute handling [INFERRED]. |
| Browser support | Support latest two stable versions of Chrome, Edge, Firefox, and Safari. Desktop is the primary supported environment for checkout, library, and optimizer. Mobile browsing is supported, but advanced print configuration is desktop-first [INFERRED]. |
| Observability | Instrument funnel events for browse, game view, acquire click, checkout start, checkout success, download start, download success, optimizer start, optimizer success/failure, submission start, submission complete, review outcome [INFERRED]. |

## 6. User Flows

### Flow 1 — Discover and acquire a game
**Happy path**
1. User lands on homepage or category page.
2. User filters/searches catalog.
3. User opens a game detail page.
4. User sees clear label: Free, Included, or Purchase-only.
5. User signs in or creates account if needed.
6. User downloads free title, purchases title, or subscribes.
7. User is redirected to My Library with the title available.

**Error/alternate paths**
- If free-tier monthly limit is exhausted, show upgrade CTA and reset timing.
- If checkout fails, retain cart/context and present retry options.
- If title is not available in the user’s region or tax jurisdiction [NEEDS INPUT], disable purchase and explain why.

### Flow 2 — Generate optimized print files
**Happy path**
1. User opens entitled title from My Library.
2. User chooses “Optimize for printing.”
3. User selects paper size, color mode, duplex preference, and safe margins.
4. System validates asset eligibility and starts job.
5. User sees progress and preview.
6. User downloads optimized package and optional original files.

**Error/alternate paths**
- If source assets are ineligible, fall back to original files with explanation.
- If queue time exceeds threshold, notify user by email when ready [INFERRED].
- If job fails, preserve inputs and allow retry.

### Flow 3 — Designer submits a new title
**Happy path**
1. Verified user upgrades to designer account.
2. Designer completes public profile, payout setup, and terms acceptance.
3. Designer creates draft title and uploads assets.
4. Designer fills metadata, rights attestation, pricing, and access model.
5. System validates draft and allows submission.
6. Editorial queue receives immutable submission snapshot.
7. Editor approves; title becomes public.

**Error/alternate paths**
- Missing metadata blocks submission with actionable errors.
- If upload scan fails, file is quarantined and designer must re-upload.
- If editor requests changes, designer edits draft and resubmits without losing history.

### Flow 4 — Designer ships a version update
**Happy path**
1. Designer opens an existing live title.
2. Designer creates new version draft and uploads revised files/changelog.
3. Editor reviews and approves.
4. New version replaces live version.
5. Purchasers/subscribers receive notification.

**Error/alternate paths**
- If new version is rejected, current live version remains active.
- If severe defect found post-release, admin can roll back to prior version [INFERRED].

### Flow 5 — User leaves a review and reports a problem
**Happy path**
1. User downloads and plays a game.
2. User returns to detail page or library and submits rating/review.
3. Review appears publicly after moderation rules pass [INFERRED].
4. Another user reports abusive review or file issue.
5. Moderator reviews report and takes action.

**Error/alternate paths**
- Non-entitled users cannot review.
- If review is removed, rating aggregates recalculate.
- If file issue is reported, support ticket routes to designer/editor workflow [INFERRED].

## 7. Data Model

### Conceptual Entities

| Entity | Purpose | Key Relationships | PII |
|---|---|---|---|
| **User** | Core account record | Has many Purchases, Subscriptions, Entitlements, Reviews, PrinterProfiles | Yes (email, name if collected) |
| **DesignerProfile** | Public creator identity and payout readiness | Belongs to User; has many Games | Partial (legal payout data may live in payment provider) |
| **Game** | Public product shell | Belongs to DesignerProfile; has many GameVersions, Reviews | No |
| **GameVersion** | Immutable versioned release | Belongs to Game; has many FileAssets; can create Notifications | No |
| **FileAsset** | Source or generated file metadata | Belongs to GameVersion or OptimizerJob | No |
| **Entitlement** | Access rights for a user to a title | Belongs to User and Game; may originate from Purchase, Subscription, or AdminGrant | No |
| **Purchase** | One-time transaction record | Belongs to User and Game; may create Entitlement | Yes (billing metadata) |
| **Subscription** | Recurring plan state | Belongs to User; may create many active Entitlements | Yes (billing metadata) |
| **PrinterProfile** | Saved print preferences | Belongs to User | Potentially yes if model name entered |
| **OptimizerJob** | Print generation job | Belongs to User and GameVersion; outputs FileAssets | No |
| **SubmissionReview** | Editorial workflow record | Belongs to GameVersion draft; references reviewer User | No |
| **Review** | User rating/review content | Belongs to User and Game | Yes (user-generated text may contain PII) |
| **Tutorial** | Crafting guidance content | May link to many Games | No |
| **Notification** | Outbound email/in-app event | Belongs to User; may reference Purchase, Version, or Review event | Yes (delivery destination) |

### Key Relationship Rules
- A **Game** has one current live **GameVersion** and zero or more historical versions.
- A **User** can hold multiple **Entitlements** to the same **Game**, but only one active entitlement should govern access precedence at a time [INFERRED].
- A **Purchase** creates a perpetual entitlement unless refunded or legally revoked.
- A **Subscription** creates time-bounded entitlement access only for Included titles.
- An **OptimizerJob** must reference a specific entitled **GameVersion** so outputs are reproducible.

## 8. Integration Points

| Integration | Purpose | Data Exchanged | Failure Handling |
|---|---|---|---|
| **Stripe** | One-time purchases, subscriptions, refunds, payout onboarding [INFERRED] | Checkout session IDs, subscription IDs, payment status, tax amounts, payout account status | Webhook retries must be idempotent; failed webhooks alert ops; entitlement creation retried safely |
| **S3-compatible object storage + CDN** | Store source files, generated files, images, tutorial assets | Asset metadata, signed URLs, checksums | On origin failure, show retry state; never expose raw bucket paths |
| **Email provider (e.g., Resend/SendGrid) [INFERRED]** | Verification, receipts, version notices, review/change requests | Email address, template vars, delivery status | Queue and retry transient failures; surface hard bounces for support review |
| **Print optimization worker (Python service)** | Generate optimizer outputs and watermarked derivatives | Source asset IDs, printer settings, output manifests | Jobs must be retryable; preserve failure reason for user-facing messaging |
| **Search index [INFERRED]** | Fast catalog search/filtering | Published game metadata, tags, designer names | If stale, system degrades to database-backed browse with reduced sort options [INFERRED] |
| **Analytics/event pipeline [INFERRED]** | Product funnel and designer reporting | Page views, checkout events, download/optimizer events | Event loss must not block core user actions |
| **Malware scanning service [INFERRED]** | Validate uploaded files | Uploaded asset IDs, scan result | Quarantine suspicious files and block review/publication |

## 9. UX/UI Requirements

| Screen / Surface | Must-have UI requirements | Loading state | Empty state | Error state |
|---|---|---|---|---|
| **Homepage / Catalog** | Clear hero value prop, category chips, search, featured collections, Free/Included/Purchase-only badges | Skeleton cards | “No titles yet” with category links | Retry + fallback to featured/manual collections |
| **Search / Results** | Persistent filters, sort, result count, removable chips | Skeleton list/grid | “No matching games” with clear-reset action | Inline error banner, preserve filters |
| **Game Detail Page** | Cover, CTA, price/access label, print requirements, assembly effort, component summary, screenshots, changelog, reviews | Section skeletons | If unpublished/delisted, explain access status | Missing asset fallback, disable broken actions |
| **Checkout / Plan Select** | Transparent pricing, what’s included, renewal terms, cancellation terms, tax shown before final confirmation [NEEDS INPUT where unsupported] | Button spinner + locked form during submission | N/A | Payment-specific messaging, preserve context |
| **My Library** | Owned/included titles, version badge, download/original/optimize actions, entitlement source | Card/table skeleton | “No games yet” with browse CTA | Per-title action errors without breaking whole page |
| **Optimizer Wizard** | Stepper, printer profile defaults, preview, sheet count, ink estimate, unsupported-option explanations | Progress indicator with percent/status [INFERRED] | N/A | Job failure message with retry and original-file fallback |
| **Designer Dashboard** | Submission statuses, sales/download summary, version history, payout readiness | Dashboard skeleton | “No titles yet” with create CTA | Partial widget failures isolated from whole dashboard |
| **Submission Form** | Autosave draft [INFERRED], metadata validation, upload progress, rights attestation, pricing preview | Field-level save/upload indicators | Draft guidance if nothing started | Inline validation and file-specific errors |
| **Editorial Queue** | Status filters, SLA aging, preview links, approve/reject/request-changes actions | Table skeleton | “No submissions pending” | Action failure must not lose review notes |
| **Tutorial Library** | Filter by skill/component, access labels, related game links | Card skeletons | “No tutorials found” | Embedded media fallback text |

### Additional UX Rules
- All acquire CTAs must use consistent copy tied to entitlement state: **Download Free**, **Included with Maker**, **Buy for $X**, **Go to Library** [INFERRED].
- Any blocked state must explain *why* the action is blocked and what the user can do next.
- Optimizer settings should remember the user’s last-used paper size and color mode [INFERRED].
- Review prompts should appear only after a user has downloaded the title at least once [INFERRED].

## 10. Release & Rollout

### Phase 0 — Supply Setup [INFERRED]
- Recruit 20-30 launch designers [INFERRED]
- Curate first 100 approved titles [INFERRED]
- Validate editorial rubric, watermarking, and optimizer on 10 representative games [INFERRED]
- Exit criteria: at least 90% of approved titles have complete metadata and printable sample QA completed [INFERRED]

### Phase 1 — Closed Alpha [INFERRED]
- Audience: invited early adopters and creators (200-500 users) [INFERRED]
- Scope: catalog, detail pages, purchases, subscriptions, library, basic optimizer, designer submission, editorial tools
- Guardrails: checkout completion >=80%, optimizer success >=85%, P1 bug count <10 [INFERRED]

### Phase 2 — Open Beta [INFERRED]
- Audience: waitlist/public soft launch
- Add ratings/reviews and tutorial library
- Monitor support volumes, takedown/report handling, and designer review SLA
- Guardrails: support tickets <3 per 100 downloads, median editorial turnaround <7 business days [INFERRED]

### Phase 3 — General Availability [INFERRED]
- Public launch across SEO, Reddit, BGG, YouTube creator partnerships
- Launch reporting cadence for KPI review
- Keep risky features (optimizer advanced options, reviews moderation rules) behind feature flags where needed [INFERRED]

### Rollout Controls
- Feature flags for subscriptions, optimizer, reviews, and version-notification emails [INFERRED]
- Canary release for optimizer worker updates [INFERRED]
- Manual rollback path for bad game versions and payout/reporting issues [INFERRED]

### Post-launch Success Review
At 30, 60, and 90 days, review:
- Supply health: titles live, designer activation, review SLA
- Demand health: game views, acquire conversion, downloads, optimizer usage
- Trust health: refund rate, copyright claim rate, moderation backlog
- Reliability health: p95 latency, job failures, email delivery failures

## 11. Open Questions with Proposed Defaults

| Open Question | Why it matters | Proposed default |
|---|---|---|
| **[NEEDS INPUT] Should Classroom be in v1 or v2?** | Impacts pricing, entitlement logic, and legal review | Move Classroom licenses to v2; allow educators to buy as regular users in v1 [INFERRED] |
| **[NEEDS INPUT] Are subscriptions meant to include the full catalog or a subset?** | Core monetization and entitlement design | Use mixed catalog with explicit Included vs Purchase-only labels [INFERRED] |
| **[NEEDS INPUT] What file types are mandatory for submission?** | Drives optimizer feasibility and editorial QA | Require at least one rules PDF and one print-ready PDF in v1; optional PNG ZIP later [INFERRED] |
| **[NEEDS INPUT] Which countries/currencies must be supported at launch?** | Affects pricing, taxes, payout onboarding, and support | Launch in USD with countries supported by selected payment/payout provider; expand later [INFERRED] |
| **[NEEDS INPUT] How should refunds work after download?** | Affects trust and abuse prevention | Default to defect-based/manual refunds after download; automatic refunds allowed before first protected download [INFERRED] |
| **[NEEDS INPUT] Do we need social login at launch?** | Impacts auth scope and support | Start with email/password + verification only; add social login only if signup friction is high [INFERRED] |
| **[NEEDS INPUT] What is the legal standard for copyright review and takedown timing?** | Required for marketplace safety | Use designer rights attestation + editor checklist at submission; target <2 business day first response for claims [INFERRED] |
| **[NEEDS INPUT] Should free users be allowed anonymous downloads?** | Impacts growth vs entitlement accuracy | Require account creation for all downloads so limits, reviews, and library history work cleanly [INFERRED] |
| **[NEEDS INPUT] Should tutorials be hosted directly or embedded?** | Affects storage cost and CMS complexity | Support embedded video + native text/image guides in v1 [INFERRED] |
| **[NEEDS INPUT] Is mobile printing a launch requirement?** | Affects UX and QA scope | Support mobile browsing only; optimize acquisition and printing flows for desktop in v1 [INFERRED] |
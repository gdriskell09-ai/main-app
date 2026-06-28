# PROJECT_STATE.md
## Platform: Local Business Website + Operations SaaS

> This file tracks the current state of the build so future Claude / Codex / ChatGPT sessions start with full context. Update after every completed phase.
>
> **SECURITY:** Never paste API keys, tokens, or passwords into this file. Never commit this file with secrets. Env variables live in `.env.local` (server-side only, never `NEXT_PUBLIC_` for secrets).

---

## 0. Current Operating Snapshot

**Repo identity:** this file belongs to `main-site` at `/Users/grantdriskell/Desktop/projects/gadriskell1/main-site`.

**Product identity:** white-label local business website builder platform. This is not `scrub-club-app`.

**Important separation rule:** `scrub-club-app` is a separate proof-model pressure washing app at `/Users/grantdriskell/Documents/GitHub/scrub-club-app`. Do not copy assumptions, file paths, schema, or app architecture between repos without explicit approval.

**Current phase:** Phase 3.4d.2 complete (2026-06-28). Unified website profile creation flow shipped. Phase 3.5 not yet started.

**Current product rule:** the base website builder must work with zero AI keys. Blueprint/fallback generation remains the default. AI and future tool modules are optional roadmap layers unless explicitly approved.

**Docs source of truth:** also read `AI_TASKS.md`, `BRAND_GUIDELINES.md`, `DESIGN.md`, and the files in `docs/` before starting feature work.

---

## 1. Product Vision

A premium SaaS platform for local service businesses. The core offer is a professionally built website engine + growing operations toolset, all managed through a clean admin dashboard.

**Website product differentiators:**
- AI-assisted content that sounds like the actual business, not a template
- Industry-specific blueprints that give each business type a meaningfully different site
- Custom animated sections (Pressure Wash Reveal, Ice Cream Hero, Gallery, etc.)
- 7 carefully designed style packs — each produces a distinct visual identity
- Free-first content generation; AI is an upgrade layer, never a dependency

**Operations product (longer roadmap):**
- Lead management, job tracking, invoicing, quotes, contracts
- Client dashboard (future)
- CRM + SMS/email automations (future)
- Finance / profit tracking (future)

**Business model:**
- Tiered SaaS subscriptions (pricing not finalized — usage cost analysis first)
- Future: premium modules, AI credits, client dashboards, optional add-on services
- Do not resell raw API access — sell packaged AI-powered tools

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19.2.4 (no component library — all inline styles) |
| CSS | Tailwind v4 (minimal — engine uses inline styles for portability) |
| Database | Supabase (PostgreSQL) — partial integration |
| Auth | Supabase Auth |
| AI | Groq (llama-3.3-70b-versatile) via server-side only |
| Storage (profiles) | localStorage — swappable abstraction layer, Supabase migration planned |
| Maps | react-leaflet |
| Middleware | `proxy.ts` (NOT `middleware.ts` — Next.js 16 naming conflict) |

**Env variables (server-side only, never expose to client):**
- `GROQ_API_KEY` — Groq AI
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase admin access (empty — not yet used for profiles)
- `NEXT_PUBLIC_SUPABASE_URL` — public, safe
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public, safe

---

## 3. Current Build Status

**Build:** `npm run build` passes — 22/22 routes, 0 TypeScript errors.

**Working routes:**
- `/` — Marketing homepage
- `/admin` — Admin dashboard (10-section panel)
- `/admin/login` — Auth
- `/admin/invoice/[id]` — Invoice print view
- `/contact` — Contact form (Supabase)
- `/marketplace` — Pricing/plans page
- `/team` — Team page
- `/samples/*` — 8 static sample websites (barbershop, cleaning, hvac, landscaping, painting, plumbing, pressure-washing, roofing)
- `/website-preview` — Style pack demo
- `/website-preview/[businessId]` — Live business profile preview (dynamic)
- `/api/contact` — Contact form server action
- `/api/generate-copy` — AI copy generation (Groq, server-side only)
- `/api/auth/callback` — Supabase auth callback

---

## 4. Completed Phases

### Phase 0 — Inspection (complete)
App already existed and built cleanly. No code changes needed. 22 routes confirmed working.

### Phase 1 — Website Engine (complete)
Reusable rendering engine that generates client websites from structured JSON data. AI only chooses style pack, section order, and content data — never generates React code.

**Files:**
- `lib/website-engine/types.ts` — TypeScript interfaces
- `lib/website-engine/stylePacks.ts` — 7 style packs
- `lib/website-engine/sampleData.ts` — Sample data for demos
- `app/components/website-engine/WebsiteRenderer.tsx` — Section registry + renderer
- `app/components/website-engine/sections/` — 11 registered section components:
  - `HeroAnimated`, `ServicesShowcase`, `WhyChooseUs`, `AnimatedStats`
  - `GalleryMasonry`, `ReviewsCarousel`, `FAQAccordion`, `FinalCTA`
  - `FooterPremium`, `PressureWashRevealSection`, `CustomIceCreamHero`
- `app/website-preview/page.tsx` — Style pack demo with switcher

### Phase 2 — Business Profiles + Dynamic Previews (complete)
Business profile creation and management with localStorage storage and dynamic preview routes.

**Files:**
- `lib/business/types.ts` — `BusinessProfile`, `CustomModuleId` types
- `lib/business/storage.ts` — CRUD abstraction over localStorage (swap for Supabase later)
- `lib/business/profileToWebsiteConfig.ts` — Blueprint-driven profile → WebsiteConfig mapper
- `app/components/admin/BusinessSection.tsx` — Admin UI: profile list + create/edit form
- `app/website-preview/[businessId]/page.tsx` — Dynamic preview with style pack switcher

### Phase 2.6 — Industry Blueprint Layer (complete)
11 industry blueprints that give each business type a meaningfully different website structure, copy, and modules.

**Files:**
- `lib/business/blueprints/types.ts` — `IndustryBlueprint`, `BlueprintContent`, `PlannedSection`, `ExperimentalConcept`
- `lib/business/blueprints/registry.ts` — 11 complete blueprints
- `lib/business/blueprints/index.ts` — `getBlueprint(industry)` + `getBlueprintById(id)`

**Industries covered:**
1. Ice Cream / Food — CustomIceCreamHero, playful tone, "Our Flavors" sections, no quote CTA
2. Gym / Fitness Studio — motivational hero, "First class free" CTA, member stats
3. Personal Trainer — personal/relationship tone, free consultation CTA
4. Pressure Washing — PressureWashReveal animation, before/after stats, "Get My Free Quote" CTA
5. Landscaping — seasonal reliability tone, "The Lawn Your Neighbors Will Notice" hero
6. Barber / Salon — luxury-dark pack, portfolio gallery, "Book Appointment" CTA
7. Restaurant / Cafe — minimal sections, food-first, "View Our Menu" CTA
8. Roofing — insurance claim experience, "Protect What's Above You" hero
9. Painting — transformation tone, "Fresh Paint. Fresh Start." hero
10. HVAC / Plumbing — 24/7 emergency emphasis, "Fast Service. Licensed Techs." hero
11. Contractor / Handyman — universal fallback for unmatched industries

**Blueprint creative fields (metadata only, never rendered):**
- `activeSectionOrder` — sections rendered in order
- `plannedSections` — future sections (not built, not rendered)
- `optionalPremiumSections` — exists in registry, not in default order
- `experimentalConcepts` — creative/interactive section ideas
- `animationIdeas` — animation/interaction concepts
- `contentInputIdeas` — what business owner can provide (photos, menus, etc.)
- `designNotes` — visual direction guidance

### Phase 2.7 — Blueprint QA + Flexibility Polish (complete)
- Fixed hero headline templates (removed businessName from H1 for cleaner typography)
- Fixed pressure washing reveal heading ("See the Before & After" vs. long business name)
- Improved service icon lookup (60+ keyword-icon pairs, specific before broad)
- Added blueprint-aware service description generator (per-industry tone)
- Added Gym / Fitness Studio, Personal Trainer, Barber / Salon, Restaurant / Cafe to admin dropdown
- Verified build: 22/22 routes, 0 TypeScript errors

### Phase 3.3 — Connected Sales + Service Flow (complete, 2026-06-27)
End-to-end Lead → Customer → Website Profile → Quote → Job → Invoice flow. QA passed.

Bug fixed during QA: `premium-minimal` style pack missing from website-preview switcher. Fixed 16 `[Your City]` placeholders across 6 sample pages.

### Phase 3.4 — Website Builder Polish + Unified Creation Flow (complete, 2026-06-28)

**3.4a/c (2026-06-27):** Nav reorder — Website Builder above Clients; ContractVault labeled "Soon." Industry-aware fallback content: trust badges, gallery headings, reviews, and footer CTA now vary by blueprint. Added `reviewsDefaults` to 5 non-contractor blueprints. Industry-aware style pack auto-set on first selection in editor. Fixed Quote Form Notes placeholder copy. Barbershop sample page placeholder address fixed.

**3.4d.1 (2026-06-28):** Blueprint-aware style pack on Customer → Create Website Profile path. Blank city instead of address string. "Website Profiles" h2 + "+ New Profile" button label. "Client ↗" badge on customer-linked profile cards.

**3.4d.2 (2026-06-28):** Unified website profile creation flow. All three entry points (Customer panel, Copy Kit, manual) now share one editor:
- Customer → "+ Create Website Profile" opens prefilled editor instead of auto-saving a stub
- Copy Kit → "Start Website Profile →" seeds editor with name/industry/city/services/tagline (GeneratedCopy not stored as generatedContent — schemas differ)
- Preview toolbar: "← Profiles" returns to Website Profiles section, "Edit Profile" opens that profile's editor directly, "Copy Link" copies the preview URL
- BusinessSection on mount picks up pending draft or pending edit from sessionStorage automatically
- `customer_id` now preserved through profile edits (was silently dropped before)

**Files added in 3.4:**
- `lib/business/draftProfile.ts` — sessionStorage draft/pending-edit/nav-target bus with 10-min TTL

**Files changed in 3.4:**
- `app/admin/AdminApp.tsx`, `app/components/admin/BusinessSection.tsx`
- `app/website-preview/[businessId]/page.tsx`
- `lib/business/blueprints/registry.ts`, `lib/business/profileToWebsiteConfig.ts`
- `lib/website-engine/types.ts`
- `app/components/website-engine/sections/HeroAnimated.tsx`, `FooterPremium.tsx`

---

## 5. Current Stop Point

**Phase 3.4d.2 complete (2026-06-28). Phase 3.5 not yet started.**

Phase 3.4d.2 shipped as commit `6540db5`. Build passes: 22/22 routes, TypeScript clean.

Known open items (not blocking):
- Copy Kit → Website Profile: `GeneratedCopy` and `GeneratedWebsiteContent` schemas remain separate by design. The bridge is field-extraction only (name, industry, city, service titles, tagline). Full content migration not planned.
- Photographer industry: no blueprint exists; falls to contractor-handyman fallback.
- Mobile admin UI (post-login): not verified — requires live Supabase credentials.
- Invoice print route (`/admin/invoice/[id]`): auth-gated, not tested without credentials.
- Website Profile storage: still localStorage. Supabase migration remains a future item (Section 26).

Phase 3.3 QA summary (2026-06-27):
- Lead → Customer → Quote → Job → Invoice: ✅ full flow verified
- Customer → Website Profile → Preview/Edit: ✅ working
- 8 sample pages: ✅ render, 0 console errors
- Build: ✅ 22/22 routes, TypeScript clean

See Section 30 for the original Phase 3 spec.

---

## 6. Core Architecture

### Data Flow

```
Admin Form
  → BusinessProfile (localStorage)
  → getBlueprint(industry)
  → profileToWebsiteConfig(profile, blueprint)
  → WebsiteConfig { businessName, tagline, stylePack, sections[] }
  → WebsiteRenderer
  → Live website preview
```

### Adding a New Section

1. Define props interface in `lib/website-engine/types.ts`
2. Add to `SectionConfig` discriminated union
3. Create component in `app/components/website-engine/sections/`
4. Register in `WebsiteRenderer.tsx` REGISTRY
5. Add to blueprint `activeSectionOrder` entries as needed
6. Add `buildSection` case in `profileToWebsiteConfig.ts`

### Adding a New Blueprint

1. Add to `lib/business/blueprints/registry.ts` `BLUEPRINTS` array
2. Add matching alias strings for `getBlueprint()` lookup
3. Add industry to `INDUSTRIES` array in `BusinessSection.tsx`

### Admin Layout Scroll Rule

The admin container uses `overflow-hidden`. Every admin section MUST use `<div className="w-full h-full overflow-y-auto">` as its root element. Missing this = broken scroll.

### Storage Abstraction

`lib/business/storage.ts` — all reads/writes go through this file. To migrate from localStorage to Supabase, replace only this file.

---

## 7. Scrub Club Proof Model

`scrub-club-app` (separate CRA React repo at `/Users/grantdriskell/Documents/GitHub/scrub-club-app`) is the owner's actual cleaning business used as a proof-of-concept client.

- Quote form with RLS-safe Supabase RPC (`submit_quote`)
- Job status lookup (`get_job_status_by_ref` RPC)
- Owner dashboard: `OWNER_AUTH_BYPASS = true` — do NOT change
- Homepage: BeforeAfterSlider, marquee, stats counter, reviews carousel
- Opportunity engine console errors (`localhost:8081`) are cosmetic — local server not running

---

## 8. Industry Blueprint System

Each blueprint contains:
- `activeSectionOrder` — the sections currently rendered, in order
- `plannedSections` — future sections (metadata only, never rendered, never crash)
- `optionalPremiumSections` — exists in registry but not in default order
- `experimentalConcepts` — creative ideas not yet built
- `animationIdeas` — animation/interaction concepts
- `contentInputIdeas` — what the business owner can provide
- `designNotes` — visual direction beyond the style pack
- `recommendedStylePacks` — best pack(s) for this industry
- `recommendedCustomModules` — modules that auto-activate for this industry
- `content` — all copy templates with `{businessName}` `{city}` `{area}` `{industry}` placeholders
- `ctaStrategy`, `quoteOrBookingNeeds`, `menuOrPricingNeeds`, `aiPromptNotes` — future AI guidance

Fuzzy matching: `getBlueprint(industry)` does exact + substring + reverse-substring matching against `aliases[]`. Falls back to contractor/handyman for unknown industries.

---

## 9. Free-First AI Strategy

**Core rule: AI is an upgrade layer, not a dependency.**

The app must work fully when:
- No AI key exists
- AI provider is down
- Usage limit is reached
- Client is on a base plan
- Model fails
- JSON validation fails
- Client does not want AI

**Free path (always works):**
```
BusinessProfile → Blueprint → Fallback Generator → GeneratedContent → WebsiteRenderer
```

**Optional AI path (runs only when key exists and button is clicked):**
```
BusinessProfile → Blueprint → Server-side AI → Validate JSON → GeneratedContent → WebsiteRenderer
```

**Failure path:**
```
AI missing/fails/invalid → Blueprint fallback → GeneratedContent (source: "fallback") → WebsiteRenderer
```

---

## 10. Tiered AI Usage Model (Framework — Pricing TBD)

Do not hard-code pricing. Collect usage data first.

**Conceptual tiers (subject to change):**
- Base: Blueprint-only content generation (always free, deterministic)
- Growth: AI-enhanced content generation (limited AI calls/mo)
- Pro: Unlimited AI, multi-business, advanced modules

**Never:**
- Resell raw API tokens to clients
- Charge per AI request at API cost
- Lock the product behind AI availability

**Always:**
- Sell the packaged outcome (better website copy, better first impression)
- Fall back gracefully to blueprint content when AI is unavailable

---

## 11. Usage Tracking Before Pricing Rule

Before finalizing pricing tiers, track:
- Average AI calls per business per month
- Average Groq cost per generation event
- Which features actually get used (stats from admin usage)
- Which AI features convert clients to paid

Do not set per-tier AI limits until real usage data exists.

---

## 12. Future AI Provider / Router Plan

Current provider: Groq (llama-3.3-70b-versatile) — server-side only via `GROQ_API_KEY`.

Future provider architecture: provider-agnostic interface.

```
AI_PROVIDER=groq | openrouter | openai | anthropic | gemini
AI_MODEL=...
AI_API_KEY=...    # server-side only
```

**OpenRouter** is a potential future router for:
- Multi-model routing
- Per-client usage tracking at the router level
- Model fallback chains
- Usage billing at the router instead of individually per provider

Do not build full OpenRouter integration until it is clearly scoped and the API surface is stable. Keep architecture provider-friendly (single API call function, single prompt format).

---

## 13. Future BYO API Key Plan (Not Built Yet)

Some clients may want to use their own AI keys (own Groq/OpenAI account).

**Rules when built:**
- Keys stored encrypted in database (never localStorage, never env)
- Keys removable by the client at any time
- Keys never logged, never returned to frontend
- Server-side only — key is fetched server-side at generation time
- BYO key usage does not count against platform limits
- Display "Using your API key" in the UI when active

Do not build until: encryption-at-rest strategy is chosen, DB migration for profile storage is done.

---

## 14. Future Scan / Photo / Design Input Roadmap

The blueprint `contentInputIdeas` field captures what a business owner could provide to improve their site. Future implementation:

- **Photo upload:** Owner uploads real photos → replaces gradient placeholder tiles in GalleryMasonry
- **Menu scan:** OCR scan of a printed menu → auto-generates `MenuShowcase` section data
- **Logo upload:** Stored as `logoUrl` in BusinessProfile, surfaced in header/footer sections
- **Color extraction:** Extract brand color from uploaded logo → auto-sets `brandColor`
- **Style suggestion:** Photo of existing storefront → AI recommends style pack

Dependencies: File upload storage (Supabase Storage), OCR (future), AI Vision (future).

---

## 15. Future AI Vision / Quote Roadmap

Exploring a future where a field tech can photograph a property and get an instant quote range.

- Photo → AI estimates surface type and square footage → quote range
- Requires: AI Vision API (GPT-4 Vision or Gemini Vision), mobile-friendly admin, job queue
- Not scoped yet — needs prototype and accuracy testing first
- Risk: liability if estimate is wildly wrong; need disclaimer

---

## 16. Future Website Import / Rebuild Tool

When a client has an existing website and wants to migrate to the platform:

- Scrape/import existing site content (pages, services, reviews, contact info)
- Map to BusinessProfile fields + blueprint
- Admin reviews and approves the mapping
- Generate a website config from the imported data

Dependencies: web scraper (server-side), content parsing, admin approval flow.

---

## 17. Future Client Dashboard

A separate login portal for the client (business owner) to:
- Update their own business profile
- Request content changes
- View their website
- See basic analytics (page views, lead form submissions)
- Download invoices

Architecture: Supabase RLS, separate `/client` route tree, role-based access.

---

## 18. Future Premium Module Marketplace

A catalog of optional website sections that can be added to any blueprint:

- `ClassSchedule` — gym/fitness
- `MenuShowcase` — restaurant/ice cream
- `BookingCTA` — any appointment-based business
- `EmergencyCTA` — HVAC/plumbing/roofing
- `TransformationGallery` — gym/personal trainer
- `StaffProfiles` — salon/gym/restaurant
- `LoyaltyPunchCard` — ice cream/cafe

**Business model options (TBD):**
- Included in Pro tier
- One-time add-on purchase per module
- Monthly add-on per enabled module

Do not build checkout for this until pricing strategy is finalized.

---

## 19. Future Middleman / Add-On Service Layer

The platform could offer managed services where the owner's team handles things like:

- Ongoing content updates
- Review management
- Ad campaign management
- Monthly SEO updates
- Photo shoots (partner referral)

These are service products, not software products. Build the infrastructure to sell them (client dashboard + service request flow) only after the core SaaS is generating consistent revenue.

---

## 20. Future Storefront / Dropshipping / E-Commerce Connection Roadmap

Some business types will eventually need:
- Product catalog (for ice cream merch, gym supplements, etc.)
- Online ordering (for restaurants and food businesses)
- Shopify/WooCommerce embed or API connection
- Dropshipping partner connection for branded merchandise

This is a significant scope expansion. Build only when a specific paying client needs it and the use case is clearly defined. Do not design generically.

---

## 21. Quote / Job / Invoice Roadmap

Operations toolset for field service businesses:

- **Quote builder:** Line-item quotes, sent to client via link, accepted/rejected
- **Job tracking:** Jobs tied to quotes, status updates, field notes
- **Invoice generation:** Auto-invoiced from closed job, PDF export
- **Payment link:** Approved payment processor integration (future)

Current state: Invoice UI exists in admin (`/admin/invoice/[id]`) but is not wired to a database.

---

## 22. Finance / Accounting Roadmap

Future tools for business owners to understand their financial health:

- Job profit calculator (revenue - labor - materials - overhead)
- Monthly revenue summary
- Expense categories and tagging
- Tax liability estimates (display only — not tax advice)
- P&L report export

Do not call this "accounting software." Position as "business health" tools.

---

## 23. QuickBooks Integration Roadmap

Some clients will want to sync invoices and payments to QuickBooks Online.

- OAuth 2.0 connection to QBO API
- Sync invoices created on the platform to QBO
- Sync payments received to QBO
- Two-way customer sync (optional)

Dependencies: Approved payment integration (must come first), QBO developer account.

---

## 24. Contract / Agreement Roadmap

Simple digital agreements for project work:

- Pre-built contract templates per industry (pressure washing service agreement, painting scope of work, etc.)
- Client signs via link (email-based signature, not DocuSign)
- Stored as PDF + signature metadata
- Not a legal document generation service — use plain language templates + attorney review disclaimer

Do not build until invoicing and job tracking are live and generating usage.

---

## 25. Payment / Compliance Roadmap

**Payment rules:**
- Only collect payments through approved processors (Stripe, Square — future integration)
- Never store raw card numbers — PCI compliance non-negotiable
- Display payment as "collected through [Processor]" — platform is not the merchant for client's customers

**Compliance items before payment launch:**
- Privacy policy page (✗ not yet written)
- Terms of service page (✗ not yet written)
- SMS consent language in quote/lead forms
- Email unsubscribe mechanism
- Role-based permissions + audit log for payment-touching actions
- AI disclaimer on any AI-generated content shown to end users

---

## 26. Storage / Database Roadmap

**Current:** localStorage (business profiles only)
- Abstraction layer in `lib/business/storage.ts`
- Swap for Supabase by replacing only this file

**Migration plan:**
1. Create `business_profiles` table in Supabase with matching column names
2. Create `generated_website_content` table for AI/fallback generated content
3. Update `storage.ts` to use Supabase server client
4. Migrate existing localStorage data on first load (one-time)
5. Keep localStorage as offline cache after migration

**Tables planned (not yet created):**
- `business_profiles` — one row per client business
- `generated_website_content` — generated content tied to a profile
- `invoices` — invoice records
- `leads` — inbound leads from website forms
- `jobs` — job/project records

---

## 27. AI Usage Tracking Roadmap

Before billing AI usage, track it:

- `ai_generation_events` table: profile_id, provider, model, prompt_tokens, completion_tokens, cost_estimate, timestamp, outcome (success/fallback/error)
- Usage dashboard in admin: total AI calls this month, estimated cost, per-business breakdown
- Soft limits: warn at 80% of planned tier limit, hard limit at 100% → fallback silently

Do not build until: Supabase migration is live, pricing tiers are defined.

---

## 28. Security Rules

1. **Never expose API keys in frontend code** — no `NEXT_PUBLIC_GROQ_API_KEY`, no window.env injection
2. **Never store API keys in localStorage** — not even temporarily
3. **Never put secrets in README.md, PROJECT_STATE.md, GitHub, or screenshots**
4. **Server-side env variables only** — all AI calls go through Next.js API routes or Server Actions
5. **If a key was ever pasted into chat/logs/screenshots, rotate it** — treat it as compromised
6. **Future BYO API keys must be encrypted at rest** — not stored in plaintext, not returned to frontend
7. **Future BYO keys must be removable** — hard delete, not soft delete
8. **Supabase RLS must be enabled** on any table accessible from the client
9. **`OWNER_AUTH_BYPASS = true` in scrub-club-app** — do not change; it bypasses login UI only, not Supabase RLS
10. **AI-generated content shown to end users must include an AI disclaimer** — required before public launch

---

## 29. Claude / Codex / ChatGPT Workflow

When starting a new session:

1. Read `PROJECT_STATE.md` for current status and what not to build
2. Read the specific files relevant to the task (don't assume — read first)
3. Check `npm run build` output before any significant change
4. Make changes in the smallest possible increments
5. Run `npm run build` after every phase
6. Update `PROJECT_STATE.md` after completing a phase

**Pattern reminders:**
- Admin scroll: `<div className="w-full h-full overflow-y-auto">` on every admin section root
- Adding sections: types → component → REGISTRY → `buildSection` switch → blueprint
- Storage: all profile reads/writes through `lib/business/storage.ts` only
- AI calls: server-side only, via `/api/` routes, never from client components
- Style packs: 7 packs, IDs are type-safe `StylePackId`
- Industry matching: `getBlueprint(industry)` handles fuzzy matching + fallback

---

## 30. Next Phase: Phase 3 — Free-First AI Website Content Generator

**Goal:** Add generated website content to business profiles using a free-first system.

**Core requirements:**
- App must work with zero AI keys
- `GeneratedWebsiteContent` type added
- `BusinessProfile` extended with `generatedContent?` field
- Fallback generator: deterministic, uses profile + blueprint, always works
- Optional server-side AI generation: only if provider key exists
- API keys: server-side only, never exposed
- Validate AI JSON before saving
- "Generate Website Content" button in admin Websites section
- Save generated content to localStorage (storage abstraction)
- Show source: `fallback` | `groq` | etc.
- Show loading, success, error, and fallback states
- Do not call AI on page load — button-only
- Preview uses generated content if it exists, falls back to blueprint defaults
- All three preview routes (`/website-preview`, `/website-preview/[businessId]`) must still work
- `npm run build` must pass

**`GeneratedWebsiteContent` type fields:**
- `heroHeadline`, `heroSubheadline`, `heroCtaText`
- `services` — array with icon, title, description (overrides auto-generated)
- `whyChooseUs` — reasons array
- `stats` — stats array
- `faqs` — FAQ array
- `reviewPlaceholders` — placeholder review text
- `finalCtaHeadline`, `finalCtaText`
- `seoTitle`, `seoDescription`
- `recommendedStylePack`
- `recommendedCustomModules`
- `creativeConceptIdeas` — free-text ideas for future sections
- `plannedFutureModules` — module type IDs to explore
- `source` — `"fallback" | "groq" | "openrouter_future" | "platform_ai_future" | "byo_key_future"`
- `generatedAt` — ISO timestamp
- `provider` — string (provider name)
- `fallbackReason?` — why fallback was used if source is fallback

**Fallback generator strategy:**
- Use blueprint `content` as base
- Interpolate `{businessName}`, `{city}`, `{area}`, `{industry}` placeholders
- Use profile services if provided, else blueprint defaultServices
- Produce all required fields deterministically
- No randomness — same input always produces same output

**AI generation strategy:**
- Reuse or extend existing `/api/generate-copy` route
- New route: `/api/generate-website-content` — accepts `businessProfileId` in request body
- Server loads profile from storage (if DB) or client POSTs profile data
- Prompt uses blueprint `aiPromptNotes`, `ctaStrategy`, `content` templates as context
- Validate required fields in response before saving
- If validation fails → return fallback

**Rendering integration:**
- `profileToWebsiteConfig` accepts optional `generatedContent` param
- If `generatedContent` exists: use its fields to override blueprint defaults
- Missing generated fields → fall through to blueprint defaults (safe mix)

**UI in BusinessSection:**
- "Generate Website Content" button on each profile card
- Button state machine: idle → generating → success/error
- Show source badge on card after generation ("Blueprint" or "AI")
- Generated content badge shows when content exists

---

## 31. What Not to Build Yet

| Feature | Reason |
|---|---|
| Payments (Stripe/Square) | Compliance requirements not met |
| Contracts | Legal review needed |
| Tax automation | Regulatory complexity |
| QuickBooks integration | Requires payment integration first |
| MerchPilot / storefront | Scoped in Section 33 — roadmap only until payment compliance is ready |
| Full website importing | Requires scraper + approval flow |
| AI Vision / photo quoting | Requires prototyping and accuracy testing |
| Phone scan quoting | Requires mobile app or camera API |
| Full map measuring | Complex geospatial scope |
| BYO API key storage | Requires encryption-at-rest strategy + DB migration |
| Homepage redesign | Marketing is working, don't break it |
| Module marketplace checkout | Pricing strategy not finalized |
| Custom React code per client | Not scalable — engine pattern only |
| Hard-coded pricing | Usage data needed first |
| OpenRouter integration | Wait until scope is clear |
| Client dashboard | Admin product must mature first |
| Full CRM | Premature — leads/jobs first |
| AI on page load | Performance + cost risk |
| Automatic AI generation | Admin must trigger explicitly |

---

---

## 32. Extended Roadmap Notes (Future — Do Not Build Yet)

Items to track for future planning. None of these are scoped or in-flight.

### Ops & Field Tools
- **Crew management** — crew assignments, clock-in/clock-out per job
- **Auto scheduling by area** — group jobs by location to minimize drive time
- **Vehicle fuel/gas reminders** — mileage-based or schedule-based prompts
- **Equipment maintenance reminders** — based on logged hours (e.g., pump hours, blade hours)
- **Supply reorder reminders** — low-inventory alerts based on job volume; ask before ordering
- **WCR / window cleaning supply assistant** — reorder helper for specific supplies (WCR, Tucker, etc.)

### Lead Generation & Marketing
- **Local Lead Scout** — identify high-density lead areas by zip/neighborhood
- **High-traffic Google Maps marketing** — surface businesses in high-foot-traffic areas
- **Business radius search** — find potential customers within N miles of a job
- **Website quality scoring** — score competitor sites to surface upgrade opportunities
- **Local sports team marketing** — sponsor or co-market with local youth/rec sports teams
- **Surveys** — post-job satisfaction surveys for customers

### Legal & Finance
- **ContractVault** — template-based legal agreement workflow (NOT legal advice; owner must review)
- **Insurance links** — display and link relevant business insurance resources
- **Merch link / MerchPilot** — branded merchandise and storefront engine (see Section 33)

### Platform & AI Infrastructure
- **OpenRouter provider router** — route AI calls to cheapest/fastest provider per use case
- **AI agents / n8n-style automations** — multi-step AI workflows triggered by events
- **Credit rollover program** — unused AI credits roll to next billing period
- **AI outreach drafts** — AI pre-writes texts/emails for owner review; never auto-sends

### Business Intelligence
- **Canvassing analytics** — area performance tracking for door-knocking teams
- **Job profitability tracking** — revenue vs. time/supplies per job type
- **Seasonal trend insights** — which services spike in which months in which regions

---

## 33. MerchPilot / Storefront Engine (Roadmap Only — Do Not Build Yet)

**Status:** Roadmap only. Not scoped, not in development. Add to planning when storefront and payment compliance is ready.

### Concept

MerchPilot helps local businesses create and sell branded merchandise and products. It uses the business's existing profile data — logo, brand colors, slogans, services, approved photos, holidays, and local events — to recommend merch ideas. Canva can later assist with design/mockup creation, and storefront integrations can let businesses sell products directly from their website.

### Future Workflow

```
BusinessProfile
  → logo, brand colors, services, slogans, approved photos
  → AI merch idea generator
  → Canva design / template helper
  → owner approval gate
  → product mockup / export
  → optional storefront listing
  → optional print-on-demand or wholesale fulfillment
```

Every step requires explicit owner approval before anything is published, listed, or ordered.

### Merch / Product Types

- Shirts, hoodies, hats
- Stickers, yard signs, flyers
- Business cards, customer referral cards
- Gift cards
- Team uniforms
- Seasonal promo merch
- Service-specific products (e.g., maintenance plan cards, referral packs)
- Local sports sponsor merch

### Storefront Use Cases by Industry

| Industry | Potential products |
|---|---|
| Gym / fitness | Shirts, supplements, accessories |
| Barbershop | Hair products, branded merch |
| Restaurant / cafe | Merch, gift cards, local products |
| Pressure washing | Referral cards, maintenance plan cards, branded merch |
| Local retail | Products sold directly on website |
| Any service business | Branded items for team or customer giveaways |

### Future Integrations

| Integration | Purpose |
|---|---|
| Canva Connect API | Design templates, mockup creation, export |
| Shopify | Storefront, cart, checkout |
| Printful / Printify | Print-on-demand fulfillment |
| Stripe / Square payment links | Simpler early option before full cart |

### Rules

- AI recommends merch ideas — owner must approve before publishing anything
- Owner must approve designs before selling
- Owner must approve pricing before any product goes live
- Do not use copyrighted logos/images the business does not own
- Do not auto-purchase inventory
- Do not auto-send orders without explicit owner approval in early versions
- Ecommerce, taxes, shipping, refunds, and payment compliance must be scoped separately before storefront launches

### MVP Phases

| Phase | Scope |
|---|---|
| Phase 1 | Roadmap only (current) |
| Phase 2 | AI merch idea generator — inputs business profile, outputs idea list |
| Phase 3 | Canva template/mockup helper — links to Canva with pre-filled brand data |
| Phase 4 | Simple product/shop section on website — static display, contact to order |
| Phase 5 | Shopify or Printful/Printify integration — live cart and fulfillment |
| Phase 6 | Optional wholesaler / managed merch service |

---

*Last updated: Phase 3.4d.2 complete (2026-06-28). Unified website profile creation flow. Commit `6540db5`. Phase 3.5 not started.*

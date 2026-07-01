# AI Tasks

## Repo Rules

- Work only in `main-site` when the requested path is `/Users/grantdriskell/Desktop/projects/gadriskell1/main-site`.
- Do not inspect, edit, or infer from `scrub-club-app` unless the user explicitly switches repos.
- Before coding, run `pwd`, `git status --short`, and identify the repo in the response.
- Read `PROJECT_STATE.md` and `docs/phase-rules.md` before implementation work.
- Do not edit `PROJECT_STATE.md` unless the user asks for docs/status updates.

## Phase Status

- Phase 3.3 complete (2026-06-27) — Connected Sales + Service Flow, QA passed.
- Phase 3.4 complete (2026-06-28) — Website Builder polish + unified creation flow. Last commit: `6540db5`.
- Phase 3.5 complete (2026-06-28) — Generate Website Content flow confirmed present in repo via audit. No new commits required. Key files: `app/api/generate-website-content/route.ts`, `lib/business/contentGenerator.ts`, `BusinessSection.tsx` (generate button + source badge), `profileToWebsiteConfig.ts` (consumes generatedContent).
- Phase 3.6 Slice 1 complete (2026-06-28) — Generated content timestamp and reset-to-blueprint controls. Commit `27f2091`. File: `BusinessSection.tsx` only.
- Phase 3.6 Slice 2A complete (2026-06-28) — Staleness indicator. Commit `a5d6673`. File: `BusinessSection.tsx` only. Shows amber "Content may be outdated" badge when `profile.updatedAt` > `generatedContent.generatedAt`.
- Phase 3.6 complete. Parked (require explicit approval): content preview/read-only display on card, inline editing of generated content.
- Phase 3.7 Slices B+C+D complete (2026-06-28) — Business profile storage migrated from localStorage to Supabase. Commit `8bb8abb`. Files: `lib/business/storage.ts`, `BusinessSection.tsx`, `AdminApp.tsx`, `[businessId]/page.tsx`.
- Phase 3.7 Slice E complete (2026-06-28) — One-time localStorage → Supabase profile import. Commit `30418b8`. Files: `lib/business/storage.ts`, `BusinessSection.tsx`. `migrateLocalStorageProfiles()` runs on first admin Websites load; sets `bp_migrated` flag after all upserts succeed.
- Phase 3.7 runtime QA passed (2026-06-30) — Live Supabase project had a missing `business_profiles` table (causing 404s). Schema definition added to `supabase/schema-complete.sql` (commit `767d30f`) and applied via SQL Editor. No app code changed. All runtime QA scenarios passed (see PROJECT_STATE.md §5 for full QA checklist).
- Phase 3.7 UX cleanup complete (2026-06-30) — Seven fix commits, build passed (22/22 routes, 0 TypeScript errors) before each:
  - `68b0446`: admin section persists across hard refresh (sessionStorage); generated content timestamp shows date + time. Files: `AdminApp.tsx`, `BusinessSection.tsx`.
  - `e0df637`: customer-started Website Profile drafts persist across section navigation (peek-not-consume); saving returns to Customers. Files: `lib/business/draftProfile.ts`, `BusinessSection.tsx`, `AdminApp.tsx`.
  - `a9c143e`: typed unsaved changes in customer-started Website Profile form now persist across section navigation and hard refresh (form state written back to sessionStorage draft on every change). File: `BusinessSection.tsx`.
  - `54b47bb`: Customer detail page now correctly shows the linked Website Profile card. Root cause was a `customer_id` type mismatch (`text` string vs. `bigint` number) in the `linkedProfile` lookup, plus a missing loading state. File: `AdminApp.tsx`.
  - `4e6ea8a`: selected Customer context persists across admin reload (`admin_selected_customer` sessionStorage key); "Client ↗" badge in Website Profile list cards now navigates to the linked customer; saving a customer-linked profile (new or existing) returns to the customer. Files: `AdminApp.tsx`, `BusinessSection.tsx`.
  - `62e855d`: fixed selected customer lookup — `customers.find` was using strict `===` between a bigint number (`customers.id`) and a string (sessionStorage value), always failing. Fixed with `String()` normalization. File: `AdminApp.tsx`.
  - `d2ec080`: existing Website Profile edits now persist across reload via `wp_edit_draft` sessionStorage key. Three-priority mount effect (new draft → pending-edit signal → edit draft reload recovery). `editDraftForm` prop on `BusinessEditor` overlays draft fields on top of the saved record. Files: `lib/business/draftProfile.ts`, `BusinessSection.tsx`.

- Lead ↔ Customer navigation cleanup complete (2026-06-30) — Three commits, `app/admin/AdminApp.tsx` only, build passed (22/22 routes, 0 TypeScript errors) before each:
  - `af46b6f`: bidirectional Lead ↔ Customer navigation wired via `customers.lead_id`. `View customer ↗` in Lead detail; `Source lead: [name] ↗` in Customer detail.
  - `cb306b4`: `selectedLeadId` persists via `sessionStorage["admin_selected_lead"]` (same pattern as customer). Lead detail stays open after hard refresh. `Lead #[id]` / `Customer #[id]` labels added to detail headers. Lead list shows green `Customer ✓` chip when linked. `View customer ↗` always visible when customer exists (not gated on `status === "converted"`).
  - `34b55b0`: Removed "Create customer" button and amber banner from Lead detail per user preference. `handleCreateCustomer` function retained but not surfaced in UI.

## Current Approved Work

- Roadmap and documentation organization.
- Safe UI/form planning for the website-builder platform.
- Keeping the base website generator functional without AI keys.
- Blueprint/fallback content as the default generation path.

## Approved Safe First UI/Form Stack

- `shadcn/ui`
- `lucide-react`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `motion`

Install only when explicitly requested.

## Later With Care

- `21st.dev` individual blocks only. Do not import a full kit or redesign the whole app.

## Research Later

- Puck
- Vercel AI SDK
- dnd-kit
- Recharts

## Future Modules To Keep Roadmap-Only

- Legal Readiness Center
- Free Tools Engine
- SEO / AI Visibility Planner
- Visual Builder Lab
- AI provider/router architecture
- Client dashboard
- Marketplace/premium modules

## Phase 3.7 Slice E — Complete

Commit `30418b8`. `migrateLocalStorageProfiles()` added to `lib/business/storage.ts`. Runs on first admin Websites load; reads `localStorage["main_app_business_profiles"]`, upserts each profile to Supabase via `saveProfile`, sets `localStorage["bp_migrated"] = "true"`. localStorage data not deleted.

**Runtime QA verified (2026-06-30):** live Supabase table was missing; schema commit `767d30f` fixed it. All QA scenarios passed.

**Still parked (require separate approval before starting):**
- RLS policies (`owner_id` enforcement) — must be a separate approved security slice
- Service role client
- Preview page refactor
- Share token table
- `publicPreviewEnabled` field
- Public preview route
- Dropping localStorage reads entirely (future cleanup after `bp_migrated` is confirmed set)

**Known follow-ups (not blocking — require separate approval before acting):**
- Legacy localStorage import edge case: only relevant if old Scrub Club localStorage profile needs importing.
- `business_profiles` has no RLS/owner_id enforcement — not public-launch-ready.

*Fixed (commits `68b0446`, `e0df637`): admin section persistence; generated timestamp date+time; customer draft persistence; customer return navigation after save.*

*Lead ↔ Customer navigation cleanup complete (commits `af46b6f`, `cb306b4`, `34b55b0`, 2026-06-30). Next recommended code slice: Website Profiles organization/search UX. Following slices: admin date/time seconds formatting, phone validation/formatting, Save/Submit validation UX.*

## Forbidden For Now

- payments
- final pricing
- Stripe
- subscriptions
- real legal advice
- binding contracts
- e-signatures
- QuickBooks
- accounting/tax integrations
- marketplace checkout
- OpenRouter/provider routing
- BYO API key storage
- automatic AI API calls
- AI vision/photo quoting
- map measuring
- website importing
- dropshipping/storefront engine
- full auth rewrite
- database schema rewrite
- full app rewrite
- full visual builder replacement

## Default Claude/Codex Work Order

1. Confirm repo and phase.
2. List planned files before editing.
3. Keep changes small and reversible.
4. Prefer docs/roadmap updates before implementation if scope is unclear.
5. Run build only after code changes are approved and made.
6. Stop after completing the requested scope.

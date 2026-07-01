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

- Website Profiles organization/search UX complete (2026-07-01) — Single commit `d219199`, build passed (22/22 routes, 0 TypeScript errors) before commit. Files: `app/components/admin/BusinessSection.tsx`, `app/admin/AdminApp.tsx`.
  - `d219199`: Two-panel master/detail layout replacing card grid. Left panel: search (businessName/industry/city), sort (Newest/Recently Updated/Name A→Z/Industry), filter chips (All/Has Client/No Client/Generated/Stale), dynamic profile count, compact clickable rows with status badges. Right panel: full profile detail with all actions (Preview, Edit, Generate, Client link, Reset to blueprint, Delete). Customer names passed from AdminApp via `customers` prop (String normalization for bigint/text mismatch). Visual comfort cleanup: white panels, softer borders, neutral selected-row highlight, white-card customer block with purple left stripe, borderless timestamp block, bordered action buttons.

- Website Profile save actions / floating buttons UX complete (2026-07-01) — Single commit `52269bc`, build passed (22/22 routes, 0 TypeScript errors) before commit. File: `app/components/admin/BusinessSection.tsx` only.
  - `52269bc`: Added sticky footer action bar to `BusinessEditor`. Form wrapper changed to `<form className="w-full h-full flex flex-col">` with scrollable inner content region and a `flex-shrink: 0` footer bar. "Create Business Profile" / "Save Changes" and "Cancel" now stay visible at all times while editing or creating a Website Profile. "← Back to list" button given explicit `type="button"` to prevent accidental submit. Inner padding reduced from 80px to 24px. No business logic, validation, storage, draft, or submit handler changes. No AdminApp/Lead/Customer/schema/RLS/service role/share token/preview refactor/dependency/phone-validation/full-redesign changes.

- Phone formatting / validation (US MVP) complete (2026-07-01) — Two commits `dfb938c` and `0cad394`, build passed (22/22 routes, 0 TypeScript errors) before each commit. Files: `app/components/admin/BusinessSection.tsx`, `app/admin/AdminApp.tsx`, `app/admin/AdminDashboard.tsx`, `app/admin/invoice/[id]/InvoicePrint.tsx`, `app/components/website-engine/sections/FooterPremium.tsx`, `app/contact/page.tsx`.
  - `dfb938c`: Inline `digitsOnly`/`formatPhone`/`formatPhoneInput` helpers added (no dependencies). Website Profile phone input auto-formats and validates (blocks non-empty non-10-digit on save). Add Customer input gets `type="tel"` + auto-format. Lead/customer/admin/invoice/footer display uses `formatPhone` (falls back to raw string for non-10-digit values). No schema/API/storage/type changes.
  - `0cad394`: Public contact form phone input wired to `formatPhoneInput`; `app/api/contact/route.ts` unchanged. Lead detail "Create customer from lead" button restored using existing `onCreateCustomer` prop and handler (no new logic or DB columns).

- Phase 3.7 QA bug fix — Website Profile edit context (2026-07-01) — Single commit `8471d79`, build passed (22/22 routes, 0 TypeScript errors) before commit. File: `app/components/admin/BusinessSection.tsx` only.
  - `8471d79`: Added `editFromCustomer: boolean` state. Set `true` only in Path A (customer-launched create draft with `customer_id`) and Path B (pending-edit signal from Customer detail "Edit" button). Set `false` in `openEdit()` (profiles list), `openCreate()` (manual), and Path C (reload recovery). `handleSaved()` now gates customer navigation on `editFromCustomer` — edits opened from Website Profiles list/detail stay in Website Profiles on save. No AdminApp/Lead/schema/RLS/service role/share token/preview refactor/dependency/phone/full-redesign changes.

- Phase 3.7 QA bug fix — Lead Create Customer double-click guard (2026-07-01) — Single commit `1ed1fd7`, build passed (22/22 routes, 0 TypeScript errors) before commit. File: `app/admin/AdminApp.tsx` only.
  - `1ed1fd7`: Added `creatingCustomer` boolean state to `LeadsSection`. `handleCreateCustomer` now guards against re-entry (`if (!selected || creatingCustomer) return`), sets the flag `true` before awaiting, and resets it in `finally`. `creatingCustomer` passed to `LeadDetail` as a prop; button disabled and shows "Creating…" while active. No business logic, navigation, DB call, schema, RLS, service role, share token, preview refactor, dependency, API, storage, type, phone, Website Profiles, or full redesign changes. Phase 3.7 admin QA bug-fix batch is now clean.

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

*Website Profiles organization/search UX complete (commit `d219199`, 2026-07-01). Next recommended code slice: floating buttons / Save-Submit UX. Following slice: phone number validation/formatting.*

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

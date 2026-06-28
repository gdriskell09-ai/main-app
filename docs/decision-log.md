# Decision Log

## 2026-06-28: Phase 3.7 Slice E — One-Time localStorage Profile Import

Commit `30418b8`. Files: `lib/business/storage.ts`, `app/components/admin/BusinessSection.tsx`.

Added `migrateLocalStorageProfiles()` to `storage.ts`. Called on admin Websites mount (via async IIFE in `useEffect`) before `getAllProfiles()`. Reads `localStorage["main_app_business_profiles"]`; if `bp_migrated === "true"` or no valid array data, returns immediately. Otherwise upserts each profile to Supabase via `saveProfile()` and sets `bp_migrated = "true"` only after all succeed. On any upsert error the flag stays unset and the import retries on next load.

Key decisions:
- **Retry-on-failure** — flag set only after full success; upsert is idempotent so retrying the full set is safe.
- **localStorage not deleted** — data preserved until a future cleanup slice is approved.
- **`bp_` IDs preserved** — same IDs written to Supabase; no preview URL breakage.
- **`generatedContent` preserved** — carried through `saveProfile`, mapped to `generated_content JSONB`.
- **Known staleness side-effect** — `toRow()` stamps `updated_at: now` on every save, so migrated profiles with pre-existing `generatedContent` may show the amber staleness badge. Content itself is intact; badge clears on next regeneration.
- No RLS policies. No service role client. No share tokens. No preview route refactor. No owner_id enforcement. No schema changes.
- Build: 22/22 routes, 0 TypeScript errors.

## 2026-06-28: Phase 3.7 Slices B+C+D — Business Profile Supabase Storage Migration

Commit `8bb8abb`. Files: `lib/business/storage.ts`, `app/components/admin/BusinessSection.tsx`, `app/admin/AdminApp.tsx`, `app/website-preview/[businessId]/page.tsx`.

`storage.ts` fully rewritten with async Supabase calls (`getAllProfiles`, `getProfile`, `saveProfile`, `deleteProfile`). `createId()` stays synchronous. All callers updated to `await` storage functions. Build: 22/22 routes, 0 TypeScript errors.

Key decisions:
- **One atomic PR** — all four files changed together; TypeScript would not compile with partial async/sync mismatches.
- **`bp_` IDs as TEXT PK** — `createId()` unchanged; IDs generated in the app and passed to Supabase, preserving all existing preview URLs.
- **`generatedContent` as inline JSONB** — stored as `generated_content` column; no separate table.
- **`updated_at` stamped in app layer** — `toRow()` sets `updated_at: now` on every save; no DB trigger required. The returned upserted row carries the timestamp back to callers, keeping the staleness indicator accurate.
- **`owner_id` not enforced** — column exists in DB as nullable TEXT; no RLS policy added. Enforcement is a follow-on slice after Slice E.
- **No dual-write** — localStorage reads dropped entirely; Supabase is the single source of truth.
- **Slice E not yet started** — existing localStorage profiles are invisible until a one-time import step (`localStorage["main_app_business_profiles"]` → Supabase upsert → set `bp_migrated` flag) is approved and built.

## 2026-06-28: Phase 3.6 Slice 2A — Generated Content Staleness Indicator

Commit `a5d6673`. File: `app/components/admin/BusinessSection.tsx` only.

Added a `isStale` boolean in the profile card map callback. A profile is stale when `p.updatedAt` and `p.generatedContent.generatedAt` both exist and `p.updatedAt > p.generatedContent.generatedAt`. When true, a subtle amber "Content may be outdated" badge renders next to the existing "Generated [date]" timestamp.

Key decisions:
- **Date-comparison only** — no new fields added to `BusinessProfile` or `GeneratedWebsiteContent`. Both timestamps were already present.
- **Display-only** — badge informs the admin; it does not block preview, trigger regeneration, or reset content.
- **Content preview and inline editing remain parked** — showing generated copy on the card or allowing inline edits is a separate slice requiring explicit approval.
- No storage, API, schema, RLS, or preview route changes. Build: 22/22 routes, 0 TypeScript errors.

## 2026-06-28: Preview/RLS Strategy — Future Direction Established (No Code Written)

Read-only audit of the `/website-preview/[businessId]` page and Supabase client setup. No implementation approved.

**Current state:**
- `/website-preview/[businessId]` is a `"use client"` page reading from localStorage. No auth check. No Supabase involved.
- App already exposes "Open Preview ↗" and "Copy Link" — sharing intent is clear.
- Profile IDs use `bp_${Date.now()}_${random6}` — timestamp-guessable prefix, not cryptographically safe for open public reads.

**Decisions recorded (future direction, not yet implemented):**
- **Admin operations:** When profiles move to Supabase, all admin reads/writes must use strict `owner_id = auth.uid()` RLS. No exceptions.
- **Public preview is a separate approved slice.** Do not conflate the storage migration with the public sharing architecture. They are independent slices.
- **Anonymous Supabase reads by profile ID are rejected.** The `bp_` format is timestamp-guessable. Business profiles contain real contact info. Do not write an RLS policy that allows unauthenticated `SELECT` by ID.
- **Server-side fetch/service role is the future controlled path** — allowed only via a server-side route under full application control, not a raw Supabase query from the browser. This approach must be gated: a `public_preview_enabled` flag on the profile and/or an unguessable share token/public slug must accompany any public server-side read, so not every profile ID is publicly renderable by default.
- **Share tokens and publish flags are a later slice.** Do not design or build them now.
- **No implementation approved:** No service role client, no RLS policy, no preview page refactor, no share token table, no `publicPreviewEnabled` field. All parked until storage migration lands and a separate preview-publishing slice is scoped and approved.

**What unblocks the storage migration:**
The preview/RLS question no longer requires a single resolved architecture before migration can proceed. The storage migration (async `storage.ts` + caller changes) can be approved and scoped independently. The public preview architecture is a follow-on slice.

## 2026-06-28: Business Profile Storage — Migration Impact Audit (No Code Written)

Read-only audit confirmed that migrating `lib/business/storage.ts` from localStorage to Supabase cannot be done by editing `storage.ts` alone.

Key findings:
- All five exported functions (`getAllProfiles`, `getProfile`, `saveProfile`, `deleteProfile`, `createId`) are **synchronous**. Supabase calls are async.
- `saveProfile` returns `BusinessProfile` synchronously; callers use the return value immediately to update React state. An async version propagates `await` into callers.
- Three files beyond `storage.ts` require changes: `app/components/admin/BusinessSection.tsx` (8 call sites — `handleDelete`, `handleClear`, `handleSubmit` must become `async`), `app/admin/AdminApp.tsx` (1 call site in a `useEffect`), `app/website-preview/[businessId]/page.tsx` (1 call site in a `useCallback`).

Key decisions recorded:
- **Do not approve a "storage.ts-only" migration.** The claim in Section 26 of `PROJECT_STATE.md` ("Swap for Supabase by replacing only this file") was aspirational — the audit proves it is incorrect. Future agents must not act on it.
- **`bp_` profile ID format preserved.** Switching to UUIDs would break all existing `/website-preview/bp_...` URLs. Keep `bp_${timestamp}_${random}` as the Supabase text PK.
- **`generatedContent` stays inline.** Store as a JSONB column in `business_profiles` rather than a separate `generated_website_content` table for the first migration. Separate table is a later optimization.
- **Dual-write (localStorage + Supabase background sync) not recommended.** Creates two sources of truth and is harder to unwind than a clean async migration.
- **Preview/RLS strategy unresolved.** Public shareable preview links (`/website-preview/bp_...`) break under strict `owner_id = auth.uid()` RLS — unauthenticated users see "not found." Three approaches under consideration: server-side fetch with service role key (cleanest), share token, or admin-only previews. Must be decided before migration is approved.
- **Migration parked.** No schema changes, no migration code, no `storage.ts` edits until the preview/RLS question is resolved and the async caller changes are explicitly scoped and approved.

## 2026-06-28: Phase 3.6 Slice 1 — Generated Content Timestamp + Reset Controls

Commit `27f2091`. File: `app/components/admin/BusinessSection.tsx` only.

Added to website profile cards when `generatedContent` exists:
- "Generated [date]" timestamp using `generatedContent.generatedAt`
- "Reset to blueprint" button with two-step confirm (matches existing delete confirm pattern)
- Confirm calls `saveProfile({ ...p, generatedContent: undefined })` through existing storage abstraction and resets generate button to idle

Key decisions:
- **Confirm step required** — clearing generated content is irreversible (no undo); two-step confirm prevents accidental clears.
- **Storage via saveProfile only** — no direct localStorage access; consistent with the existing abstraction rule.
- **Staleness indicator deferred** — defining "stale" requires deciding which profile field changes actually invalidate copy (services, industry, city, description — not style pack). Deferred to Phase 3.6 Slice 2 after explicit approval.
- **Content preview deferred** — showing generated copy on the card risks scope creep toward inline editing. Parked as a separate slice.

## 2026-06-28: Phase 3.5 — Generate Website Content (confirmed complete via audit)

Phase 3.5 was confirmed complete via a read-only audit on 2026-06-28. No new code was written. All three layers were already present in the repo:

- `app/api/generate-website-content/route.ts` — POST handler, Groq generation, shape validation, fallback-on-error.
- `lib/business/contentGenerator.ts` — `generateFallbackContent()` — deterministic blueprint-driven fallback, no AI dependency.
- `app/components/admin/BusinessSection.tsx` — per-profile generate button with idle/generating/success/error state machine, saves via `saveProfile`, source badge ("Blueprint" / "AI Content").
- `lib/business/profileToWebsiteConfig.ts` — already reads `profile.generatedContent` and applies it to all rendered sections.

Key decision recorded: **audit before duplicating**. Two Slice 1 attempts produced files (`fallbackGenerator.ts`, planned API route) that would have been exact duplicates of existing code. The audit approach discovered this before any redundant code was committed.

Phase 3.6 is not started and requires explicit approval.

## 2026-06-28: Phase 3.4d.2 — Unified Website Profile Creation Flow

Three previously disconnected entry points (Customer panel, Copy Kit, manual "+ New Profile") now share one editor via a sessionStorage draft bus (`lib/business/draftProfile.ts`). No profile is saved until the user explicitly clicks Save in the editor.

Key decisions:
- **sessionStorage over props/URL** — AdminApp uses `setSection()` client-side state, not URL routing. sessionStorage was the only message bus that survives a section switch without touching the `nav()` interface or adding URL param handling.
- **10-minute TTL on drafts** — stale drafts (tab left open, abandoned flow) are silently discarded. Prevents ghost drafts from surfacing in unrelated future sessions.
- **Field-extraction only from Copy Kit** — `GeneratedCopy` and `GeneratedWebsiteContent` are intentionally separate schemas. The bridge extracts only safe intake fields (businessName, industry, city, service titles, tagline). The full `GeneratedCopy` object is never stored as `profile.generatedContent`.
- **Draft takes priority over pending edit** — if both exist in sessionStorage simultaneously (edge case), the draft (new profile creation) wins. Both are consumed and cleared immediately on BusinessSection mount.
- **`customer_id` bug fixed** — editing an existing customer-linked profile was silently dropping `customer_id` from the form state, severing the soft-link. Fixed by explicitly including it in the editor's form initialization for existing profiles.

## 2026-06-26: Phase 3.3 First Pass Complete — QA Pending

Phase 3.3 (Connected Sales + Service Flow) first pass is complete. Work included: customer type badges, smart suggestions, website profile linking, and quote/job/invoice flow improvements. Phase 3.3 QA has not yet been run; do not mark Phase 3.3 fully complete until QA is done.

This entry corrects a phase-state gap: an earlier docs-only session lacked visibility into Phase 3.3 and left PROJECT_STATE.md with conflicting phase notes (Section 0 said "needs verification," Section 5 said "Phase 2.7 complete / Phase 3 next," footer said "Phase 3 + Phase 3.2 complete"). All three have been resolved to the current state above.

## 2026-06-26: Repo Separation Is Mandatory

`main-site` and `scrub-club-app` are separate apps. Future agents must identify the repo before coding and must not transfer assumptions between them.

## 2026-06-26: Base Builder Must Work Without AI

The white-label website builder must function with zero AI keys. Blueprint/fallback generation is the default path. AI is optional, server-side, and button-triggered only.

## 2026-06-26: Phase Must Be Verified Before Work

Existing docs contain conflicting phase notes. Agents must verify the active phase before implementation and avoid assuming that roadmap notes are approved work.

## 2026-06-26: Safe First UI/Form Stack

Approved first stack, when installation is explicitly requested:

- shadcn/ui
- lucide-react
- react-hook-form
- zod
- @hookform/resolvers
- motion

## 2026-06-26: Future Tool Decisions

- 21st.dev may be used later for individual blocks only.
- Puck, Vercel AI SDK, dnd-kit, and Recharts remain research/later.

## 2026-06-26: Forbidden Scope

Payments, final pricing, Stripe, subscriptions, legal advice/contracts/e-signatures, QuickBooks, accounting/tax integrations, marketplace checkout, OpenRouter/provider routing, BYO API key storage, automatic AI calls, AI vision/photo quoting, map measuring, website importing, dropshipping/storefront engine, full auth/schema/app rewrites, and full visual builder replacement are not approved now.

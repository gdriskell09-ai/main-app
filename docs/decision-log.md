# Decision Log

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

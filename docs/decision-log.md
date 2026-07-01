# Decision Log

## 2026-07-01: Lead Create Customer Double-Click Guard (commit `1ed1fd7`)

Commit `1ed1fd7`. File changed: `app/admin/AdminApp.tsx` only. Build: 22/22 routes, 0 TypeScript errors before commit. Working tree clean after push. No schema, RLS, service role, share tokens, preview refactor, dependencies, API, storage, type, phone, Website Profiles, or full redesign changes.

### Problem

Phase 3.7 QA identified that the "Create customer from lead" button in `LeadDetail` had no loading/disabled guard. The async `handleCreateCustomer` call in `LeadsSection` could be triggered multiple times by rapid clicking before the first call completed.

### Fix: `creatingCustomer` state guard

Added `creatingCustomer: boolean` state to `LeadsSection`. `handleCreateCustomer` now:
- Returns early if `!selected || creatingCustomer` (prevents re-entry while in-flight).
- Sets `creatingCustomer(true)` before `await onCreateCustomer(selected)`.
- Resets `creatingCustomer(false)` in `finally` (covers both success and error paths).

`creatingCustomer` is passed to `LeadDetail` as a new prop (added to the component's props interface). The "Create customer from lead" button is `disabled={creatingCustomer}` and shows `"Creating…"` while active, with `disabled:opacity-50 disabled:cursor-not-allowed` classes for visual feedback.

### Behavior unchanged

Lead → Customer creation/link/navigation behavior is otherwise unchanged. `handleCreateCustomer` in `AdminApp` (the Supabase insert, lead linking, and navigation) is untouched. No new DB columns.

## 2026-07-01: Website Profile Edit Context Bug Fix (commit `8471d79`)

Commit `8471d79`. File changed: `app/components/admin/BusinessSection.tsx` only. Build: 22/22 routes, 0 TypeScript errors before commit. No schema, RLS, service role, share tokens, preview refactor, dependencies, API, storage, type, phone, AdminApp, or full-redesign changes.

### Bug

Editing a customer-linked Website Profile from the Website Profiles list/detail panel navigated to the Customers section after save. Only profiles opened from a Customer context should return there.

### Root cause

`handleSaved()` read `editing?.customer_id` to decide whether to navigate back to a customer. Because any customer-linked profile carries a `customer_id` field, even profiles opened via `openEdit()` from the profiles list triggered customer navigation.

### Fix: `editFromCustomer` state flag

Added `editFromCustomer: boolean` state to `BusinessSection`. The flag is `true` only when the editor was opened from a Customer context:

- **Path A** (new-profile draft with `customer_id`): set `true` in mount effect.
- **Path B** (pending-edit signal from Customer "Edit" button): set `true` in mount effect.
- **`openEdit()`** (profiles list/detail panel "Edit Profile"): set `false`.
- **`openCreate()`** (manual create from profiles list): set `false`.
- **Path C** (reload recovery of an edit-in-progress): set `false` — customer context is irrecoverable on reload; staying in Website Profiles is the safe default.

`handleSaved()` now reads `editFromCustomer` instead of the raw `customer_id` field to decide navigation.

### Behavior after fix

| How editor was opened | Save navigates to |
|---|---|
| Customer → Create/Edit Website Profile | Customer detail |
| Website Profiles list "Edit Profile" | Website Profiles list |
| Website Profiles list "Create" | Website Profiles list |
| Reload recovery (any) | Website Profiles list |

### Known remaining gap

"Create customer from lead" button in `LeadDetail` has no double-click guard. Pre-existing; not introduced by this or any recent slice. Low priority — requires separate approval.

## 2026-07-01: Phone Formatting / Validation — US MVP (commits `dfb938c`, `0cad394`)

Commits `dfb938c` and `0cad394`. Files changed: `BusinessSection.tsx`, `AdminApp.tsx`, `AdminDashboard.tsx`, `InvoicePrint.tsx`, `FooterPremium.tsx`, `app/contact/page.tsx`. Build: 22/22 routes, 0 TypeScript errors before each commit. No schema, RLS, service role, share tokens, preview refactor, dependencies, API route, storage, type, or country-code changes.

### Why inline helpers instead of a shared utility module

Adding a shared `lib/utils/phone.ts` would require importing it in five different file locations — two of which (`FooterPremium.tsx`, `InvoicePrint.tsx`) are in separate route trees that should stay independent. Duplicating the three small helpers (total ~15 lines) inline in each file avoids a new module dependency and keeps each file self-contained. If the helpers grow or diverge later, consolidating to a shared module is a straightforward refactor.

### formatPhone fallback behavior

`formatPhone` returns the original string unchanged if digit count ≠ 10. This means:
- Existing Supabase records with any format (`"555-555-5555"`, `"5551234567"`, `"(555) 555-5555"`, international numbers) continue to display as-is rather than going blank.
- The MVP is US-only; no `+1` prefix handling. If a stored value starts with `+1`, stripping non-digits gives 11 digits, which fails the `=== 10` check and falls back to raw display.

### Website Profile validation scope

Soft validation only — blocks save when phone is non-empty and digit count ≠ 10. Empty phone is always allowed (field is optional). Existing saved profiles with odd phone formats are not affected (they are read-only display).

### Public contact form: no server-side change

`app/api/contact/route.ts` is unchanged. Phone is optional and stored as `phone?.trim() || null`. The formatter runs client-side only — a user who pastes an international number or bypasses JS still gets their raw value stored, which displays as-is in the admin via the `formatPhone` fallback.

### Lead → Create Customer restored

`34b55b0` had removed the "Create customer" button from `LeadDetail` per user preference at the time. The user later confirmed they want it back. Restoration was one JSX block: when `!hasCustomer`, show "No customer record yet." banner with "Create customer from lead" button. The underlying `onCreateCustomer` prop and `handleCreateCustomer` function (which inserts to `customers` table and navigates to the new customer) were never removed — only the UI entry point was absent.

## 2026-07-01: Website Profile Save Actions — Sticky Footer (commit `52269bc`)

Commit `52269bc`. File changed: `app/components/admin/BusinessSection.tsx` only. Build: 22/22 routes, 0 TypeScript errors before commit. Working tree clean after push. No schema, RLS, service role, share tokens, preview refactor, dependencies, AdminApp, Lead/Customer, phone validation, or full redesign work.

### Problem

The `BusinessEditor` form is long — name, industry, city, phone, services, tagline, style pack, and modules. On a standard screen the primary action buttons ("Create Business Profile" / "Save Changes" and "Cancel") were only reachable by scrolling to the very bottom. An admin user editing a profile had no persistent indication of where to submit.

### Solution: scrollable content + sticky footer

The outer wrapper was changed from `<div className="w-full h-full overflow-y-auto">` to `<form className="w-full h-full flex flex-col" onSubmit={handleSubmit}>`. A scrollable inner region (`flex: 1; overflow-y: auto`) wraps the form fields. A non-scrolling footer bar (`flex-shrink: 0; border-top; background: #ffffff; padding: 14px 20px`) sits at the bottom of the flex column and always stays in view.

Key decisions:
- **Form element becomes the flex container** — the `<form>` replaces the outer `<div>` so submit still triggers on enter and button `type="submit"` still works. Eliminates the nested `<form>` that existed before.
- **"← Back to list" button gets `type="button"`** — it was inside the form but not a submit button; without the attribute it would default to `type="submit"` in some browsers. Explicit `type="button"` prevents accidental form submission on back-click.
- **Bottom padding reduced from 80px to 24px** — the 80px was a hack to clear a fixed-bottom bar that didn't exist. Now that the footer is a flex sibling (not `position: fixed`), 24px normal padding is sufficient.
- **Cancel button style updated to bordered white** — `background: #ffffff; border: 1px solid #e8edf2` instead of the old `background: #f1f5f9; border: none`. Visually lighter in the sticky bar, still clearly distinct from the dark submit button.
- **No logic changes** — `handleSubmit`, `validate`, `onSaved`, `onCancel`, draft persistence, and all storage calls are untouched.

## 2026-07-01: Website Profiles Organization/Search UX

Commit `d219199`. Files changed: `app/components/admin/BusinessSection.tsx`, `app/admin/AdminApp.tsx`. Build: 22/22 routes, 0 TypeScript errors before commit. No schema, RLS, service role, share tokens, preview refactor, or new dependencies. Working tree clean after push.

### Layout: two-panel master/detail replacing card grid

The card grid gave every profile full expanded state by default — generate button, timestamps, action buttons, and all badges visible at once. With multiple profiles this became visually dense with no hierarchy. The two-panel pattern (same as Leads/Customers) makes browsing feel natural: left panel list to select, right panel to act.

Key decisions:
- **Left panel fixed at 272px, right panel flex-1** — sufficient for compact profile rows on the left; right panel gets all remaining width for detail content. Collapses to vertical stack at ≤640px (left capped at 300px max-height, independently scrollable).
- **`selectedProfileId` state (not sessionStorage)** — unlike `selectedLeadId` and `selectedCustomerId`, the selected profile ID is not persisted. The left list is always visible after reload; re-selection takes one click. No meaningful UX loss. Keeping sessionStorage surface area minimal.
- **Derive `selectedProfile` from `profiles` (not `displayed`)** — the right detail panel shows the selected profile even if search/filter removes it from the left list. This avoids a confusing "detail disappears when you type in search" UX. The left panel simply won't highlight a row that is filtered out.
- **Toggle on click** — clicking the selected row again deselects (sets `selectedProfileId` to null). Right panel returns to "Select a profile" placeholder.
- **On delete, clear `selectedProfileId`** — `handleDelete` already updated `profiles` state via `load()`; the `selectedProfileId` clear is added so the right panel doesn't attempt to render a deleted profile's data.

### Search / filter / sort

All three live in the left panel header area (visible whenever `profiles.length > 0`). The `displayed` array is computed from `profiles` using all three in sequence — filter by search term, then filter by `activeFilter` chip, then sort. `isFiltered` flag drives the header count text.

- **Search fields:** `businessName`, `industry`, `city` — case-insensitive substring match. City is `p.city ?? ""` to avoid null comparisons.
- **Filter chips:** `all | has-client | no-client | generated | stale`. Staleness re-checked inline using the same `new Date(p.updatedAt) > new Date(p.generatedContent.generatedAt)` predicate as the detail panel badge.
- **Sort options:** `newest` (by `createdAt` desc), `updated` (by `updatedAt` desc), `name` (locale `a.businessName.localeCompare(b.businessName)`), `industry` (locale compare).

### Customer names on profile cards

Previously the "Client ↗" badge showed only when `p.customer_id` existed, with no name. `AdminApp` already holds the full `customers` array in state. The fix: pass `customers={customers.map(c => ({ id: c.id, name: c.name }))}` to `<BusinessSection>`. Inside the component, look up with `customers.find(c => String(c.id) === p.customer_id)?.name`. The `String()` normalization on `c.id` is the same bigint/text cross-type fix established in commits `54b47bb` and `62e855d`.

### Visual comfort cleanup

The original two-panel iteration used `#fafafa` for the left panel background and `#f0f9ff` (blue-tinted) for selected rows, creating a "gray/bone soup" appearance. Changes:
- Left panel: `#ffffff` white.
- Panel divider: `1px solid #e8edf2` (from `1.5px solid #e2e8f0`).
- Internal section dividers: `1px solid #f1f5f9` (very faint).
- Selected row: `#f8fafc` (neutral light, no hue).
- Linked customer block: white card with `border-left: 3px solid #7c3aed` accent (was `#f5f3ff` purple-tinted fill). Button changed from solid purple to `#f5f3ff` bg / `#6d28d9` text / `#ddd6fe` border.
- Generated timestamp block: no box; just `border-top: 1px solid #f1f5f9` separator.
- Generate / Edit Profile buttons: `#ffffff` bg with `1px solid #e8edf2` border (was flat gray slabs, no border).
- Delete button: `#ffffff` bg with `1px solid #fecdd3` border (was `#fff1f2` red-tinted fill).

## 2026-06-30: Lead ↔ Customer Navigation Cleanup

Commits `af46b6f`, `cb306b4`, `34b55b0`. Only file changed: `app/admin/AdminApp.tsx`. Build: 22/22 routes, 0 TypeScript errors before each commit. No schema, RLS, service role, share tokens, preview refactor, or new dependencies.

### `af46b6f` — Bidirectional Lead ↔ Customer navigation

Used existing `customers.lead_id` foreign key and `leads.id` to wire two-way navigation:

- **`View customer ↗` in `LeadDetail`:** `LeadsSection` already computed `leadIdSet` and `linkedCustomer`; wired `onViewCustomer` callback to `() => onNavigateToCustomer(String(linkedCustomer.id))`. `AdminApp` passes `(id) => { setSelectedCustomerId(id); setSection("customers"); }`.
- **`Source lead: [name] ↗` in `CustomerDetail`:** reads `customer.lead_id`, looks up `leads.find((l) => l.id === customer.lead_id)`, renders a button that calls `onNavigateToLead(linkedLead.id)`. `AdminApp` passes `(id) => { setSelectedLeadId(id); setSection("leads"); }`.
- No new DB columns. `customers.lead_id` was already populated by `handleCreateCustomer`.

### `cb306b4` — Persist lead context + clarify linked records

- **`selectedLeadId` sessionStorage persistence:** `useState` lazy initializer reads `sessionStorage["admin_selected_lead"]`; a `useEffect` writes `String(selectedLeadId)` on every change and removes the key when null. Identical pattern to `selectedCustomerId` / `admin_selected_customer`. Lead detail panel now survives hard refresh.
- **`Lead #[id]` / `Customer #[id]` labels:** added as `<p className="text-xs text-slate-400">` below the name/business in each detail header. Helps admin correlate UI records to Supabase rows.
- **`Customer ✓` chip on lead list rows:** `leadIdSet.has(lead.id)` renders a small green badge in the tags row. Converts lead list into a visual CRM — no click, display only.
- **`View customer ↗` always visible when linked:** changed condition from `lead.status === "converted"` to `hasCustomer`. A lead with a linked customer shows the green "✓ Customer record linked." banner regardless of its current status. The amber "Converted — create a customer record" banner is still gated on `status === "converted" && !hasCustomer`.

### `34b55b0` — Remove "Create customer" from Lead UI

- Removed the `{!hasCustomer && lead.status === "converted" && ...}` amber banner and "Create customer" button from `LeadDetail`.

Key decision: **single entry point for customer creation.** Creating customers directly from a Lead detail created a secondary, less-discoverable flow alongside the Customers section's `+ New` form. Removing it simplifies the Lead panel to a read/navigate surface. The `handleCreateCustomer` function and `onCreateCustomer` prop are retained in code but not rendered; no DB logic was changed.

## 2026-06-30: Phase 3.7 UX Cleanup — Customer Context Persistence, Lookup Normalization, Existing Profile Edit Draft

Commits `4e6ea8a`, `62e855d`, and `d2ec080`. Build: 22/22 routes, 0 TypeScript errors before each commit. No schema, RLS, service role, share tokens, preview refactor, or new dependencies in any commit. Browser QA not yet confirmed by Grant.

### `4e6ea8a` — Customer context persistence + Client ↗ navigation + post-save return

Files: `app/admin/AdminApp.tsx`, `app/components/admin/BusinessSection.tsx`.

Root cause: `selectedCustomerId` was local React state only — cleared on every hard refresh. "Client ↗" badges on Website Profile cards had no `onClick` handler. Saving an existing customer-linked profile returned to the Website Profiles list instead of navigating back to the customer.

Key decisions:
- **`selectedCustomerId` in sessionStorage** — same read-on-init + write-on-change pattern as `admin_active_section`. `useState` lazy initializer reads `sessionStorage["admin_selected_customer"]`; a `useEffect` writes on every change. Value cleared on explicit customer deselect.
- **`onNavigateToCustomer` prop added to `BusinessSection`** — `AdminApp` passes `(id) => { setSelectedCustomerId(id); setSection("customers"); }`. Used by "Client ↗" badge clicks and by `handleSaved()` when a customer-linked profile is saved.
- **`handleSaved()` returns to customer for both new and existing customer-linked profiles** — condition: `returnCustomerId = (!editing && prefillData?.customer_id) ? prefillData.customer_id : (editing?.customer_id ?? null)`. If set and `onNavigateToCustomer` is available, navigates to customer; else falls back to `onNavigate?.("customers")`.
- No schema change. `customer_id` is already stored on the profile; this only wires the navigation callback.

### `62e855d` — Selected customer lookup normalization

File: `app/admin/AdminApp.tsx` only.

Root cause: `customers.find((c) => c.id === selectedCustomerId)` compared `customers.id` (Postgres `bigint` → JS number at runtime) with `selectedCustomerId` (always a string from sessionStorage or `business_profiles.customer_id`). Strict `===` between a number and a string is always `false`. All Option A scenarios from `4e6ea8a` failed because `selected` was always `null`.

Key decisions:
- **Normalize at the comparison** — `customers.find((c) => String(c.id) === String(selectedCustomerId ?? ""))`. Same `String()` pattern as `54b47bb`'s `linkedProfile` fix. No schema change. No type widening. Safe because `String()` on both sides turns both into `"12"` or `""`.
- **This is the same bigint/text cross-type mismatch class** as `54b47bb`. Pattern to watch: any `===` comparison between a Supabase `bigint`-column value and a string that came from sessionStorage, a `text` column, or a URL param will silently fail.

### `d2ec080` — Existing Website Profile edit draft persistence

Files: `lib/business/draftProfile.ts`, `app/components/admin/BusinessSection.tsx`.

Root cause: editing an existing Website Profile, typing changes, then navigating away or hard-refreshing lost all unsaved edits. The `wp_draft` mechanism only covered new-profile creation; edit mode had no sessionStorage write-back.

Key decisions:
- **New `wp_edit_draft` key** — stores `{ ...form, id: profileId }` (current form state + profile ID for identity check) with the same 10-minute TTL via existing `store()` wrapper. Separate from `wp_draft` to avoid collision between new-profile and edit flows.
- **Peek-not-consume lifecycle** — `peekWebsiteProfileEditDraft()` reads without deleting on mount (same pattern as `wp_draft`). Consumed at explicit Save or Cancel only. Stale drafts expire via TTL.
- **Three-priority mount effect** — A: `wp_draft` (new profile) → B: `wp_pending_edit` (one-shot Edit button signal, with stale-draft ID check to discard a draft for a different profile) → C: `wp_edit_draft` (reload recovery). Priority A unchanged from before; B unchanged except the stale-draft check; C is new.
- **`editDraftForm` prop on `BusinessEditor`** — when both `existing` and `editDraftForm` are set, the form initializer builds a base from `existing` (safe, from Supabase) then overlays draft fields, stripping `id`, `createdAt`, `updatedAt`, `generatedContent` (which always come from the saved record, not the draft). `generatedContent` is intentionally never stored in the edit draft.
- **`onFormChange` writes to `wp_edit_draft` in edit mode** — `BusinessSection` passes `(f) => createWebsiteProfileEditDraft(editing.id, f)` when `editing !== null`. New-profile `onFormChange` (writes to `wp_draft`) is unchanged.

## 2026-06-30: Phase 3.7 UX Cleanup — Section Persistence, Timestamp, Draft Persistence, Customer Return, Typed Draft Field Persistence, Customer-Side Profile Display Fix

Commits `68b0446`, `e0df637`, `a9c143e`, and `54b47bb`. Build: 22/22 routes, 0 TypeScript errors before each commit. No schema, RLS, service role, share tokens, preview refactor, or new dependencies in any commit.

### `68b0446` — Admin section persistence + generated content timestamp

Files: `app/admin/AdminApp.tsx`, `app/components/admin/BusinessSection.tsx`.

- **Admin section persistence:** `useState` initializer now falls back to `sessionStorage["admin_active_section"]` when `consumeNavTarget()` returns null. A `useEffect` writes the current section on every change. Hard refresh no longer resets admin to Overview. `consumeNavTarget()` (used by the profile-creation flow) retains full priority.
- **Generated content timestamp:** `toLocaleDateString()` → `toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })`. Timestamp on profile cards now shows date + time.

### `e0df637` — Customer → Website Profile draft persistence + return navigation

Files: `lib/business/draftProfile.ts`, `app/components/admin/BusinessSection.tsx`, `app/admin/AdminApp.tsx`.

Root cause: `consumeWebsiteProfileDraft()` read and immediately deleted the draft from sessionStorage on `BusinessSection` mount. Navigating away caused an unmount, React state was lost, and on return the draft was gone.

Key decisions:
- **Peek without consuming on mount** — added `peek<T>()` helper and `peekWebsiteProfileDraft()` export to `draftProfile.ts`. Mount `useEffect` peeks instead of consuming; draft survives section switches. Draft is consumed (deleted) only at explicit save or cancel.
- **TTL preserved** — `peek` still honors the 10-minute TTL and cleans up expired entries on read.
- **Customer return navigation** — after saving a NEW profile from a customer-started flow (`!editing && prefillData.customer_id`), `BusinessSection` calls `onNavigate?.("customers")`. `AdminApp` passes `onNavigate={(s) => setSection(s as Section)}` as a new optional prop.
- `cast (s as Section)` used at the call site to bridge `string` prop type in `BusinessSection` and the typed `Dispatch<SetStateAction<Section>>` in `AdminApp`; safe because the only value passed is `"customers"`.

### `a9c143e` — Typed website profile draft field persistence

File: `app/components/admin/BusinessSection.tsx`.

Root cause: `BusinessEditor` initialized `form` state from the sessionStorage draft once via `useState(() => ...)`. As the user typed, `form` updated in React state only — the sessionStorage draft was never written back. On section navigation or hard refresh, `BusinessSection` re-mounted and re-peeked the original unedited draft, resetting all typed changes.

Key decisions:
- **Write-back on every form change** — added optional `onFormChange?: (form: Partial<BusinessProfile>) => void` prop to `BusinessEditor`. A `useEffect` on `form` calls `onFormChange?.(form)` on every state change.
- **Scoped to customer draft flow only** — `BusinessSection` passes `onFormChange={(f) => createWebsiteProfileDraft(f)}` only when `prefillData !== null`. Manual "+ New Profile" and edit existing profile flows receive `undefined` and are unaffected.
- **No new storage primitives** — reuses existing `createWebsiteProfileDraft()`. Its `preferredStylePack` guard is a no-op when the form is fully populated (style pack is always set at this point).
- Build: 22/22 routes, 0 TypeScript errors. No schema, RLS, service role, share tokens, preview refactor, or new dependencies.

### `54b47bb` — Customer-side Website Profile card/link display fix

File: `app/admin/AdminApp.tsx`.

Reported as: Customer → Create Website Profile → Save did not show the linked Website Profile card on the Customer detail page. Live read-only Supabase checks (run manually by Grant in the SQL Editor) confirmed `business_profiles.customer_id` exists and is correctly populated and linked to the corresponding `customers.id` row — this ruled out a missing-column or bad-data cause and scoped the fix to the UI layer only.

Root cause: `CustomerDetail`'s `linkedProfile` lookup used `profiles.find((p) => p.customer_id === customer.id)`. `business_profiles.customer_id` is a Postgres `text` column, always returned as a JS string (e.g. `"12"`) by the Supabase client. `customers.id` is `bigint`, always returned as a JS number (e.g. `12`). Strict `===` between a string and a number is always `false`, so the link was never found even when correctly set in the database. (Other comparisons in the same component — jobs/quotes/invoices `customer_id` — worked correctly because those columns are also numeric/bigint-derived, the same runtime type as `customer.id`.)

Key decisions:
- **Normalize at the comparison, not the schema** — fixed by comparing `p.customer_id === String(customer.id)` rather than changing the `business_profiles.customer_id` column type. No schema change needed or made.
- **Added a `profilesLoading` state** — `profiles` initializes to `[]`, so before the audit fix the page would briefly and incorrectly render "No website profile yet." while `getAllProfiles()` was still in flight. Added `profilesLoading` (`true` initially, `false` once the existing `useEffect`'s `getAllProfiles()` call resolves) and a three-way render branch: linked profile card → "Loading…" placeholder → "No website profile yet." empty state. The "+ Create Website Profile" button visibility is unchanged (still gated on `!linkedProfile` only, not on loading state).
- **Diagnosis discipline** — initial hypothesis (schema file lacked an `ALTER TABLE ADD COLUMN IF NOT EXISTS` guard for `business_profiles`, unlike every other table) was disproved by live read-only Supabase checks before any schema SQL was written or run. Audit pivoted to a pure UI-layer investigation per explicit instruction once the DB-level link was confirmed correct.
- Build: 22/22 routes, 0 TypeScript errors. No schema, RLS, service role, share tokens, preview refactor, or new dependencies.
- Manual browser QA not yet confirmed by Grant — do not treat as fully verified until confirmed.

## 2026-06-30: Phase 3.7 — Runtime QA + Schema Fix

Commit `767d30f`. File: `supabase/schema-complete.sql`.

The live Supabase project was missing the `business_profiles` table, causing 404 errors when admin loaded the Website Profiles section. The schema definition was added to `supabase/schema-complete.sql` and applied successfully in the Supabase SQL Editor. No app code was changed.

Runtime QA passed:
- Logged-in admin
- Website Profiles loading with no Supabase 404s
- Create business profile + persist after hard refresh
- Edit profile
- Preview via `/website-preview/bp_...` with generated website content
- AI Content badge
- Staleness badge after profile edit
- Reset to blueprint
- Delete + persist after hard refresh

Key decisions:
- **Schema applied via SQL Editor** — `supabase/schema-complete.sql` is the canonical schema definition; it was applied to the live project manually. No migration tooling involved.
- **No app code changed** — the missing table was the only runtime blocker; all application logic was already correct after commits `8bb8abb` and `30418b8`.
- **RLS/owner_id enforcement deferred** — `business_profiles` has no RLS policy. The table is not public-launch-ready. Enforcement is a separate approved security slice; do not add RLS until that slice is explicitly scoped and approved.
- **Legacy localStorage import edge case deferred** — only action-worthy if it is confirmed that an old Scrub Club localStorage profile needs importing into the live project. No action until confirmed.
- **Known UX follow-ups recorded (not blocking):** admin hard refresh resets selected section back to Overview; generated timestamp shows date only (not exact time). Both require separate approved slices.

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

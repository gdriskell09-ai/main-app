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

## Parked — Business Profile Supabase Migration

Migration of `lib/business/storage.ts` from localStorage to Supabase is **planned but not approved**. Do not start it without explicit user approval.

Critical findings from impact audit (2026-06-28):
- All storage functions are synchronous. Supabase is async. The migration requires `async/await` changes in **three caller files**, not just `storage.ts`.
- Files that need changes beyond `storage.ts`: `app/components/admin/BusinessSection.tsx`, `app/admin/AdminApp.tsx`, `app/website-preview/[businessId]/page.tsx`.
- Do NOT approve a "storage.ts-only" migration — it will produce subtle bugs (stale reads after delete, lost saves on navigation).
- `bp_` profile ID format must be preserved as the Supabase text PK to avoid breaking existing preview URLs.
- `generatedContent` preferred as inline JSONB in `business_profiles` table (not a separate table) for the first migration.
- Preview/RLS future direction established (2026-06-28): admin reads use strict `owner_id = auth.uid()` RLS; public/shareable preview is a **separate future slice** gated by a `public_preview_enabled` flag and/or share token; anonymous Supabase reads by profile ID are rejected. This is no longer a blocker for the storage migration itself.
- Dual-write (localStorage cache + background Supabase sync) is explicitly rejected — creates two sources of truth.
- Do NOT implement: service role client, RLS policies, preview page refactor, share token table, `publicPreviewEnabled` field, or public preview route. All parked until storage migration lands and a separate preview-publishing slice is explicitly approved.

When migration is approved, it must be scoped as: async `storage.ts` rewrite + all three caller files updated. Preview URL public access is a follow-on slice, not part of the migration.

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

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
- Phase 3.6 Slice 2 not started. Do not begin without explicit user approval. Parked: staleness indicator, content preview on card.

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

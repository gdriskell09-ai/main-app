# Decision Log

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

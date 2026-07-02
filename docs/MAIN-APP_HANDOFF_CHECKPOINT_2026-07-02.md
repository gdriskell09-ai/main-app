# Main App Handoff Checkpoint — 2026-07-02

## 1. PROJECT IDENTITY

- **Repo:** `main-site` (Next.js marketing site + white-label website demos + admin CRM).
- **Repo path:** `/Users/grantdriskell/Desktop/projects/gadriskell1/main-site`
- **Separate repo — do not touch from this repo/session:** Scrub Club app at `/Users/grantdriskell/Documents/GitHub/scrub-club-app`.
- **Branch:** `main` (no feature branches in active use; temporary branches are deleted after use — see §7).

## 2. CURRENT VERIFIED STATUS

Verified directly from `git log`/`git status` at the start of this checkpoint task:

- Local `main` HEAD: `df9b477 docs: add Claude project workflow memory`
- `origin/main` HEAD: `a95e8d3 docs: record contact cleanup completion`
- **Local `main` is one commit ahead of `origin/main`.** `df9b477` (the Claude memory/workflow commit) exists locally and has **not** been pushed.
- Working tree was clean before this checkpoint file was created.
- Last commit confirmed on both local and `origin/main`: `a95e8d3 docs: record contact cleanup completion`.

## 3. COMPLETED WORK SINCE LAST CHECKPOINT

**Contact / phone / email cleanup — complete, pushed to `origin/main`:**

| Commit | Description | Pushed? |
|---|---|---|
| `43f4087` | fix: clarify and validate contact phone flow (public contact form) | Yes |
| `0ee4e12` | fix: improve customer contact editing (admin) | Yes |
| `a95e8d3` | docs: record contact cleanup completion | Yes |

Verified facts:
- Public contact form phone field is optional; non-empty values must be exactly 10 digits after stripping non-digits, else submit is blocked with an inline error. Passed manual QA.
- Customer contact info in admin (`AdminApp.tsx`) is read-only by default with a single "Edit" button revealing editable Email + Phone fields and Save/Cancel (visible only while editing). Both fields validate safely (blank allowed; phone needs 10 digits; email needs a reasonable shape). Save updates only the customer's `email`/`phone` columns. Passed manual QA.
- Website Profile detail (`BusinessSection.tsx`) shows informational phone- and email-difference notes when a linked customer's contact values differ from the profile's. A latent bug (unstringified `customer_id` from a Postgres `bigint` id) that silently prevented the phone note from ever rendering was fixed; the email note was newly added. Passed manual QA.
- **No automatic sync was added** between Customer contact info and Website Profile contact info in either direction — confirmed by code review and manual QA. The two remain intentionally separate.
- Build passed 22/22 routes, 0 TypeScript errors, before each commit in this cleanup.
- **This work is complete and should not be reopened without a real new bug report** — do not re-audit or re-touch contact/phone/email code as a "next step."

**Claude memory/workflow files — created, committed locally, NOT yet pushed:**

| File | Status |
|---|---|
| `CLAUDE.md` | Updated with project rules (repo identity, Scrub Club exclusion, source-of-truth order, start checks, forbidden list). Committed in `df9b477`. |
| `.claude/skills/main-site-workflow/SKILL.md` | New skill file — repeatable workflow, safety checks, commit discipline, QA report format. Committed in `df9b477`. |

Both files are committed to local `main` (`df9b477 docs: add Claude project workflow memory`) but **`df9b477` has not been pushed to `origin/main`.** This is the one open loose end from the prior session.

## 4. CURRENT IMMEDIATE NEXT STEP

Push `df9b477` to `origin/main` to finish landing the Claude memory/workflow checkpoint. This is a docs-only push (no app code in that commit) and requires explicit user approval before pushing, per `CLAUDE.md`/skill rules.

After that push is confirmed, the next action is to **choose** (not implement) the next build slice from the candidate list in §9 — this checkpoint task does not select one.

## 5. EXACT NEXT-CHAT OPENING PROMPT

```
You are working in /Users/grantdriskell/Desktop/projects/gadriskell1/main-site.

Read docs/MAIN-APP_HANDOFF_CHECKPOINT_2026-07-02.md first — it is the current
source-of-truth checkpoint. Then run:

pwd
git status --short
git branch --show-current
git log --oneline -5
git log --oneline origin/main -5

Confirm whether df9b477 (docs: add Claude project workflow memory) has been
pushed to origin/main yet. If not, push it (docs-only commit, no app code).
Then stop and wait for the next task — do not pick a build slice on your own.
```

## 6. EXACT NEXT CLAUDE PROMPT

```
Task: Push the Claude project workflow memory checkpoint.

Do not edit files. Do not amend commits. Do not touch app code, schema,
Scrub Club, or dependencies.

Context: Local main is at df9b477 (docs: add Claude project workflow memory,
contains CLAUDE.md + .claude/skills/main-site-workflow/SKILL.md), one commit
ahead of origin/main which is at a95e8d3.

Run:
pwd
git status --short
git log --oneline -5
git log --oneline origin/main -5

Then push:
git push origin main

Report: push result, final git status, latest local and origin/main commits,
confirm df9b477 is now on origin/main, confirm no files were edited, stop.
```

## 7. STALE INFORMATION TO DISCARD

Do not trust or act on the following outdated claims found in older docs/checkpoints:

- Any claim that `d219199` is the latest commit — it is not; `df9b477` (local) / `a95e8d3` (pushed) are later.
- Any claim that phone validation is "still upcoming" — it is complete and pushed (`43f4087`, `0ee4e12`).
- Any claim that Website Profile difference notes "still fail" or don't render — this was fixed in `0ee4e12` and passed manual QA.
- Any claim that contact-cleanup QA is incomplete — manual browser QA passed for all scenarios listed in §3.
- The temporary branch `fix/customer-contact-editing` — it was created, found to be redundant (no commits ahead of `main` since the fix landed directly on `main`), and deleted both locally and on `origin`. It no longer exists and should not be referenced or recreated.
- `AI_TASKS.md`'s embedded note *"Website Profiles organization/search UX complete (commit `d219199`, 2026-07-01). Next recommended code slice: floating buttons / Save-Submit UX. Following slice: phone number validation/formatting."* — this ordering is stale. Floating buttons UX (`52269bc`) and phone validation (`dfb938c`, `0cad394`, `43f4087`, `0ee4e12`) are both already complete. This note should be treated as historical, not as a live recommendation.

## 8. BEST NEXT TOOL / MODEL

- For the pending push (§4/§6): plain tool use (Bash/git) is sufficient — no subagent or heavy reasoning needed.
- For choosing the next build slice: a short planning/discussion turn with the user is appropriate before any implementation — do not default into implementation.
- For implementing whichever slice is chosen: standard agentic coding flow (read → plan → implement → build → QA → commit), following `.claude/skills/main-site-workflow/SKILL.md`.
- No indication that a specialized subagent, worktree isolation, or a different model tier is needed for the current known work.

## 9. FORBIDDEN / PARKED WORK

**Forbidden unless explicitly approved (per `CLAUDE.md` / workflow skill):**
Schema changes, RLS, service role, share tokens, new dependencies, preview route refactor, payments, final pricing, subscriptions, marketplace checkout, QuickBooks/accounting integrations, OpenRouter/provider routing, BYO API key storage, automatic AI API calls, AI vision/photo quoting, map measuring, website importing, full redesign.

**Parked (require separate approval before starting):**
- RLS policies (`owner_id` enforcement) for `business_profiles`
- Service role client
- Preview page refactor
- Share token table / `publicPreviewEnabled` field / public preview route
- Dropping localStorage reads entirely (cleanup after `bp_migrated` confirmed set)
- Legacy localStorage import edge case (only relevant if an old Scrub Club localStorage profile needs importing)

**Candidate next build directions (not selected — for discussion only):**
- Admin/product UX polish
- AI Helper Tools architecture
- Website Preview/demo polish
- Timestamp/date display audit
- AdminApp refactor audit (file is large — `app/admin/AdminApp.tsx` is ~2,400 lines; a structural audit may be worth scoping before more feature work lands there)

## 10. SOURCE-OF-TRUTH ORDER

1. `PROJECT_STATE.md`
2. `AI_TASKS.md`
3. `docs/decision-log.md`
4. Current git state (`git status`, `git log`) — always re-verify, do not trust any doc's claimed "latest commit" without checking
5. This checkpoint file (`docs/MAIN-APP_HANDOFF_CHECKPOINT_2026-07-02.md`) — supplemental summary, superseded by any newer checkpoint file
6. Uploaded/chat context — supplemental only, never authoritative over the above

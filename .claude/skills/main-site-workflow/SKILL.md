---
name: main-site-workflow
description: Repeatable coding/docs/QA workflow for main-site. Use for any main-site task that touches code, runs QA, or produces a commit — audits, fixes, feature work, or docs checkpoints tied to a code change.
---

Standard workflow for main-site sessions. Keeps sessions scoped, auditable, and consistent with `CLAUDE.md` and `PROJECT_STATE.md`/`AI_TASKS.md` as source of truth.

## When to use

Any main-site coding, docs, or QA task — audits, bug fixes, feature slices, manual QA passes, or docs-only checkpoints that record a code change.

## Mandatory start checks

Run exactly these before anything else:

```bash
pwd
git status --short
git branch --show-current
git log --oneline -5
```

If `git status` is not clean, stop and report — do not proceed on top of unexplained working-tree state unless the user has explicitly said those changes are expected.

## Repo safety checks

- Confirm the working directory is `/Users/grantdriskell/Desktop/projects/gadriskell1/main-site` before editing anything.
- Never inspect, edit, or infer from `/Users/grantdriskell/Documents/GitHub/scrub-club-app` (Scrub Club) in a main-site session.
- Never scan `.env.local` or any env file for credentials, including grepping var names/lengths to hunt for admin logins. If admin-authenticated QA is needed, ask the user to log in manually or supply a disposable test account.

## Allowed-files discipline

- Work only inside the files explicitly listed as in-scope for the task.
- If a fix requires touching a file outside that list, stop and say so before editing it — don't silently expand scope.
- Treat `PROJECT_STATE.md`, `AI_TASKS.md`, and `docs/decision-log.md` as the docs to update for a completion checkpoint — not other markdown files, unless asked.

## Build/verify expectations

- Run `npm run build` after any app-code change, before reporting success.
- For UI/behavior changes, prefer real verification (dev server + browser) over assuming code correctness from a passing build. If browser QA isn't possible (e.g. missing credentials), say so explicitly rather than claiming the feature works.

## Commit discipline

- Never `git add .` or `git add -A`. Stage only the specific files relevant to the change.
- Commit only related files — don't bundle unrelated cleanup into the same commit.
- Stop before pushing unless the user has explicitly approved the push in this task.
- Never amend a commit unless explicitly asked; create a new commit instead.

## QA report format

Report back in this order:

1. Repo / branch / status
2. Files changed
3. Build result
4. QA result (manual or automated — say which)
5. Final `git status`
6. Latest commit
7. Forbidden-work confirmation (explicitly state nothing out-of-scope was touched)
8. Next safest task

## Port 3000 safety

- If the wrong app appears when hitting `localhost:3000`, stop the dev server immediately — don't keep debugging against it.
- Run `lsof -i :3000` to see what's actually bound to the port.
- Verify `pwd` is main-site before restarting `npm run dev`.

## Forbidden unless explicitly approved

Same list as `CLAUDE.md`: schema changes, RLS, service role, share tokens, new dependencies, preview route refactor, payments, final pricing, subscriptions, marketplace checkout, QuickBooks/accounting integrations, OpenRouter/provider routing, BYO API key storage, automatic AI API calls, AI vision/photo quoting, map measuring, website importing, full redesign.

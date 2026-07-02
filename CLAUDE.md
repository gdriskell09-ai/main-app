@AGENTS.md

# Project rules — main-site

- This repo is `main-site`. Correct repo path: `/Users/grantdriskell/Desktop/projects/gadriskell1/main-site`.
- Separate repo: the Scrub Club app lives at `/Users/grantdriskell/Documents/GitHub/scrub-club-app`. Never touch Scrub Club from this repo/session.

## Source of truth order

1. `PROJECT_STATE.md`
2. `AI_TASKS.md`
3. `docs/decision-log.md`
4. Current git state (`git status`, `git log`)
5. Uploaded/chat context — supplemental only, never authoritative over the above

## Start every task with

```bash
pwd
git status --short
git branch --show-current
git log --oneline -5
```

Stop if `git status` is dirty, unless the user explicitly says those changes are expected.

## Working rules

- One scoped task per session.
- Do not push unless explicitly approved.
- No broad rewrites or feature expansion without approval.
- Never scan `.env.local` (or any env file) for credentials. If admin login is required for QA, ask the user to log in manually or provide a disposable test account.

## Forbidden unless explicitly approved

Schema changes, RLS, service role, share tokens, new dependencies, preview route refactor, payments, final pricing, subscriptions, marketplace checkout, QuickBooks/accounting integrations, OpenRouter/provider routing, BYO API key storage, automatic AI API calls, AI vision/photo quoting, map measuring, website importing, full redesign.

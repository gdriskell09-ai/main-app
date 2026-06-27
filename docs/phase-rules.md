# Phase Rules

## Phase Verification

Before coding, verify the active phase from:

1. User's current request
2. `PROJECT_STATE.md`
3. Current git status
4. Relevant files in the repo

If phase notes conflict, mark the phase as unknown and ask or proceed only with documentation/forensics.

## Current Known Phase Status

Note: resolved, see docs/decision-log.md (2026-06-26).

`PROJECT_STATE.md` contains conflicting notes:

- "Phase 2.7 complete. Phase 3 is next."
- Footer says "Phase 3 + Phase 3.2 complete."

Therefore, do not assume the current implementation phase without explicit confirmation.

## Repo Separation

`main-site`:

- `/Users/grantdriskell/Desktop/projects/gadriskell1/main-site`
- white-label local business website builder platform
- Next.js App Router

`scrub-club-app`:

- `/Users/grantdriskell/Documents/GitHub/scrub-club-app`
- proof-model pressure washing app
- separate architecture and product context

Never mix file paths, schema assumptions, or implementation patterns between these repos without explicit user instruction.

## Build Rules

- Do not install packages unless explicitly requested.
- Do not update lockfiles unless package changes are approved.
- Do not run destructive git commands.
- Run build/test only after approved code edits.

## Documentation Rules

- Keep future modules marked roadmap/future.
- Do not turn roadmap notes into implementation without approval.
- Update docs after completed phases only when requested or when the task is documentation maintenance.

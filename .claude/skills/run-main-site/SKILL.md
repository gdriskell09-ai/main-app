---
name: run-main-site
description: Build, run, and drive main-site (Next.js marketing + sample sites app). Use when asked to start main-site, run it, take a screenshot, build it, test a route, or interact with the running app.
---

This is a Next.js 16 app (marketing site + white-label website demos). Drive it by launching the dev server in the background, then running `.claude/skills/run-main-site/driver.mjs` which uses Playwright's bundled Chromium to navigate, interact, and screenshot any route.

All paths below are relative to the repo root (`main-site/`).

## Prerequisites

Node.js (already in repo's environment). Playwright's bundled Chromium is used — no system browser needed.

```bash
npm install           # install deps including playwright
npx playwright install chromium   # download browser (one-time, ~130MB)
```

## Setup

`.env.local` must exist with real values (template at `.env.local.example`). Required keys:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GROQ_API_KEY=...
```

## Run (agent path)

**Step 1 — start the dev server:**

```bash
pkill -f "next dev" 2>/dev/null || true
npm run dev > /tmp/next-dev.log 2>&1 &
echo $! > /tmp/next-dev.pid
# poll until ready (macOS has no `timeout`; use a loop)
for i in $(seq 60); do curl -sf http://localhost:3000 >/dev/null && break; sleep 1; done
```

**Step 2 — drive with the driver:**

```bash
# Screenshot homepage
node .claude/skills/run-main-site/driver.mjs screenshot

# Screenshot any route
node .claude/skills/run-main-site/driver.mjs nav http://localhost:3000/marketplace

# Smoke test: home, marketplace, 2 sample sites, contact
node .claude/skills/run-main-site/driver.mjs smoke
```

Screenshots land in `/tmp/shots/`. The driver prints the path for each file.

**Step 3 — stop:**

```bash
kill $(cat /tmp/next-dev.pid) 2>/dev/null || pkill -f "next dev"
```

### Driver commands

| command | args | output |
|---|---|---|
| `screenshot` | `[url] [outfile]` | screenshot of url (default: localhost:3000) → `/tmp/shots/main-site.png` |
| `nav` | `<url>` | screenshot → `/tmp/shots/shot.png` |
| `smoke` | — | 5-route sweep (home, marketplace, barbershop, plumbing, contact) → `/tmp/shots/*.png` |

## Run (human path)

```bash
npm run dev   # → http://localhost:3000. Ctrl-C to stop.
```

## Gotchas

- **`timeout` command missing on macOS** — macOS ships `gtimeout` via coreutils (if installed) but not `timeout`. Use `for i in $(seq N); do ... sleep 1; done` loops instead. The driver itself uses Playwright's built-in `waitUntil: 'networkidle'` so it's unaffected.
- **First nav slow** — Next.js compiles routes on demand. The first `page.goto()` for a route can take 10–20s; Playwright's `networkidle` handles it cleanly.
- **Port conflict on relaunch** — Always `pkill -f "next dev"` before restarting or you'll get `EADDRINUSE: 3000`.
- **Supabase-gated pages** — Admin routes (`/admin`, `/admin/login`) require auth. The smoke driver doesn't hit these; navigate them manually or add a login sequence before testing.

## Troubleshooting

- **`Error: browserType.launch: Executable doesn't exist`** — run `npx playwright install chromium`.
- **All pages blank / network errors** — `.env.local` is missing or has wrong Supabase keys; check `/tmp/next-dev.log`.
- **`EADDRINUSE :::3000`** — another process owns port 3000. Run `pkill -f "next dev"` then retry.

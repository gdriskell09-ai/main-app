---
name: website-preview-audit
description: Read-only quality audit of the Website Preview/demo experience (style packs, blueprints, sections, generated previews). Use when asked to review, audit, or assess website preview/demo quality, or to find preview polish opportunities — not for implementing fixes.
---

Audits the rendered demo experience for main-site's website engine — `/website-preview`, `/website-preview/[businessId]`, the style packs, blueprints, and the reusable section components they compose. Produces a ranked findings report. Does not implement fixes.

## When to use

Any request to review, audit, or assess the Website Preview/demo experience, a style pack, a blueprint, or the visible quality of generated website previews. Also use before/after a section or blueprint change to check for regressions.

## Read-only by default

This skill does not edit files. If a finding should be fixed, say so explicitly and stop — implementing it is a separate, user-approved task. Only edit files if the task that invoked this skill explicitly grants edit permission for a specific fix.

## Required context

Read only what's needed for the audit in scope — usually a subset of:

- `app/website-preview/page.tsx`
- `app/website-preview/[businessId]/page.tsx`
- `app/components/website-engine/WebsiteRenderer.tsx`
- `lib/website-engine/stylePacks.ts`
- `lib/website-engine/types.ts`
- `lib/business/profileToWebsiteConfig.ts`
- `lib/business/blueprints/registry.ts` (the relevant blueprint entries only — it's 1,000+ lines)
- The specific section component(s) under review in `app/components/website-engine/sections/`

Do not scan unrelated areas of the repo (admin CRM, contact form, auth, etc.) unless the request specifically spans them.

## Checklist

Work through each dimension against the files in scope:

1. **CTA functionality** — do buttons/links actually do something (`tel:`, scroll target, real `href`)? Any dead `<button>` with no `onClick`/`href`?
2. **Visual hierarchy** — is there a clear primary action per section; does emphasis (size/weight/color) match importance?
3. **Spacing and rhythm** — consistent section padding; no cramped or oversized gaps relative to neighboring sections.
4. **Mobile behavior** — check `@media` rules and `clamp()` usage; verify sections don't rely on desktop-only assumptions (fixed widths, hover-only affordances for key info).
5. **Style-pack consistency** — does the section pull colors/radii/shadows/weights from the `stylePack` prop, or does it hardcode values that ignore the active pack?
6. **Blueprint consistency** — does content vary meaningfully by industry, or is it identical/generic across blueprints (same fake names, same claims, same placeholder gradients)?
7. **Empty/fallback states** — what renders when a prop is missing, empty array, or profile field is blank? Does it degrade gracefully or look broken?
8. **Placeholder content** — obviously-fake copy, filler text, or lorem-ipsum-style content shown as if real.
9. **Generic or fabricated trust claims** — invented stats/ratings/reviews presented as real facts (not just "generic-sounding" — flag anything a business owner couldn't truthfully claim without editing).
10. **Dead links/buttons** — `href="#"`, no-op onClick, or navigation that goes nowhere.
11. **Accessibility basics** — alt text on images, sufficient color contrast for body text against `stylePack` backgrounds, focus-visible affordances, semantic heading levels.
12. **Reduced-motion behavior** — respects `prefers-reduced-motion` (check against the engine-wide rule in `WebsiteRenderer.tsx`); no motion-only conveyance of information.
13. **Duplicated presentation logic** — identical UI/control code copy-pasted across the two preview pages (or elsewhere) that could drift out of sync over time.

Use the dev server + `run-main-site`/`driver.mjs` to screenshot the matrix (7 style packs × available demos, at least one mobile-width screenshot) when visual confirmation is needed, rather than reasoning from code alone.

## Output format

Always report:

1. **Findings ranked by impact** (highest first) — what a real visitor/prospect would notice.
2. **Exact files involved** per finding, with line references where practical.
3. **Smallest safe improvement** per finding — the minimal diff that fixes it without redesigning the engine.
4. **Risk** per finding (low/medium/high) and why.
5. **One recommended implementation slice** — pick the single highest-value, lowest-risk finding as the next actionable task. Do not recommend a bundle of fixes as "the slice."

## Safety and scope rules

- Do not recommend preview sharing, anonymous public reads, share tokens, RLS changes, service-role clients, route refactors, schema changes, new AI behavior, automatic AI calls, a visual-builder replacement, or a full redesign.
- Do not install dependencies or add new tools as part of an audit.
- Do not touch Scrub Club.
- If a finding requires touching a forbidden area to fix properly, say so and stop — don't propose a workaround that quietly crosses the line.

## What this prevents

Ad hoc, inconsistent "does this look okay" reviews that miss the same class of bug repeatedly (hardcoded style-pack-ignoring values, dead CTAs, duplicated control-bar code across preview pages). Gives every preview review the same checklist and the same output shape, so findings are comparable across sessions.

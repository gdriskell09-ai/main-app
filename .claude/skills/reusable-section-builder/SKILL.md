---
name: reusable-section-builder
description: Guide for adding or materially editing a website-engine section component in main-site. Use when creating a new section type, or changing an existing section's props/behavior, for the template-first renderer under app/components/website-engine/sections/.
---

Guides adding or materially editing a section in main-site's template-first website engine. Preserves the existing renderer/blueprint architecture — it does not encourage freeform React generation or a departure from the registry pattern.

## When to use

Creating a new website-engine section component, or making a material change to an existing one's props, behavior, or rendering logic. Not for unrelated admin UI work.

## Required context

Read before making changes:

- `app/components/website-engine/WebsiteRenderer.tsx` — registry pattern and the in-file "How to add a new module" notes
- `lib/website-engine/types.ts` — `SectionConfig` discriminated union and existing prop interfaces (for consistency of shape/naming)
- `lib/website-engine/stylePacks.ts` — the `StylePack` token set every section must draw from
- `lib/business/profileToWebsiteConfig.ts` — where blueprint content becomes section props (`buildSection`)
- The specific existing section component, if editing one

## The six-step process (PROJECT_STATE.md §6, "Adding a New Section")

This is the architecture — follow it exactly, don't shortcut it:

1. Define the props interface in `lib/website-engine/types.ts`.
2. Add the new type to the `SectionConfig` discriminated union in the same file.
3. Create the component in `app/components/website-engine/sections/`.
4. Register it in `WebsiteRenderer.tsx`'s `REGISTRY`.
5. Add it to the relevant blueprint(s)' `activeSectionOrder` in `lib/business/blueprints/registry.ts`, as needed.
6. Add the corresponding `buildSection` case in `lib/business/profileToWebsiteConfig.ts` so blueprint/profile data actually reaches the new props.

Skipping step 6 is the most common way a section silently never renders (falls through `buildSection`'s `default: return null`). Skipping step 4 triggers the renderer's visible "Unknown section type" fallback — check for that during verification.

## Required checks

For every new or materially-edited section, verify all of the following before calling it done:

- **Section type registration** — present in `SectionConfig`, `REGISTRY`, and at least one blueprint's `activeSectionOrder`.
- **Mapper/`buildSection` handling** — a case exists, reads from `profile`/`blueprint.content`/`vars` consistently with how other cases do it, and returns `null` gracefully if required data is missing (never throw).
- **Style-pack design tokens** — colors, radii, shadows, heading weight, and animation intensity come from the `stylePack` prop, not hardcoded hex/px values. A section that ignores `stylePack` breaks visually the moment someone switches packs — check it against at least two style packs, not just the default.
- **No unnecessary hardcoded colors** — flag any hardcoded color that isn't a deliberate exception (e.g., pure white text on a dark hero overlay is fine; a hardcoded slate-gray placeholder that ignores `stylePack.accent` is not).
- **Mobile behavior** — uses `clamp()` for fluid type/spacing where the existing sections do, and/or an explicit `@media (max-width: ...)` rule if the layout needs a structural change on small screens. Check against the engine-wide mobile reset in `WebsiteRenderer.tsx`'s injected styles before duplicating rules that already exist there.
- **Reduced-motion behavior** — any animation respects `prefers-reduced-motion` (reuse the engine's `we-fade-up`/`we-*` classes and the `ENGINE_STYLES` reduced-motion block rather than inventing new animation that bypasses it).
- **Empty and fallback states** — every prop that can reasonably be missing/empty is handled without rendering broken-looking output (no dangling label with no value, no obviously-placeholder gradient/image with no visual hint that it's a placeholder).
- **CTA behavior** — any button or link either does something real (`tel:`, anchor scroll, real `href`) or is intentionally decorative — never a dead `<button>` with no handler presented as actionable.
- **Accessibility basics** — alt text on images, adequate contrast against the active `stylePack` background, sensible heading level within the page's outline.
- **Sample data / preview coverage** — add or update an entry in `lib/website-engine/sampleData.ts` (or use `/website-preview`) so the new/changed section is actually visible and testable, not just type-checked.
- **Build verification** — run `npm run build` and confirm 0 TypeScript errors and all routes still generate before considering the work done.

## Explicitly out of scope unless separately approved

Do not, as part of a section change:

- Modify Supabase schema, RLS, service-role usage, or share tokens.
- Refactor preview routes.
- Add or change storage/persistence logic beyond what step 6 requires.
- Add a new dependency.
- Add or change AI-generation behavior (`generatedContent`, `/api/generate-*`).
- Touch Scrub Club.

If a section genuinely needs one of these, stop and say so — don't fold it into the section change silently.

## Architectural discipline

- Stay inside the registry/props/blueprint pattern. Do not generate one-off freeform React that bypasses `WebsiteRenderer`'s registry, hardcodes content instead of taking it via props, or introduces a section-specific rendering path outside this system.
- Reuse existing patterns from sibling sections (prop naming, `stylePack` usage, animation class usage) rather than inventing new conventions per section.
- A section component's only inputs should be `{ props, stylePack, businessName }` per `SectionRenderProps<T>` — don't reach outside that contract for data.

## What this prevents

The exact drift already found in this codebase: sections that hardcode colors and ignore the active style pack, CTA buttons with no real action, gallery/placeholder content with no fallback-state signal, and new sections that half-integrate (registered in the renderer but never wired into the blueprint mapper, so they silently never appear).

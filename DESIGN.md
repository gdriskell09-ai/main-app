# Design System

## Product Design Principles

- Build the actual usable experience, not a marketing shell.
- Keep dashboards dense but readable.
- Make website previews feel like real client sites, not generic cards.
- Use stable dimensions for repeated UI pieces.
- Avoid nested cards.
- Favor clear sections, strong headings, and direct actions.

## Base UI Direction

Approved safe first stack:

- `shadcn/ui`
- `lucide-react`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `motion`

Use these for forms, dialogs, tabs, inputs, selects, checkboxes, segmented controls, buttons, and validation once install is approved.

## Icons

Use `lucide-react` icons for app UI when available.

Do not manually draw common UI icons unless there is no suitable library icon.

## Forms

Forms should use:

- stable `id` and `name`
- connected labels
- clear validation
- accessible error text
- no hidden required fields
- no automatic AI calls
- owner review before publish

Recommended later stack:

- `react-hook-form`
- `zod`
- `@hookform/resolvers`

## Motion

Use `motion` for small transitions:

- route/section fades
- accordion transitions
- dashboard panel reveals
- preview polish

Avoid motion that blocks productivity or hides content.

## Website Quality Checklist

Every generated or previewed website should answer:

- What business is this?
- What do they do?
- Where do they serve?
- Why trust them?
- What should I do next?
- Is the primary CTA obvious on mobile?
- Are service sections specific to the industry?
- Are images real or clearly placeholder?
- Does the site work without AI?
- Does copy avoid invented claims?
- Does the page avoid final pricing unless approved?

## Website Builder UX Rules

- Blueprint/fallback generation is the default.
- AI enhancement must be opt-in and button-triggered.
- The owner must review content before publishing.
- Future visual editing should enhance the engine, not replace it.
- Do not build a full visual builder replacement yet.

## Style Packs

Style packs are the visual identity layer of the website engine. Each pack is a `StylePack` object in `lib/website-engine/stylePacks.ts` and its ID is registered in the `StylePackId` union in `lib/website-engine/types.ts`. WebsiteRenderer resolves the active pack from `WebsiteConfig.stylePack` and passes it as a prop into every section component.

Adding a new pack requires three changes: add the ID to `StylePackId`, add the object to `stylePacks.ts`, add an entry to `STYLE_PACKS` in `BusinessSection.tsx`. Nothing else needs updating.

### Current packs

| ID | Name | Feel |
|---|---|---|
| `bold-contractor` | Bold Contractor | Warm off-white, orange accent, 900-weight headings, rugged/field-trade |
| `clean-pro` | Clean Pro | White, sky-blue accent, pill buttons, professional/corporate |
| `luxury-dark` | Luxury Dark | Near-black, gold accent, large radius, dark premium/salon |
| `premium-glass` | Premium Glass | Blue-purple gradient, indigo, glassmorphism cards, tech startup |
| `high-energy` | High Energy | Pure black, red accent, 4px sharp corners, gym/action |
| `playful-bright` | Playful Bright | Cream-peach, pink accent, 28px radius, food/ice cream/fun |
| `premium-minimal` | Premium Minimal | Warm off-white, muted forest green accent, no shadows, editorial/Apple |

### premium-minimal — design direction

Inspired by Apple product pages and Granola (clean, content-first apps). Rules for this pack and anything built with it:

- **Generous whitespace.** Sections breathe. Padding should feel like it could go wider — then go wider.
- **One focal idea per section.** One headline, one action, one message. Do not pack in competing elements.
- **Typography carries the weight.** Large headings at `font-weight: 600` (semi-bold, not heavy). Size and spacing do more than weight. No decorative elements to fill gaps.
- **Restrained palette.** Background is warm off-white (`#f8f7f4`). Text is near-black (`#1c1c1e`). Accent (`#2d6a4f`, muted forest green) is used only on CTAs, links, and badges — never as a fill for whole sections.
- **No shadows.** `cardShadow: "none"`. Separation comes from spacing and a barely-there warm border (`#e8e3dc`), not depth.
- **Subtle motion only.** `animationIntensity: "low"`. Use the engine's `we-fade-up` class for gentle entrance fades. No bounce, no spin, no scale-up on hover beyond a mild opacity or color shift.
- **Hero overlay is near-black, clean.** No colorful gradients — the hero gets dark charcoal tones so white text is readable without distraction.
- **Button radius is `6px`.** Not pill, not sharp — present but restrained.

Do not add shadows, heavy borders, colorful backgrounds, multi-color gradients, or high-intensity animations to sections when this pack is active. Keep the same discipline in any future sections added to the engine.

## 21st.dev Rule

`21st.dev` may be evaluated later for individual blocks only. Do not import a broad kit, overwrite the design system, or replace existing architecture.

## Future Visual Builder Lab

Roadmap only:

- block-level editing
- section reordering
- style pack previews
- draft/published states
- per-client preview links

Research options:

- Puck
- dnd-kit
- shadcn/ui composition patterns

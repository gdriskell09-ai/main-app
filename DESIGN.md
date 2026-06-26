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

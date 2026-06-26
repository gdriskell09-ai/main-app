# Tool Registry

## Approved Safe First Stack

These are approved for first implementation once installation is explicitly requested:

| Tool | Purpose | Status |
|---|---|---|
| shadcn/ui | accessible app UI components | approved safe first stack |
| lucide-react | icons | approved safe first stack |
| react-hook-form | form state | approved safe first stack |
| zod | validation schemas | approved safe first stack |
| @hookform/resolvers | form/schema integration | approved safe first stack |
| motion | animation and transitions | approved safe first stack |

## Approved Carefully Later

| Tool | Purpose | Rule |
|---|---|---|
| 21st.dev | individual UI blocks | use individual blocks only; no broad kit import or redesign |

## Research Later

| Tool | Possible Use | Status |
|---|---|---|
| Puck | visual builder/editor | research only |
| Vercel AI SDK | future AI API orchestration | research only |
| dnd-kit | section reorder/drag UI | research only |
| Recharts | dashboards/analytics | research only |

## Current Dependency Awareness

Current `package.json` already includes Supabase and Leaflet-related dependencies. Before adding more, verify whether current imports require them and whether the active phase permits map/admin work.

## Forbidden For Now

- OpenRouter/provider routing
- BYO API key storage
- automatic AI API calls
- AI vision/photo quoting
- map measuring
- website importing
- payment processors
- accounting/tax integrations
- storefront engines

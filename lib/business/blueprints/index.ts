import type { IndustryBlueprint } from "./types";
import { BLUEPRINTS } from "./registry";

export { BLUEPRINTS };
export type { IndustryBlueprint };
export type { PlannedSection, BlueprintContent } from "./types";

function matches(industry: string, blueprint: IndustryBlueprint): boolean {
  const lower = industry.toLowerCase().trim();
  if (blueprint.industryName.toLowerCase() === lower) return true;
  return blueprint.aliases.some(
    (alias) => lower.includes(alias) || alias.includes(lower)
  );
}

/** Maps a business industry string to the best matching blueprint. Falls back to contractor/handyman. */
export function getBlueprint(industry: string): IndustryBlueprint {
  if (!industry) return BLUEPRINTS[BLUEPRINTS.length - 1]; // contractor fallback

  for (const bp of BLUEPRINTS) {
    if (matches(industry, bp)) return bp;
  }

  return BLUEPRINTS[BLUEPRINTS.length - 1]; // contractor/handyman as universal default
}

/** Convenience: get blueprint by id */
export function getBlueprintById(id: string): IndustryBlueprint | undefined {
  return BLUEPRINTS.find((bp) => bp.id === id);
}

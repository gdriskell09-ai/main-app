import type { StylePackId } from "@/lib/website-engine/types";
import type { CustomModuleId } from "@/lib/business/types";

export interface PlannedSection {
  type: string;
  label: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface ExperimentalConcept {
  id: string;
  concept: string;
  description: string;
}

export interface ServiceDefault {
  icon: string;
  title: string;
  description: string;
}

export interface BlueprintContent {
  /** Template strings — use {businessName} {city} {area} {industry} as placeholders */
  heroHeadlineTemplate: string;
  heroSubheadlineTemplate: string;
  heroCtaText: string;
  heroBadgeTemplate?: string;
  servicesHeading: string;
  servicesSubheadline: string;
  /** Shown when profile has no services listed */
  defaultServices?: ServiceDefault[];
  statsDefaults: { value: string; label: string }[];
  whyReasons: { icon: string; title: string; description: string }[];
  reviewsHeading?: string;
  reviewsDefaults?: { name: string; rating: number; text: string; location?: string }[];
  faqDefaults: { question: string; answer: string }[];
  finalCtaHeading: string;
  finalCtaSubheading: string;
  finalCtaText: string;
}

export interface IndustryBlueprint {
  id: string;
  industryName: string;
  /** Lowercase strings used for fuzzy matching against profile.industry */
  aliases: string[];
  recommendedStylePacks: StylePackId[];
  /** Section type names from the existing registry — rendered in this order */
  activeSectionOrder: string[];
  /** Future sections not yet built — metadata only, never rendered */
  plannedSections: PlannedSection[];
  /** Sections that exist in the registry but are NOT in the default activeSectionOrder — surfaced as upgrade options */
  optionalPremiumSections: string[];
  /** Creative, experimental section concepts — not yet built, stored as inspiration/backlog */
  experimentalConcepts: ExperimentalConcept[];
  /** Animation and interaction ideas specific to this industry */
  animationIdeas: string[];
  /** What a business owner could provide (photo, scan, text) to personalize and upgrade their site */
  contentInputIdeas: string[];
  /** Overall visual and design direction notes — guides style choices beyond the base style pack */
  designNotes: string;
  /** Custom modules this industry should use automatically */
  recommendedCustomModules: CustomModuleId[];
  /** Key business data fields important for this industry */
  importantBusinessFields: string[];
  /** What photos/media make this industry's site shine */
  mediaNeeds: string[];
  /** Trust signals customers of this industry care about */
  trustProofNeeds: string[];
  /** How CTAs should be framed */
  ctaStrategy: string;
  /** Quote, booking, or ordering requirements */
  quoteOrBookingNeeds: string;
  /** Whether a menu, price list, or catalog is expected */
  menuOrPricingNeeds: boolean;
  /** Guidance notes for future AI content generation */
  aiPromptNotes: string;
  /** Industry-specific content used by the website renderer */
  content: BlueprintContent;
}

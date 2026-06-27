import type { StylePackId } from "@/lib/website-engine/types";

export type CustomModuleId =
  | "PressureWashRevealSection"
  | "CustomIceCreamHero"
  | "GalleryMasonry";

export type ContentSource =
  | "fallback"
  | "groq"
  | "openrouter_future"
  | "platform_ai_future"
  | "byo_key_future";

export interface GeneratedService {
  icon: string;
  title: string;
  description: string;
}

export interface GeneratedWebsiteContent {
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  services: GeneratedService[];
  whyChooseUs: { icon: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faqs: { question: string; answer: string }[];
  reviews: { name: string; rating: number; text: string; location?: string }[];
  finalCtaHeadline: string;
  finalCtaText: string;
  seoTitle: string;
  seoDescription: string;
  recommendedStylePack?: StylePackId;
  recommendedCustomModules?: CustomModuleId[];
  creativeConceptIdeas?: string[];
  plannedFutureModules?: string[];
  source: ContentSource;
  generatedAt: string;
  provider: string;
  fallbackReason?: string;
}

export interface BusinessProfile {
  id: string;
  customer_id?: string;
  businessName: string;
  industry: string;
  phone: string;
  email: string;
  serviceArea: string;
  city: string;
  brandColor: string;
  logoUrl: string;
  services: string[];
  businessDescription: string;
  preferredStylePack: StylePackId;
  desiredCustomModules: CustomModuleId[];
  websiteGoals: string;
  quoteFormNeeds: string;
  generatedContent?: GeneratedWebsiteContent;
  createdAt: string;
  updatedAt: string;
}

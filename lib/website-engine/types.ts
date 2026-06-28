export type StylePackId =
  | "clean-pro"
  | "bold-contractor"
  | "luxury-dark"
  | "premium-glass"
  | "high-energy"
  | "playful-bright"
  | "premium-minimal";

export interface StylePack {
  id: StylePackId;
  name: string;
  // Page
  pageBg: string;
  pageText: string;
  // Accent
  accent: string;
  accentHover: string;
  accentText: string;
  // Section alternating backgrounds
  sectionBgA: string;
  sectionBgB: string;
  sectionText: string;
  // Cards
  cardBg: string;
  cardBorder: string;
  cardRadius: string;
  cardShadow: string;
  // Buttons
  buttonRadius: string;
  // Headings
  headingWeight: string;
  headingColor: string;
  // Badges / tags
  badgeBg: string;
  badgeText: string;
  badgeRadius: string;
  // Muted text
  mutedText: string;
  // Animation
  animationIntensity: "low" | "medium" | "high";
  // Hero gradient overlay
  heroOverlay: string;
}

// ── Section prop interfaces ──────────────────────────────────

export interface HeroAnimatedProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaPhone?: string;
  badgeText?: string;
  heroBg?: string;
  trustBadges?: [string, string, string];
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  price?: string;
}

export interface ServicesShowcaseProps {
  heading: string;
  subheading?: string;
  services: ServiceItem[];
}

export interface Reason {
  icon: string;
  title: string;
  description: string;
}

export interface WhyChooseUsProps {
  heading: string;
  subheading?: string;
  reasons: Reason[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface AnimatedStatsProps {
  heading?: string;
  stats: StatItem[];
  dark?: boolean;
}

export interface GalleryImage {
  src?: string;
  alt: string;
  caption?: string;
  gradient?: string;
}

export interface GalleryMasonryProps {
  heading: string;
  subheading?: string;
  images: GalleryImage[];
}

export interface Review {
  name: string;
  rating: number;
  text: string;
  location?: string;
}

export interface ReviewsCarouselProps {
  heading: string;
  reviews: Review[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  heading: string;
  faqs: FAQItem[];
}

export interface FinalCTAProps {
  heading: string;
  subheading?: string;
  ctaText: string;
  ctaPhone?: string;
}

export interface FooterPremiumProps {
  businessName: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  links?: { label: string; href: string }[];
  footerCtaText?: string;
}

export interface PressureWashRevealProps {
  heading: string;
  subheading?: string;
  stats?: { value: string; label: string }[];
}

export interface CustomIceCreamHeroProps {
  businessName: string;
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaPhone?: string;
}

// ── Discriminated union of all sections ──────────────────────

export type SectionConfig =
  | { type: "HeroAnimated";              props: HeroAnimatedProps }
  | { type: "ServicesShowcase";          props: ServicesShowcaseProps }
  | { type: "WhyChooseUs";              props: WhyChooseUsProps }
  | { type: "AnimatedStats";             props: AnimatedStatsProps }
  | { type: "GalleryMasonry";           props: GalleryMasonryProps }
  | { type: "ReviewsCarousel";          props: ReviewsCarouselProps }
  | { type: "FAQAccordion";             props: FAQAccordionProps }
  | { type: "FinalCTA";                 props: FinalCTAProps }
  | { type: "FooterPremium";            props: FooterPremiumProps }
  | { type: "PressureWashRevealSection"; props: PressureWashRevealProps }
  | { type: "CustomIceCreamHero";        props: CustomIceCreamHeroProps };

export interface WebsiteConfig {
  businessName: string;
  tagline?: string;
  stylePack: StylePackId;
  sections: SectionConfig[];
}

// Props passed into every section component
export interface SectionRenderProps<T = Record<string, unknown>> {
  props: T;
  stylePack: StylePack;
  businessName: string;
}

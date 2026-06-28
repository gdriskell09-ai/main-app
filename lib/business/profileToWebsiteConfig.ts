import type { BusinessProfile, CustomModuleId } from "./types";
import type { WebsiteConfig, SectionConfig } from "@/lib/website-engine/types";
import { getBlueprint } from "./blueprints/index";
import type { IndustryBlueprint } from "./blueprints/index";

// ── Service icon lookup ───────────────────────────────────────────
// Order matters: more specific keys BEFORE broader ones.

const SERVICE_ICONS: [string, string][] = [
  // Food & beverage — specific first
  ["ice cream",   "🍦"],
  ["milkshake",   "🥤"],
  ["shake",       "🥤"],
  ["sundae",      "🍧"],
  ["parfait",     "🍧"],
  ["gelato",      "🍨"],
  ["sorbet",      "🍧"],
  ["scoop",       "🍦"],
  ["flavor",      "🍦"],
  ["cake",        "🎂"],
  ["birthday",    "🎂"],
  ["catering",    "🎉"],
  ["cater",       "🎉"],
  ["party",       "🎉"],
  ["seasonal",    "🌟"],
  ["dining",      "🍽️"],
  ["dine",        "🍽️"],
  ["menu",        "🍽️"],
  ["delivery",    "📦"],
  ["takeout",     "📦"],
  // Fitness — specific before broad
  ["strength",    "💪"],
  ["group class", "👥"],
  ["crossfit",    "🏋️"],
  ["open gym",    "🏋️"],
  ["yoga",        "🧘"],
  ["pilates",     "🧘"],
  ["gym",         "🏋️"],
  ["class",       "🏋️"],
  ["train",       "💪"],
  ["workout",     "💪"],
  ["cardio",      "🏃"],
  ["nutrition",   "🥗"],
  // Trades — specific before broad
  ["gutter",      "🏠"],
  ["paver",       "🪨"],
  ["paving",      "🪨"],
  ["concrete",    "🪨"],
  ["seal",        "🛡️"],
  ["roof",        "🏗️"],
  ["window",      "🪟"],
  ["deck",        "🪵"],
  ["fence",       "🪵"],
  ["floor",       "🪵"],
  ["carpet",      "🪵"],
  ["cabinet",     "🪵"],
  ["paint",       "🎨"],
  ["color",       "🎨"],
  ["pressure",    "💧"],
  ["wash",        "💧"],
  ["clean",       "✨"],
  ["snow",        "❄️"],
  ["lawn",        "🌿"],
  ["landscape",   "🌿"],
  ["mow",         "🌿"],
  ["irrigation",  "💧"],
  ["trim",        "✂️"],
  ["plumb",       "🔧"],
  ["drain",       "🔧"],
  ["electric",    "⚡"],
  ["hvac",        "🌡️"],
  ["heat",        "🌡️"],
  ["cool",        "❄️"],
  ["move",        "📦"],
  ["install",     "🪛"],
  ["repair",      "🔧"],
  ["inspection",  "🔍"],
];

const ICON_FALLBACKS = ["🏠", "⚙️", "🛠️", "🔨", "📐", "🧰", "🪛", "🔩", "🪚", "📋"];

function serviceIcon(label: string, index: number): string {
  const lower = label.toLowerCase();
  for (const [key, icon] of SERVICE_ICONS) {
    if (lower.includes(key)) return icon;
  }
  return ICON_FALLBACKS[index % ICON_FALLBACKS.length];
}

// ── Blueprint-aware service description ──────────────────────────

function serviceDesc(svc: string, blueprint: IndustryBlueprint): string {
  const lower = svc.toLowerCase();
  switch (blueprint.id) {
    case "ice-cream-shop":
      return `Freshly made ${lower} using quality ingredients — handcrafted daily, never frozen.`;
    case "gym-fitness":
      return `Expert ${lower} for all fitness levels — from beginners to dedicated athletes.`;
    case "personal-trainer":
      return `Personalized ${lower} designed specifically for your goals and schedule.`;
    case "pressure-washing":
      return `Professional ${lower} that restores surfaces to like-new condition — guaranteed.`;
    case "landscaping":
      return `Reliable ${lower} keeping your property looking its best season after season.`;
    case "barber-salon":
      return `Expert ${lower} from experienced stylists who know their craft inside and out.`;
    case "restaurant-cafe":
      return `Fresh, quality ${lower} made with care — available for dine-in and takeout.`;
    case "roofing":
      return `Licensed ${lower} with industry-standard materials and a full workmanship warranty.`;
    case "painting":
      return `Professional ${lower} with meticulous prep, clean execution, and spotless cleanup.`;
    case "hvac-plumbing":
      return `Fast, licensed ${lower} — diagnosed and priced up front, done right the first time.`;
    default:
      return `Quality ${lower} from licensed, experienced professionals — done right the first time.`;
  }
}

// ── Template interpolation ────────────────────────────────────────

function interp(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

// ── Industry-aware content lookup tables ──────────────────────────

const TRUST_BADGES: Record<string, [string, string, string]> = {
  "restaurant-cafe":  ["Dine In & Takeout",  "Fresh Daily",          "Local Favorite"          ],
  "barber-salon":     ["Walk-ins Welcome",    "Licensed Stylists",    "Book Anytime"            ],
  "gym-fitness":      ["Certified Coaches",   "All Fitness Levels",   "First Class Free"        ],
  "ice-cream-shop":   ["Made Fresh Daily",    "Real Ingredients",     "Local Favorite"          ],
  "personal-trainer": ["Certified Coach",     "Personalized Plans",   "Proven Results"          ],
  "pressure-washing": ["Free Quotes",         "Fully Insured",        "Satisfaction Guaranteed" ],
  "landscaping":      ["Free Estimates",      "Licensed & Insured",   "Always Reliable"         ],
  "roofing":          ["Licensed & Insured",  "Free Inspections",     "Storm Claim Experts"     ],
  "painting":         ["Licensed & Insured",  "Free Estimates",       "Satisfaction Guaranteed" ],
  "hvac-plumbing":    ["Licensed & Bonded",   "24/7 Emergency",       "Upfront Pricing"         ],
};

const GALLERY_HEADINGS: Record<string, string> = {
  "restaurant-cafe":  "Our Food & Atmosphere",
  "barber-salon":     "Our Portfolio",
  "gym-fitness":      "Our Facility",
  "ice-cream-shop":   "Flavors & Shop",
  "personal-trainer": "Client Results",
  "pressure-washing": "Before & After Results",
  "landscaping":      "Our Work",
  "roofing":          "Recent Projects",
  "painting":         "Before & After",
};

const FOOTER_CTA: Record<string, string> = {
  "restaurant-cafe":  "View Our Menu →",
  "barber-salon":     "Book an Appointment →",
  "gym-fitness":      "Claim Free Trial →",
  "ice-cream-shop":   "See Today's Flavors →",
  "personal-trainer": "Book Free Consultation →",
};

// ── Custom module gating ──────────────────────────────────────────

const CUSTOM_MODULE_IDS = new Set<string>([
  "CustomIceCreamHero",
  "PressureWashRevealSection",
  "GalleryMasonry",
]);

function shouldInclude(
  sectionType: string,
  profile: BusinessProfile,
  blueprint: IndustryBlueprint
): boolean {
  if (!CUSTOM_MODULE_IDS.has(sectionType)) return true;
  const id = sectionType as CustomModuleId;
  return (
    profile.desiredCustomModules.includes(id) ||
    blueprint.recommendedCustomModules.includes(id)
  );
}

// ── Section builders ──────────────────────────────────────────────

type Vars = Record<string, string>;

function buildSection(
  type: string,
  profile: BusinessProfile,
  blueprint: IndustryBlueprint,
  vars: Vars
): SectionConfig | null {
  const { content } = blueprint;
  const { businessName, area } = vars;
  const phone = profile.phone || undefined;

  function t(s: string) {
    return interp(s, vars);
  }

  const gc = profile.generatedContent;

  switch (type) {
    // ── Hero variants ───────────────────────────────────────────
    case "HeroAnimated":
      return {
        type: "HeroAnimated",
        props: {
          headline:    gc?.heroHeadline    || profile.businessDescription || t(content.heroHeadlineTemplate),
          subheadline: gc?.heroSubheadline || t(content.heroSubheadlineTemplate),
          ctaText:     gc?.heroCtaText     || content.heroCtaText,
          ctaPhone:    phone,
          badgeText:   content.heroBadgeTemplate
            ? t(content.heroBadgeTemplate)
            : `Serving ${area} · Licensed & Insured`,
          trustBadges: TRUST_BADGES[blueprint.id] ?? ["Free Quotes", "Fully Insured", "Satisfaction Guaranteed"],
        },
      };

    case "CustomIceCreamHero":
      return {
        type: "CustomIceCreamHero",
        props: {
          businessName,
          headline:    gc?.heroHeadline    || profile.businessDescription || t(content.heroHeadlineTemplate),
          subheadline: gc?.heroSubheadline || t(content.heroSubheadlineTemplate),
          ctaText:     gc?.heroCtaText     || content.heroCtaText,
          ctaPhone:    phone,
        },
      };

    // ── Stats ───────────────────────────────────────────────────
    case "AnimatedStats":
      return {
        type: "AnimatedStats",
        props: {
          dark:  true,
          stats: gc?.stats ?? content.statsDefaults,
        },
      };

    // ── Services ────────────────────────────────────────────────
    case "ServicesShowcase": {
      const services =
        (gc?.services && gc.services.length > 0)
          ? gc.services
          : profile.services.length > 0
            ? profile.services.map((svc, i) => ({
                icon:        serviceIcon(svc, i),
                title:       svc,
                description: serviceDesc(svc, blueprint),
              }))
            : content.defaultServices ?? null;

      if (!services || services.length === 0) return null;

      return {
        type: "ServicesShowcase",
        props: {
          heading:    content.servicesHeading,
          subheading: t(content.servicesSubheadline),
          services,
        },
      };
    }

    // ── Custom reveal ───────────────────────────────────────────
    case "PressureWashRevealSection":
      return {
        type: "PressureWashRevealSection",
        props: {
          heading:    "See the Before & After",
          subheading: profile.websiteGoals || t(content.heroSubheadlineTemplate),
          stats: [
            { value: "100%",     label: "Done right first time" },
            { value: "Same day", label: "Quote turnaround"      },
            { value: "0%",       label: "Surface damage rate"   },
          ],
        },
      };

    // ── Gallery ─────────────────────────────────────────────────
    case "GalleryMasonry":
      return {
        type: "GalleryMasonry",
        props: {
          heading: GALLERY_HEADINGS[blueprint.id] ?? "Our Work",
          images: [
            { gradient: "linear-gradient(135deg,#334155,#475569)", alt: "Project 1" },
            { gradient: "linear-gradient(135deg,#1e293b,#334155)", alt: "Project 2" },
            { gradient: "linear-gradient(135deg,#0f172a,#1e293b)", alt: "Project 3" },
            { gradient: "linear-gradient(135deg,#374151,#4b5563)", alt: "Project 4" },
            { gradient: "linear-gradient(135deg,#1f2937,#374151)", alt: "Project 5" },
            { gradient: "linear-gradient(135deg,#111827,#1f2937)", alt: "Project 6" },
          ],
        },
      };

    // ── Why choose us ───────────────────────────────────────────
    case "WhyChooseUs":
      return {
        type: "WhyChooseUs",
        props: {
          heading: `Why Choose ${businessName}?`,
          reasons: gc?.whyChooseUs ?? content.whyReasons.map((r) => ({
            ...r,
            description: t(r.description),
          })),
        },
      };

    // ── Reviews ─────────────────────────────────────────────────
    case "ReviewsCarousel": {
      const city = vars.city;
      return {
        type: "ReviewsCarousel",
        props: {
          heading: content.reviewsHeading ?? "What Our Customers Say",
          reviews: gc?.reviews ?? content.reviewsDefaults ?? [
            { name: "Sarah M.", rating: 5, text: `${businessName} did an amazing job. Highly recommend to anyone in ${city}.`, location: city },
            { name: "James T.", rating: 5, text: "Professional, on time, and the results speak for themselves. Worth every penny.", location: area },
            { name: "Linda R.", rating: 5, text: "I've tried other companies and none come close. This is the only one I'll call.", location: city },
          ],
        },
      };
    }

    // ── FAQ ─────────────────────────────────────────────────────
    case "FAQAccordion":
      return {
        type: "FAQAccordion",
        props: {
          heading: "Frequently Asked Questions",
          faqs: gc?.faqs ?? content.faqDefaults.map((faq) => ({
            ...faq,
            answer: t(faq.answer),
          })),
        },
      };

    // ── Final CTA ───────────────────────────────────────────────
    case "FinalCTA":
      return {
        type: "FinalCTA",
        props: {
          heading:    gc?.finalCtaHeadline ?? t(content.finalCtaHeading),
          subheading: t(content.finalCtaSubheading),
          ctaText:    gc?.finalCtaText ?? content.finalCtaText,
          ctaPhone:   phone,
        },
      };

    // ── Footer ──────────────────────────────────────────────────
    case "FooterPremium":
      return {
        type: "FooterPremium",
        props: {
          businessName,
          tagline: `Serving ${area}`,
          phone,
          email:        profile.email || undefined,
          address:      vars.city     || undefined,
          footerCtaText: FOOTER_CTA[blueprint.id] ?? "Get a Free Quote →",
          links: [
            { label: "Services", href: "#" },
            { label: "Reviews",  href: "#" },
            { label: "Contact",  href: "#" },
          ],
        },
      };

    default:
      // Unknown or not-yet-built section type — skip gracefully
      return null;
  }
}

// ── Main export ───────────────────────────────────────────────────

export function profileToWebsiteConfig(profile: BusinessProfile): WebsiteConfig {
  const blueprint = getBlueprint(profile.industry);

  const city  = profile.city        || "";
  const area  = profile.serviceArea || city || "your area";
  const vars: Vars = {
    businessName: profile.businessName,
    city,
    area,
    industry: profile.industry || blueprint.industryName,
    phone:    profile.phone    || "the number above",
  };

  const sections: SectionConfig[] = [];

  for (const sectionType of blueprint.activeSectionOrder) {
    if (!shouldInclude(sectionType, profile, blueprint)) continue;

    const section = buildSection(sectionType, profile, blueprint, vars);
    if (section) sections.push(section);
  }

  // Always guarantee a footer exists
  if (!sections.some((s) => s.type === "FooterPremium")) {
    const footer = buildSection("FooterPremium", profile, blueprint, vars);
    if (footer) sections.push(footer);
  }

  return {
    businessName: profile.businessName,
    tagline:      `Serving ${area}`,
    stylePack:    profile.preferredStylePack,
    sections,
  };
}

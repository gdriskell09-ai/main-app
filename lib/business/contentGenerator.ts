import type { BusinessProfile, GeneratedWebsiteContent } from "./types";
import { getBlueprint } from "./blueprints/index";
import type { IndustryBlueprint } from "./blueprints/index";

// ── Icon lookup (specific before broad) ──────────────────────────
const SERVICE_ICONS: [string, string][] = [
  ["ice cream",   "🍦"], ["milkshake",   "🥤"], ["shake",       "🥤"],
  ["sundae",      "🍧"], ["parfait",     "🍧"], ["gelato",      "🍨"],
  ["sorbet",      "🍧"], ["scoop",       "🍦"], ["flavor",      "🍦"],
  ["cake",        "🎂"], ["birthday",    "🎂"], ["catering",    "🎉"],
  ["cater",       "🎉"], ["party",       "🎉"], ["seasonal",    "🌟"],
  ["dining",      "🍽️"], ["dine",        "🍽️"], ["menu",        "🍽️"],
  ["delivery",    "📦"], ["takeout",     "📦"],
  ["strength",    "💪"], ["group class", "👥"], ["crossfit",    "🏋️"],
  ["open gym",    "🏋️"], ["yoga",        "🧘"], ["pilates",     "🧘"],
  ["gym",         "🏋️"], ["class",       "🏋️"], ["train",       "💪"],
  ["workout",     "💪"], ["cardio",      "🏃"], ["nutrition",   "🥗"],
  ["gutter",      "🏠"], ["paver",       "🪨"], ["paving",      "🪨"],
  ["concrete",    "🪨"], ["seal",        "🛡️"], ["roof",        "🏗️"],
  ["window",      "🪟"], ["deck",        "🪵"], ["fence",       "🪵"],
  ["floor",       "🪵"], ["carpet",      "🪵"], ["cabinet",     "🪵"],
  ["paint",       "🎨"], ["color",       "🎨"],
  ["pressure",    "💧"], ["wash",        "💧"], ["clean",       "✨"],
  ["snow",        "❄️"], ["lawn",        "🌿"], ["landscape",   "🌿"],
  ["mow",         "🌿"], ["irrigation",  "💧"], ["trim",        "✂️"],
  ["plumb",       "🔧"], ["drain",       "🔧"], ["electric",    "⚡"],
  ["hvac",        "🌡️"], ["heat",        "🌡️"], ["cool",        "❄️"],
  ["move",        "📦"], ["install",     "🪛"], ["repair",      "🔧"],
  ["inspect",     "🔍"],
];

const ICON_FALLBACKS = ["🏠", "⚙️", "🛠️", "🔨", "📐", "🧰", "🪛", "🔩", "🪚", "📋"];

function serviceIcon(label: string, index: number): string {
  const lower = label.toLowerCase();
  for (const [key, icon] of SERVICE_ICONS) {
    if (lower.includes(key)) return icon;
  }
  return ICON_FALLBACKS[index % ICON_FALLBACKS.length];
}

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

// ── Main generator ────────────────────────────────────────────────

export function generateFallbackContent(profile: BusinessProfile): GeneratedWebsiteContent {
  const blueprint = getBlueprint(profile.industry);
  const { content } = blueprint;

  const city = profile.city || "";
  const area = profile.serviceArea || city || "your area";
  const vars: Record<string, string> = {
    businessName: profile.businessName,
    city,
    area,
    industry: profile.industry || blueprint.industryName,
    phone: profile.phone || "the number above",
  };

  function t(s: string) {
    return interp(s, vars);
  }

  const services =
    profile.services.length > 0
      ? profile.services.map((svc, i) => ({
          icon: serviceIcon(svc, i),
          title: svc,
          description: serviceDesc(svc, blueprint),
        }))
      : (content.defaultServices ?? []);

  const reviews = content.reviewsDefaults ?? [
    {
      name: "Sarah M.",
      rating: 5,
      text: `${profile.businessName} did an amazing job. Highly recommend to anyone in ${city}.`,
      location: city,
    },
    {
      name: "James T.",
      rating: 5,
      text: "Professional, on time, and the results speak for themselves. Worth every penny.",
      location: area,
    },
    {
      name: "Linda R.",
      rating: 5,
      text: "I've tried other companies and none come close. This is the only one I'll call.",
      location: city,
    },
  ];

  return {
    heroHeadline:
      profile.businessDescription || t(content.heroHeadlineTemplate),
    heroSubheadline: t(content.heroSubheadlineTemplate),
    heroCtaText: content.heroCtaText,
    services,
    whyChooseUs: content.whyReasons.map((r) => ({
      ...r,
      description: t(r.description),
    })),
    stats: content.statsDefaults,
    faqs: content.faqDefaults.map((faq) => ({
      ...faq,
      answer: t(faq.answer),
    })),
    reviews,
    finalCtaHeadline: t(content.finalCtaHeading),
    finalCtaText: content.finalCtaText,
    seoTitle: `${profile.businessName} — ${blueprint.industryName} in ${city || "Your Area"}`,
    seoDescription: `${profile.businessName} offers professional ${blueprint.industryName.toLowerCase()} services in ${area}. ${t(content.heroSubheadlineTemplate)}`.slice(0, 160),
    recommendedStylePack: blueprint.recommendedStylePacks[0],
    recommendedCustomModules: blueprint.recommendedCustomModules,
    creativeConceptIdeas: blueprint.animationIdeas,
    plannedFutureModules: blueprint.plannedSections.map((s) => s.type),
    source: "fallback",
    generatedAt: new Date().toISOString(),
    provider: "blueprint",
    fallbackReason: "No AI provider configured — using blueprint defaults.",
  };
}

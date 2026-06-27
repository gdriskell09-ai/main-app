"use client";

import type { WebsiteConfig, StylePack, SectionConfig } from "@/lib/website-engine/types";
import { getStylePack } from "@/lib/website-engine/stylePacks";

import HeroAnimated from "./sections/HeroAnimated";
import ServicesShowcase from "./sections/ServicesShowcase";
import WhyChooseUs from "./sections/WhyChooseUs";
import AnimatedStats from "./sections/AnimatedStats";
import GalleryMasonry from "./sections/GalleryMasonry";
import ReviewsCarousel from "./sections/ReviewsCarousel";
import FAQAccordion from "./sections/FAQAccordion";
import FinalCTA from "./sections/FinalCTA";
import FooterPremium from "./sections/FooterPremium";
import PressureWashRevealSection from "./sections/PressureWashRevealSection";
import CustomIceCreamHero from "./sections/CustomIceCreamHero";

// ── Engine-wide CSS animations (injected once, isolated to .we-* namespace) ──

const ENGINE_STYLES = `
  /* ── Core animations ── */
  @keyframes we-fadeUp {
    from { opacity: 0; transform: translateY(26px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes we-float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-14px) rotate(2deg); }
  }
  @keyframes we-orbDrift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(22px, -16px) scale(1.05); }
    66%       { transform: translate(-14px, 12px) scale(0.96); }
  }
  @keyframes we-slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes we-dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes we-shimmer {
    from { transform: translateX(-100%) skewX(-12deg); }
    to   { transform: translateX(240%) skewX(-12deg); }
  }
  @keyframes we-scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* ── Animation utility classes ── */
  .we-fade-up  { animation: we-fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
  .we-d1       { animation-delay: 0.10s; }
  .we-d2       { animation-delay: 0.22s; }
  .we-d3       { animation-delay: 0.34s; }
  .we-d4       { animation-delay: 0.46s; }

  /* ── Mobile base resets for the engine ── */
  @media (max-width: 640px) {
    /* Hero trust-row stacks vertically */
    .we-hero-trust { flex-direction: column !important; gap: 10px !important; }
    /* Section padding reduced */
    .we-section { padding-left: 16px !important; padding-right: 16px !important; }
  }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .we-fade-up, .we-d1, .we-d2, .we-d3, .we-d4 {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
  }
`;

// ── Section registry — maps type string → component ──────────

type AnyProps = Record<string, unknown>;
type AnySectionComponent = React.ComponentType<{
  props: AnyProps;
  stylePack: StylePack;
  businessName: string;
}>;

function reg<T>(c: React.ComponentType<T>): AnySectionComponent {
  return c as unknown as AnySectionComponent;
}

const REGISTRY: Record<string, AnySectionComponent> = {
  HeroAnimated:              reg(HeroAnimated),
  ServicesShowcase:          reg(ServicesShowcase),
  WhyChooseUs:               reg(WhyChooseUs),
  AnimatedStats:             reg(AnimatedStats),
  GalleryMasonry:            reg(GalleryMasonry),
  ReviewsCarousel:           reg(ReviewsCarousel),
  FAQAccordion:              reg(FAQAccordion),
  FinalCTA:                  reg(FinalCTA),
  FooterPremium:             reg(FooterPremium),
  PressureWashRevealSection: reg(PressureWashRevealSection),
  CustomIceCreamHero:        reg(CustomIceCreamHero),
};

// ── WebsiteRenderer ──────────────────────────────────────────

interface Props {
  config: WebsiteConfig;
}

export default function WebsiteRenderer({ config }: Props) {
  const stylePack = getStylePack(config.stylePack);

  return (
    <div
      style={{
        background: stylePack.pageBg,
        color: stylePack.pageText,
        minHeight: "100vh",
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Inject engine animations once */}
      <style dangerouslySetInnerHTML={{ __html: ENGINE_STYLES }} />

      {config.sections.map((section: SectionConfig, i: number) => {
        const Component = REGISTRY[section.type];

        if (!Component) {
          return (
            <div
              key={i}
              style={{
                padding: "32px 24px",
                background: "#fef9c3",
                borderLeft: "4px solid #eab308",
                fontFamily: "monospace",
                fontSize: "13px",
                color: "#713f12",
              }}
            >
              ⚠️ Unknown section type: <strong>{section.type}</strong>
              <br />
              Register it in{" "}
              <code>app/components/website-engine/WebsiteRenderer.tsx</code>
            </div>
          );
        }

        return (
          <Component
            key={i}
            props={section.props as unknown as AnyProps}
            stylePack={stylePack}
            businessName={config.businessName}
          />
        );
      })}
    </div>
  );
}

// ── How to add a new module ───────────────────────────────────
//
//  1. Create the component:
//     app/components/website-engine/sections/MyCustomSection.tsx
//     It must accept: { props: YourPropsType, stylePack: StylePack, businessName: string }
//
//  2. Add prop types to lib/website-engine/types.ts:
//     export interface MyCustomSectionProps { ... }
//     Add to SectionConfig union: { type: "MyCustomSection"; props: MyCustomSectionProps }
//
//  3. Import and register here:
//     import MyCustomSection from "./sections/MyCustomSection";
//     REGISTRY["MyCustomSection"] = MyCustomSection as AnySectionComponent;
//
//  4. Add sample data in lib/website-engine/sampleData.ts to test.
//
//  That's it — it's live across all websites that include it in their section array.

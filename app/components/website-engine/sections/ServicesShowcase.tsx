"use client";

import type { SectionRenderProps, ServicesShowcaseProps } from "@/lib/website-engine/types";

export default function ServicesShowcase({
  props,
  stylePack,
}: SectionRenderProps<ServicesShowcaseProps>) {
  const { heading, subheading, services } = props;

  return (
    <section style={{ background: stylePack.sectionBgA, padding: "88px 24px" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: stylePack.headingWeight,
              color: stylePack.headingColor,
              letterSpacing: "-0.025em",
              margin: "0 0 16px",
            }}
          >
            {heading}
          </h2>
          {subheading && (
            <p
              style={{
                fontSize: "17px",
                color: stylePack.mutedText,
                maxWidth: "520px",
                margin: "0 auto",
                lineHeight: 1.65,
              }}
            >
              {subheading}
            </p>
          )}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {services.map((svc, i) => (
            <div
              key={i}
              style={{
                background: stylePack.cardBg,
                border: stylePack.cardBorder,
                borderRadius: stylePack.cardRadius,
                boxShadow: stylePack.cardShadow,
                overflow: "hidden",
                position: "relative",
                transition: "transform 0.22s ease, box-shadow 0.22s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-5px)";
                el.style.boxShadow = `0 20px 48px rgba(0,0,0,0.13)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = stylePack.cardShadow;
              }}
            >
              {/* Premium accent stripe at top */}
              <div
                style={{
                  height: "3px",
                  background: `linear-gradient(90deg, ${stylePack.accent}, ${stylePack.accentHover})`,
                }}
              />

              <div style={{ padding: "26px 26px 24px" }}>
                {/* Icon */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: stylePack.badgeBg,
                    fontSize: "26px",
                    marginBottom: "18px",
                  }}
                >
                  {svc.icon}
                </div>

                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: stylePack.headingColor,
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                  }}
                >
                  {svc.title}
                </h3>

                <p
                  style={{
                    fontSize: "14px",
                    color: stylePack.mutedText,
                    lineHeight: 1.68,
                    margin: "0 0 18px",
                  }}
                >
                  {svc.description}
                </p>

                {svc.price && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: stylePack.badgeBg,
                      color: stylePack.badgeText,
                      borderRadius: stylePack.badgeRadius,
                      padding: "5px 14px",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {svc.price}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

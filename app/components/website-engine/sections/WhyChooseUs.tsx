"use client";

import type { SectionRenderProps, WhyChooseUsProps } from "@/lib/website-engine/types";

export default function WhyChooseUs({
  props,
  stylePack,
}: SectionRenderProps<WhyChooseUsProps>) {
  const { heading, subheading, reasons } = props;

  return (
    <section style={{ background: stylePack.sectionBgB, padding: "88px 24px" }}>
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
                maxWidth: "500px",
                margin: "0 auto",
                lineHeight: 1.65,
              }}
            >
              {subheading}
            </p>
          )}
        </div>

        {/* Reason cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {reasons.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                padding: "24px",
                background: stylePack.cardBg,
                border: stylePack.cardBorder,
                borderRadius: stylePack.cardRadius,
                boxShadow: stylePack.cardShadow,
                transition: "transform 0.22s ease, box-shadow 0.22s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = `0 14px 36px rgba(0,0,0,0.10)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = stylePack.cardShadow;
              }}
            >
              {/* Icon — accent-tinted circle */}
              <div
                style={{
                  flexShrink: 0,
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: `linear-gradient(135deg, ${stylePack.accent}20, ${stylePack.accent}08)`,
                  border: `1px solid ${stylePack.accent}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  lineHeight: 1,
                }}
              >
                {r.icon}
              </div>

              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: stylePack.headingColor,
                    margin: "0 0 7px",
                    lineHeight: 1.3,
                  }}
                >
                  {r.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: stylePack.mutedText,
                    lineHeight: 1.68,
                    margin: 0,
                  }}
                >
                  {r.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

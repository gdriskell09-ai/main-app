"use client";

import type { SectionRenderProps, FinalCTAProps } from "@/lib/website-engine/types";

export default function FinalCTA({
  props,
  stylePack,
}: SectionRenderProps<FinalCTAProps>) {
  const { heading, subheading, ctaText, ctaPhone } = props;

  return (
    <section
      style={{
        background: stylePack.heroOverlay,
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative orb */}
      <div
        style={{
          position: "absolute",
          top: "-40%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${stylePack.accent}30 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: stylePack.headingWeight,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: "0 0 20px",
          }}
        >
          {heading}
        </h2>

        {subheading && (
          <p
            style={{
              fontSize: "17px",
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.65,
              margin: "0 0 44px",
            }}
          >
            {subheading}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            style={{
              background: stylePack.accent,
              color: stylePack.accentText,
              border: "none",
              borderRadius: stylePack.buttonRadius,
              padding: "18px 44px",
              fontSize: "17px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 32px ${stylePack.accent}55`,
              transition: "transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = stylePack.accentHover;
              el.style.transform = "translateY(-3px)";
              el.style.boxShadow = `0 10px 44px ${stylePack.accent}77`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = stylePack.accent;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = `0 4px 32px ${stylePack.accent}55`;
            }}
          >
            {ctaText} →
          </button>

          {ctaPhone && (
            <a
              href={`tel:${ctaPhone.replace(/\D/g, "")}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  backdropFilter: "blur(8px)",
                }}
              >
                📞
              </span>
              {ctaPhone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

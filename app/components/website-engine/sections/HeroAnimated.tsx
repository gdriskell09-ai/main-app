"use client";

import type { SectionRenderProps, HeroAnimatedProps } from "@/lib/website-engine/types";

export default function HeroAnimated({
  props,
  stylePack,
}: SectionRenderProps<HeroAnimatedProps>) {
  const { headline, subheadline, ctaText, ctaPhone, badgeText, heroBg } = props;

  return (
    <section
      style={{
        background: heroBg ?? stylePack.heroOverlay,
        backgroundSize: "200% 200%",
        color: "#fff",
        padding: "clamp(80px, 12vw, 140px) 24px clamp(80px, 10vw, 120px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blurred orbs */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${stylePack.accent}55 0%, transparent 70%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
          animation: "we-orbDrift 14s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-8%",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
          animation: "we-orbDrift 18s ease-in-out infinite reverse",
        }}
      />

      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {badgeText && (
          <div
            className="we-fade-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "9999px",
              padding: "8px 20px",
              marginBottom: "32px",
              fontSize: "13px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ color: stylePack.accent, fontSize: "14px" }}>★</span>
            {badgeText}
          </div>
        )}

        <h1
          className="we-fade-up we-d1"
          style={{
            fontSize: "clamp(38px, 7vw, 74px)",
            fontWeight: stylePack.headingWeight,
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            marginBottom: "24px",
            color: "#ffffff",
          }}
        >
          {headline}
        </h1>

        <p
          className="we-fade-up we-d2"
          style={{
            fontSize: "clamp(16px, 2.2vw, 20px)",
            lineHeight: 1.65,
            color: "rgba(255,255,255,0.76)",
            maxWidth: "600px",
            margin: "0 auto 44px",
          }}
        >
          {subheadline}
        </p>

        <div
          className="we-fade-up we-d3"
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
              padding: "16px 38px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 28px ${stylePack.accent}55`,
              transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = stylePack.accentHover;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 36px ${stylePack.accent}66`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = stylePack.accent;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 28px ${stylePack.accent}55`;
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
                gap: "8px",
                color: "rgba(255,255,255,0.88)",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: 600,
                transition: "color 0.18s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color =
                  "rgba(255,255,255,0.88)")
              }
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.14)",
                  fontSize: "15px",
                }}
              >
                📞
              </span>
              {ctaPhone}
            </a>
          )}
        </div>

        {/* Trust micro-row */}
        <div
          className="we-fade-up we-d4"
          style={{
            display: "flex",
            gap: "24px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "52px",
            paddingTop: "28px",
            borderTop: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {["Free Quotes", "Fully Insured", "Satisfaction Guaranteed"].map((t) => (
            <span
              key={t}
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.65)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: stylePack.accent }}>✓</span> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

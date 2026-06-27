"use client";

import type {
  SectionRenderProps,
  CustomIceCreamHeroProps,
} from "@/lib/website-engine/types";

const SPRINKLES = [
  { emoji: "🍦", top: "12%", left: "8%",  size: 42, delay: 0,    dur: 3.2 },
  { emoji: "🍭", top: "18%", left: "88%", size: 36, delay: 0.6,  dur: 4.0 },
  { emoji: "🌈", top: "6%",  left: "55%", size: 28, delay: 1.1,  dur: 3.6 },
  { emoji: "✨", top: "70%", left: "5%",  size: 24, delay: 0.3,  dur: 2.8 },
  { emoji: "🍓", top: "75%", left: "92%", size: 30, delay: 0.9,  dur: 3.4 },
  { emoji: "🌸", top: "45%", left: "3%",  size: 26, delay: 1.4,  dur: 4.2 },
  { emoji: "🍬", top: "55%", left: "95%", size: 28, delay: 0.5,  dur: 3.8 },
  { emoji: "⭐", top: "85%", left: "48%", size: 22, delay: 1.8,  dur: 3.0 },
];

export default function CustomIceCreamHero({
  props,
  stylePack,
}: SectionRenderProps<CustomIceCreamHeroProps>) {
  const { businessName, headline, subheadline, ctaText, ctaPhone } = props;

  const heroBg =
    stylePack.id === "playful-bright"
      ? "linear-gradient(160deg, #ff9a9e 0%, #ffecd2 35%, #fcb69f 65%, #ff9a9e 100%)"
      : stylePack.heroOverlay;

  const isPlayful = stylePack.id === "playful-bright";

  return (
    <section
      style={{
        background: heroBg,
        backgroundSize: "300% 300%",
        animation: "we-gradPulse 8s ease-in-out infinite",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "80px 24px",
      }}
    >
      {/* Floating sprinkles */}
      {SPRINKLES.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            fontSize: `${s.size}px`,
            animation: `we-float ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            pointerEvents: "none",
            userSelect: "none",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
          }}
        >
          {s.emoji}
        </div>
      ))}

      {/* Soft blobs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.25)",
          filter: "blur(60px)",
          pointerEvents: "none",
          animation: "we-orbDrift 10s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "10%",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "rgba(255,200,220,0.30)",
          filter: "blur(50px)",
          pointerEvents: "none",
          animation: "we-orbDrift 14s ease-in-out infinite reverse",
        }}
      />

      <div
        style={{
          maxWidth: "720px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Business name badge */}
        <div
          className="we-fade-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(12px)",
            border: "1.5px solid rgba(255,255,255,0.75)",
            borderRadius: "9999px",
            padding: "8px 22px",
            marginBottom: "28px",
            fontSize: "14px",
            fontWeight: 700,
            color: isPlayful ? "#be123c" : "#fff",
          }}
        >
          <span style={{ fontSize: "18px" }}>🍦</span>
          {businessName}
        </div>

        <h1
          className="we-fade-up we-d1"
          style={{
            fontSize: "clamp(44px, 8vw, 88px)",
            fontWeight: isPlayful ? 900 : stylePack.headingWeight,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            color: isPlayful ? "#1c0f08" : "#ffffff",
            margin: "0 0 24px",
          }}
        >
          {headline}
        </h1>

        {subheadline && (
          <p
            className="we-fade-up we-d2"
            style={{
              fontSize: "18px",
              lineHeight: 1.65,
              color: isPlayful ? "#6b2737" : "rgba(255,255,255,0.82)",
              maxWidth: "540px",
              margin: "0 auto 44px",
            }}
          >
            {subheadline}
          </p>
        )}

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
              background: isPlayful ? "#f43f5e" : stylePack.accent,
              color: "#fff",
              border: "none",
              borderRadius: "9999px",
              padding: "18px 44px",
              fontSize: "17px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 6px 32px rgba(244,63,94,0.45)",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.transform = "translateY(-3px) scale(1.03)";
              el.style.boxShadow = "0 12px 40px rgba(244,63,94,0.55)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.transform = "translateY(0) scale(1)";
              el.style.boxShadow = "0 6px 32px rgba(244,63,94,0.45)";
            }}
          >
            {ctaText} 🍦
          </button>

          {ctaPhone && (
            <a
              href={`tel:${ctaPhone.replace(/\D/g, "")}`}
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: isPlayful ? "#1c0f08" : "rgba(255,255,255,0.88)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.35)",
                backdropFilter: "blur(8px)",
                borderRadius: "9999px",
                padding: "14px 24px",
                border: "1.5px solid rgba(255,255,255,0.6)",
              }}
            >
              📞 {ctaPhone}
            </a>
          )}
        </div>

        {/* Fun flavor tags */}
        <div
          className="we-fade-up we-d4"
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "44px",
          }}
        >
          {[
            "🍓 Strawberry",
            "🍫 Dark Chocolate",
            "🍋 Lemon Sorbet",
            "🥜 PB Cookie",
            "🌿 Mint Chip",
          ].map((f) => (
            <span
              key={f}
              style={{
                background: "rgba(255,255,255,0.50)",
                backdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255,255,255,0.70)",
                borderRadius: "9999px",
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: 700,
                color: isPlayful ? "#7c3f4f" : "rgba(255,255,255,0.9)",
                cursor: "default",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes we-gradPulse {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}

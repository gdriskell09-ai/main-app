"use client";

import { useEffect, useRef, useState } from "react";
import type {
  SectionRenderProps,
  PressureWashRevealProps,
} from "@/lib/website-engine/types";

export default function PressureWashRevealSection({
  props,
  stylePack,
}: SectionRenderProps<PressureWashRevealProps>) {
  const { heading, subheading, stats } = props;
  const [revealed, setRevealed] = useState(false);
  const [spraying, setSpraying] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setSpraying(true), 200);
          setTimeout(() => setRevealed(true), 900);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isLuxury = stylePack.id === "luxury-dark" || stylePack.id === "high-energy";
  const sectionBg = isLuxury
    ? "linear-gradient(160deg, #080c14 0%, #0e1620 100%)"
    : "linear-gradient(160deg, #0f1e30 0%, #1a3050 100%)";

  return (
    <section
      ref={sectionRef}
      style={{
        background: sectionBg,
        padding: "96px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* Spray beam that sweeps across */}
      {spraying && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20%",
              bottom: "-20%",
              width: "120px",
              background: `linear-gradient(90deg, transparent 0%, ${stylePack.accent}44 40%, ${stylePack.accent}88 50%, ${stylePack.accent}44 60%, transparent 100%)`,
              filter: "blur(8px)",
              animation: "we-washBeam 1.2s cubic-bezier(0.25,1,0.5,1) both",
            }}
          />
        </div>
      )}

      {/* Water droplets / shimmer dots */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: `${stylePack.accent}88`,
            top: `${10 + (i * 7) % 80}%`,
            left: `${5 + (i * 8) % 90}%`,
            animation: `we-droplet ${1.2 + (i % 5) * 0.3}s ease-in-out infinite`,
            animationDelay: `${(i * 0.18) % 1.5}s`,
            opacity: 0,
          }}
        />
      ))}

      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center",
        }}
        className="we-pw-grid"
      >
        {/* Left: Before/After visual */}
        <div style={{ position: "relative" }}>
          {/* "Before" surface */}
          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              aspectRatio: "4/3",
              position: "relative",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            {/* Dirty / before */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, #2a2a2a 0%, #3d3730 50%, #1f1f1f 100%)",
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 8px)",
              }}
            />
            {/* Grime texture overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 30% 40%, rgba(80,60,20,0.5) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(40,30,10,0.4) 0%, transparent 50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Before
            </div>

            {/* "After" — revealed with clip animation */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, #d4f1d4 0%, #eafaea 40%, #c8e8e8 100%)",
                clipPath: revealed ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 1.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {/* Clean concrete grid */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              {/* Wet shine */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: `${stylePack.accent}dd`,
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                After ✓
              </div>
            </div>

            {/* Moving divider line */}
            {spraying && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  background: `linear-gradient(to bottom, transparent, ${stylePack.accent}, transparent)`,
                  left: revealed ? "100%" : "0%",
                  transition: "left 1.4s cubic-bezier(0.16,1,0.3,1)",
                  pointerEvents: "none",
                  boxShadow: `0 0 12px ${stylePack.accent}`,
                }}
              />
            )}
          </div>
        </div>

        {/* Right: Text */}
        <div>
          <h2
            style={{
              fontSize: "clamp(26px, 3.5vw, 40px)",
              fontWeight: stylePack.headingWeight,
              color: "#ffffff",
              letterSpacing: "-0.025em",
              margin: "0 0 18px",
              lineHeight: 1.15,
            }}
          >
            {heading}
          </h2>
          {subheading && (
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.62)",
                lineHeight: 1.7,
                margin: "0 0 36px",
              }}
            >
              {subheading}
            </p>
          )}

          {stats && stats.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${stylePack.accent}33`,
                    borderRadius: "12px",
                    padding: "16px 20px",
                    flex: "1 1 120px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 900,
                      color: stylePack.accent,
                      marginBottom: "4px",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .we-pw-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
        @keyframes we-washBeam {
          from { left: -120px; opacity: 0.8; }
          to { left: 110%; opacity: 0; }
        }
        @keyframes we-droplet {
          0%, 100% { opacity: 0; transform: translateY(0) scale(1); }
          20% { opacity: 1; }
          60% { opacity: 0.6; transform: translateY(-12px) scale(1.4); }
          80% { opacity: 0; transform: translateY(-18px) scale(0.8); }
        }
      `}</style>
    </section>
  );
}

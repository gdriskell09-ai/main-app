"use client";

import { useEffect, useRef, useState } from "react";
import type { SectionRenderProps, AnimatedStatsProps } from "@/lib/website-engine/types";

// Returns float value so callers can choose integer vs decimal display
function useCountUp(target: number, duration: number, active: boolean): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || target === 0) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(eased * target);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(target); // ensure exact final value
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return value;
}

// "1,200+" → { num: 1200, suffix: "+", hasDecimal: false }
// "4.9★"  → { num: 4.9,  suffix: "★", hasDecimal: true  }
// "8 yrs" → { num: 8,    suffix: " yrs", hasDecimal: false }
function parseStatValue(value: string) {
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/^(\d+(?:\.\d+)?)(.*)/);
  if (!match) return { num: null, suffix: value, hasDecimal: false };
  return {
    num: parseFloat(match[1]),
    suffix: match[2],
    hasDecimal: match[1].includes("."),
  };
}

function StatItem({
  value,
  label,
  accent,
  mutedText,
  bgColor,
  borderColor,
}: {
  value: string;
  label: string;
  accent: string;
  mutedText: string;
  bgColor: string;
  borderColor: string;
}) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { num, suffix, hasDecimal } = parseStatValue(value);
  const counted = useCountUp(num ?? 0, 1700, active && num !== null);

  let displayVal: string;
  if (num === null) {
    displayVal = value;
  } else if (hasDecimal) {
    displayVal = counted.toFixed(1) + suffix;
  } else {
    displayVal = Math.round(counted).toLocaleString() + suffix;
  }

  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        padding: "28px 20px",
        background: bgColor,
        borderRadius: "14px",
        border: `1px solid ${borderColor}`,
        minWidth: "150px",
        flex: "1 1 150px",
        transition: "opacity 0.4s ease",
        opacity: active ? 1 : 0,
      }}
    >
      <div
        style={{
          fontSize: "clamp(32px, 4.5vw, 50px)",
          fontWeight: 900,
          color: accent,
          lineHeight: 1,
          marginBottom: "10px",
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {displayVal}
      </div>
      <div
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: mutedText,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function AnimatedStats({
  props,
  stylePack,
}: SectionRenderProps<AnimatedStatsProps>) {
  const { heading, stats, dark } = props;

  const bg = dark ? stylePack.heroOverlay : stylePack.sectionBgB;
  const textColor = dark ? "#ffffff" : stylePack.headingColor;
  const statBg = dark ? "rgba(255,255,255,0.06)" : stylePack.cardBg;
  const borderCol = dark ? "rgba(255,255,255,0.08)" : stylePack.cardBorder.replace("1px solid ", "");
  const muted = dark ? "rgba(255,255,255,0.52)" : stylePack.mutedText;

  return (
    <section style={{ background: bg, padding: "64px 24px" }}>
      <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
        {heading && (
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(24px, 3.5vw, 36px)",
              fontWeight: stylePack.headingWeight,
              color: textColor,
              letterSpacing: "-0.02em",
              marginBottom: "40px",
            }}
          >
            {heading}
          </h2>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            justifyContent: "center",
          }}
        >
          {stats.map((s, i) => (
            <StatItem
              key={i}
              value={s.value}
              label={s.label}
              accent={stylePack.accent}
              mutedText={muted}
              bgColor={statBg}
              borderColor={borderCol}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { SectionRenderProps, ReviewsCarouselProps } from "@/lib/website-engine/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ fontSize: "18px", color: "#f59e0b", letterSpacing: "1px" }}>
      {"★".repeat(Math.min(rating, 5))}
      <span style={{ color: "#d1d5db" }}>{"★".repeat(Math.max(0, 5 - rating))}</span>
    </div>
  );
}

export default function ReviewsCarousel({
  props,
  stylePack,
}: SectionRenderProps<ReviewsCarouselProps>) {
  const { heading, reviews } = props;
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % reviews.length);
      setAnimKey((k) => k + 1);
    }, 5200);
    return () => clearInterval(t);
  }, [reviews.length]);

  const handleSelect = (i: number) => {
    setIdx(i);
    setAnimKey((k) => k + 1);
  };

  const current = reviews[idx];

  return (
    <section style={{ background: stylePack.sectionBgB, padding: "80px 24px" }}>
      <div style={{ maxWidth: "880px", margin: "0 auto" }}>
        {/* Heading */}
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(26px, 4vw, 44px)",
            fontWeight: stylePack.headingWeight,
            color: stylePack.headingColor,
            letterSpacing: "-0.025em",
            margin: "0 0 48px",
          }}
        >
          {heading}
        </h2>

        {/* Large quote */}
        <div
          style={{
            fontSize: "60px",
            color: stylePack.accent,
            lineHeight: 0.8,
            textAlign: "center",
            marginBottom: "8px",
            opacity: 0.35,
            fontFamily: "Georgia, serif",
          }}
        >
          &ldquo;
        </div>

        {/* Featured review card */}
        <div
          key={animKey}
          style={{
            background: stylePack.cardBg,
            border: stylePack.cardBorder,
            borderRadius: stylePack.cardRadius,
            boxShadow: stylePack.cardShadow,
            padding: "clamp(24px, 4vw, 44px)",
            marginBottom: "28px",
            textAlign: "center",
            animation: "we-slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <Stars rating={current.rating} />
          </div>
          <p
            style={{
              fontSize: "clamp(16px, 2.2vw, 19px)",
              lineHeight: 1.72,
              color: stylePack.sectionText,
              margin: "0 0 28px",
              fontStyle: "italic",
              maxWidth: "640px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {current.text}
          </p>
          <div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: stylePack.headingColor,
              }}
            >
              {current.name}
            </span>
            {current.location && (
              <span
                style={{
                  fontSize: "13px",
                  color: stylePack.mutedText,
                  marginLeft: "8px",
                }}
              >
                · {current.location}
              </span>
            )}
          </div>
        </div>

        {/* Dot controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              aria-label={`Review ${i + 1}`}
              style={{
                width: i === idx ? "28px" : "8px",
                height: "8px",
                borderRadius: "9999px",
                background: i === idx ? stylePack.accent : stylePack.mutedText,
                border: "none",
                cursor: "pointer",
                padding: 0,
                opacity: i === idx ? 1 : 0.3,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Thumbnail row — auto-fill so it wraps on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "10px",
          }}
        >
          {reviews.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                background: i === idx ? stylePack.badgeBg : stylePack.cardBg,
                border:
                  i === idx
                    ? `2px solid ${stylePack.accent}`
                    : stylePack.cardBorder,
                borderRadius: stylePack.cardRadius,
                padding: "14px 14px",
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color 0.2s ease, background 0.2s ease",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#f59e0b",
                  marginBottom: "5px",
                  letterSpacing: "1px",
                }}
              >
                {"★".repeat(r.rating)}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: stylePack.sectionText,
                  lineHeight: 1.45,
                  maxHeight: "36px",
                  overflow: "hidden",
                }}
              >
                {r.text.length > 70 ? r.text.slice(0, 70) + "…" : r.text}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: i === idx ? stylePack.accent : stylePack.mutedText,
                  marginTop: "7px",
                  transition: "color 0.2s ease",
                }}
              >
                {r.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import type { SectionRenderProps, GalleryMasonryProps } from "@/lib/website-engine/types";

export default function GalleryMasonry({
  props,
  stylePack,
}: SectionRenderProps<GalleryMasonryProps>) {
  const { heading, subheading, images } = props;

  return (
    <section style={{ background: stylePack.sectionBgA, padding: "88px 24px" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
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
                fontSize: "16px",
                color: stylePack.mutedText,
                maxWidth: "480px",
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
          className="we-gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gridAutoRows: "200px",
            gap: "14px",
          }}
        >
          {images.map((img, i) => {
            // Make first and 4th cell span 2 rows for visual interest (desktop only — CSS resets on mobile)
            const isTall = i === 0 || i === 3;
            return (
              <div
                key={i}
                className={isTall ? "we-gallery-tall" : ""}
                style={{
                  position: "relative",
                  borderRadius: stylePack.cardRadius,
                  overflow: "hidden",
                  background:
                    img.gradient ??
                    `linear-gradient(135deg, ${stylePack.accent}28 0%, ${stylePack.sectionBgB} 100%)`,
                  boxShadow: stylePack.cardShadow,
                  gridRow: isTall ? "span 2" : "span 1",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "scale(1.02)";
                  el.style.boxShadow = `0 22px 52px rgba(0,0,0,0.18)`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "scale(1)";
                  el.style.boxShadow = stylePack.cardShadow;
                }}
              >
                {img.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                )}

                {/* Bottom gradient for caption readability */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />

                {img.caption && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "14px",
                      left: "16px",
                      right: "16px",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                      textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {img.caption}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile reset for tall cells */}
        <style>{`
          @media (max-width: 620px) {
            .we-gallery-grid { grid-auto-rows: 180px !important; }
            .we-gallery-tall { grid-row: span 1 !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

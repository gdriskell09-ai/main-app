"use client";

import { useState } from "react";
import type { SectionRenderProps, FAQAccordionProps } from "@/lib/website-engine/types";

export default function FAQAccordion({
  props,
  stylePack,
}: SectionRenderProps<FAQAccordionProps>) {
  const { heading, faqs } = props;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section style={{ background: stylePack.sectionBgA, padding: "88px 24px" }}>
      <div style={{ maxWidth: "740px", margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(26px, 4vw, 44px)",
            fontWeight: stylePack.headingWeight,
            color: stylePack.headingColor,
            letterSpacing: "-0.025em",
            margin: "0 0 56px",
          }}
        >
          {heading}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  background: stylePack.cardBg,
                  border: isOpen
                    ? `1.5px solid ${stylePack.accent}60`
                    : stylePack.cardBorder,
                  borderRadius: stylePack.cardRadius,
                  overflow: "hidden",
                  transition: "border-color 0.22s ease",
                  boxShadow: isOpen
                    ? `0 4px 28px ${stylePack.accent}14`
                    : stylePack.cardShadow,
                }}
              >
                {/* Question row */}
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "20px 24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: "clamp(14px, 2vw, 16px)",
                      fontWeight: 600,
                      color: isOpen ? stylePack.accent : stylePack.headingColor,
                      transition: "color 0.18s ease",
                      flex: 1,
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.question}
                  </span>

                  {/* +/× toggle */}
                  <span
                    style={{
                      flexShrink: 0,
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: isOpen ? stylePack.accent : stylePack.badgeBg,
                      color: isOpen ? stylePack.accentText : stylePack.badgeText,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: 400,
                      lineHeight: 1,
                      transition: "background 0.2s ease, color 0.2s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>

                {/* Answer — rendered conditionally with drop-in animation */}
                {isOpen && (
                  <div
                    style={{
                      padding: "0 24px 22px",
                      borderTop: `1px solid ${stylePack.accent}18`,
                      paddingTop: "16px",
                      animation: "we-dropIn 0.24s ease both",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        color: stylePack.mutedText,
                        lineHeight: 1.72,
                        margin: 0,
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* "Still have questions?" footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "44px",
            paddingTop: "36px",
            borderTop: `1px solid ${stylePack.cardBorder.replace("1px solid ", "")}`,
          }}
        >
          <p style={{ fontSize: "15px", color: stylePack.mutedText, margin: "0 0 16px" }}>
            Still have questions?
          </p>
          <button
            style={{
              background: stylePack.accent,
              color: stylePack.accentText,
              border: "none",
              borderRadius: stylePack.buttonRadius,
              padding: "13px 30px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.18s ease, transform 0.18s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = stylePack.accentHover;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = stylePack.accent;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            Contact Us →
          </button>
        </div>
      </div>
    </section>
  );
}

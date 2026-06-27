"use client";

import { useState } from "react";
import WebsiteRenderer from "@/app/components/website-engine/WebsiteRenderer";
import {
  samplePressureWashingWebsite,
  sampleIceCreamWebsite,
} from "@/lib/website-engine/sampleData";
import type { StylePackId, WebsiteConfig } from "@/lib/website-engine/types";

const PACKS: { id: StylePackId; label: string }[] = [
  { id: "bold-contractor",  label: "Bold Contractor"  },
  { id: "clean-pro",        label: "Clean Pro"        },
  { id: "luxury-dark",      label: "Luxury Dark"      },
  { id: "premium-glass",    label: "Premium Glass"    },
  { id: "high-energy",      label: "High Energy"      },
  { id: "playful-bright",   label: "Playful Bright"   },
  { id: "premium-minimal",  label: "Premium Minimal"  },
];

const DEMOS: { id: string; label: string; config: WebsiteConfig }[] = [
  { id: "pressure", label: "🏠 Pressure Washing", config: samplePressureWashingWebsite },
  { id: "icecream", label: "🍦 Ice Cream Shop",   config: sampleIceCreamWebsite       },
];

const BADGE: Record<StylePackId, string> = {
  "bold-contractor":  "#ea580c",
  "clean-pro":        "#0ea5e9",
  "luxury-dark":      "#c9a227",
  "premium-glass":    "#4f46e5",
  "high-energy":      "#ef4444",
  "playful-bright":   "#f43f5e",
  "premium-minimal":  "#2d6a4f",
};

export default function WebsitePreviewPage() {
  const [pack,   setPack]   = useState<StylePackId>("bold-contractor");
  const [demoId, setDemoId] = useState<string>("pressure");

  const base = DEMOS.find((d) => d.id === demoId)!.config;
  const config: WebsiteConfig = { ...base, stylePack: pack };

  return (
    <>
      <style>{`
        .we-preview-bar { scrollbar-width: none; -ms-overflow-style: none; }
        .we-preview-bar::-webkit-scrollbar { display: none; }
        .we-pack-btn { white-space: nowrap; flex-shrink: 0; }
      `}</style>

      <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh" }}>
        {/* ── Sticky control bar ── */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 200,
            background: "#0a0f1e",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
          }}
        >
          {/* Inner scroll container */}
          <div
            className="we-preview-bar"
            style={{
              overflowX: "auto",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 16px",
              minWidth: 0,
            }}
          >
            {/* Engine label */}
            <div style={{ flexShrink: 0, marginRight: "4px" }}>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  color: "#334155",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  display: "block",
                }}
              >
                Website
              </span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  color: "#334155",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  display: "block",
                }}
              >
                Engine
              </span>
            </div>

            {/* Demo switcher */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexShrink: 0,
                paddingRight: "12px",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                marginRight: "4px",
              }}
            >
              {DEMOS.map((d) => (
                <button
                  key={d.id}
                  className="we-pack-btn"
                  onClick={() => setDemoId(d.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "7px",
                    border: "1px solid",
                    borderColor:
                      demoId === d.id
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(255,255,255,0.10)",
                    background:
                      demoId === d.id
                        ? "rgba(255,255,255,0.10)"
                        : "transparent",
                    color: demoId === d.id ? "#f8fafc" : "#475569",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Style pack label */}
            <span
              style={{
                fontSize: "9px",
                fontWeight: 800,
                color: "#334155",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                flexShrink: 0,
              }}
            >
              Pack
            </span>

            {/* Style pack buttons */}
            {PACKS.map((p) => (
              <button
                key={p.id}
                className="we-pack-btn"
                onClick={() => setPack(p.id)}
                style={{
                  padding: "6px 13px",
                  borderRadius: "7px",
                  border: "1px solid",
                  borderColor:
                    pack === p.id ? BADGE[p.id] : "rgba(255,255,255,0.10)",
                  background:
                    pack === p.id ? `${BADGE[p.id]}20` : "transparent",
                  color: pack === p.id ? BADGE[p.id] : "#475569",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {pack === p.id && (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: BADGE[p.id],
                      flexShrink: 0,
                    }}
                  />
                )}
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Rendered website ── */}
        <WebsiteRenderer config={config} />
      </div>
    </>
  );
}

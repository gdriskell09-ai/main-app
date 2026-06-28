"use client";

import { useState, useEffect, useCallback } from "react";
import { use } from "react";
import WebsiteRenderer from "@/app/components/website-engine/WebsiteRenderer";
import { getProfile } from "@/lib/business/storage";
import { profileToWebsiteConfig } from "@/lib/business/profileToWebsiteConfig";
import type { BusinessProfile } from "@/lib/business/types";
import type { StylePackId, WebsiteConfig } from "@/lib/website-engine/types";

const PACKS: { id: StylePackId; label: string; color: string }[] = [
  { id: "bold-contractor",  label: "Bold Contractor",  color: "#ea580c" },
  { id: "clean-pro",        label: "Clean Pro",        color: "#0ea5e9" },
  { id: "luxury-dark",      label: "Luxury Dark",      color: "#c9a227" },
  { id: "premium-glass",    label: "Premium Glass",    color: "#4f46e5" },
  { id: "high-energy",      label: "High Energy",      color: "#ef4444" },
  { id: "playful-bright",   label: "Playful Bright",   color: "#f43f5e" },
  { id: "premium-minimal",  label: "Premium Minimal",  color: "#2d6a4f" },
];

interface PageProps {
  params: Promise<{ businessId: string }>;
}

export default function BusinessPreviewPage({ params }: PageProps) {
  const { businessId } = use(params);

  const [profile, setProfile]   = useState<BusinessProfile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [pack, setPack]         = useState<StylePackId | null>(null);
  const [config, setConfig]     = useState<WebsiteConfig | null>(null);

  const load = useCallback(() => {
    const p = getProfile(businessId);
    if (!p) {
      setNotFound(true);
      return;
    }
    setProfile(p);
    setPack(p.preferredStylePack);
    setConfig(profileToWebsiteConfig(p));
  }, [businessId]);

  useEffect(() => {
    load();
  }, [load]);

  // When pack changes after initial load, regenerate config with new pack
  useEffect(() => {
    if (!profile || !pack) return;
    const base = profileToWebsiteConfig(profile);
    setConfig({ ...base, stylePack: pack });
  }, [pack, profile]);

  if (notFound) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#f8fafc",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏢</div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 8px",
          }}
        >
          Business profile not found
        </h1>
        <p style={{ fontSize: "15px", color: "#64748b", margin: "0 0 28px" }}>
          This profile may have been deleted or the link is incorrect.
        </p>
        <a
          href="/admin"
          style={{
            padding: "11px 26px",
            borderRadius: "12px",
            background: "#0f172a",
            color: "#ffffff",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Back to Admin
        </a>
      </div>
    );
  }

  if (!config || !pack) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#f8fafc",
        }}
      >
        <div style={{ fontSize: "14px", color: "#64748b" }}>Loading preview…</div>
      </div>
    );
  }

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
            {/* Back link */}
            <a
              href="/admin"
              style={{
                flexShrink: 0,
                fontSize: "12px",
                fontWeight: 600,
                color: "#475569",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "7px",
                border: "1px solid rgba(255,255,255,0.10)",
                marginRight: "4px",
                whiteSpace: "nowrap",
              }}
            >
              ← Admin
            </a>

            {/* Business name */}
            <div
              style={{
                flexShrink: 0,
                paddingRight: "12px",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                marginRight: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  color: "#334155",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  display: "block",
                }}
              >
                Previewing
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#f1f5f9",
                  display: "block",
                  maxWidth: "180px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {profile?.businessName}
              </span>
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
            {PACKS.map((p) => {
              const active = pack === p.id;
              return (
                <button
                  key={p.id}
                  className="we-pack-btn"
                  onClick={() => setPack(p.id)}
                  style={{
                    padding: "6px 13px",
                    borderRadius: "7px",
                    border: "1px solid",
                    borderColor: active ? p.color : "rgba(255,255,255,0.10)",
                    background: active ? `${p.color}20` : "transparent",
                    color: active ? p.color : "#475569",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {active && (
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: p.color,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Rendered website ── */}
        <WebsiteRenderer config={config} />
      </div>
    </>
  );
}

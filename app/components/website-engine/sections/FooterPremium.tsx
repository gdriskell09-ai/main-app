"use client";

import type { SectionRenderProps, FooterPremiumProps } from "@/lib/website-engine/types";

export default function FooterPremium({
  props,
  stylePack,
  businessName,
}: SectionRenderProps<FooterPremiumProps>) {
  const { tagline, phone, email, address, links } = props;
  const name = props.businessName || businessName;

  const isDark =
    stylePack.id === "luxury-dark" || stylePack.id === "high-energy";
  const footerBg = isDark ? stylePack.sectionBgB : "#0f172a";
  const footerText = "#f8fafc";
  const footerMuted = "rgba(248,250,252,0.50)";
  const footerBorder = "rgba(248,250,252,0.08)";

  return (
    <footer
      style={{
        background: footerBg,
        color: footerText,
        padding: "60px 24px 32px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          {/* Brand column */}
          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: footerText,
                marginBottom: "10px",
              }}
            >
              {name}
            </div>
            {tagline && (
              <p
                style={{
                  fontSize: "14px",
                  color: footerMuted,
                  lineHeight: 1.6,
                  margin: "0 0 20px",
                  maxWidth: "240px",
                }}
              >
                {tagline}
              </p>
            )}
            <div
              style={{
                display: "inline-block",
                background: stylePack.accent,
                color: stylePack.accentText,
                borderRadius: stylePack.buttonRadius,
                padding: "10px 22px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Get a Free Quote →
            </div>
          </div>

          {/* Links column */}
          {links && links.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: footerMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "16px",
                }}
              >
                Quick Links
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    style={{
                      fontSize: "14px",
                      color: footerMuted,
                      textDecoration: "none",
                      transition: "color 0.18s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = footerText)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = footerMuted)
                    }
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Contact column */}
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: footerMuted,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "16px",
              }}
            >
              Contact
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  style={{
                    fontSize: "14px",
                    color: footerMuted,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  📞 {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  style={{
                    fontSize: "14px",
                    color: footerMuted,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  ✉️ {email}
                </a>
              )}
              {address && (
                <span
                  style={{
                    fontSize: "14px",
                    color: footerMuted,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  📍 {address}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: `1px solid ${footerBorder}`,
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "13px", color: footerMuted, margin: 0 }}>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <p style={{ fontSize: "11px", color: "rgba(248,250,252,0.25)", margin: 0 }}>
            Powered by Main App
          </p>
        </div>
      </div>
    </footer>
  );
}

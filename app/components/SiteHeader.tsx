"use client";

import { useState, useRef, useEffect } from "react";
import { BUSINESS_TYPE_COUNT } from "@/lib/marketplace/data";

const NAV_LINKS = [
  { href: "/#how-it-works",  label: "How It Works" },
  { href: "/#sites",         label: "Demos"        },
  { href: "/#pricing",       label: "Pricing"      },
  { href: "/marketplace",    label: "Marketplace"  },
  { href: "/team",           label: "Team"         },
  { href: "/contact",        label: "Contact"      },
];

const MARKETPLACE_MENU = [
  {
    label: "Field Service",
    href: "/marketplace?category=field",
    note: "Pressure washing, landscaping, roofing & more",
  },
  {
    label: "Personal Service",
    href: "/marketplace?category=personal",
    note: "Barbershops, salons, fitness studios & more",
  },
  {
    label: "Creative & Events",
    href: "/marketplace?category=creative",
    note: "Photography, DJs, catering & more",
  },
];

export default function SiteHeader({
  activePath,
  links,
}: {
  activePath?: string;
  links?: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navLinks = links ?? NAV_LINKS;

  function openMenu() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setMenuOpen(true);
  }
  function closeMenu() {
    closeTimeout.current = setTimeout(() => setMenuOpen(false), 150);
  }

  useEffect(() => {
    if (!menuOpen) return;
    function onScroll() { setMenuOpen(false); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f5ef]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="/" className="text-lg font-semibold tracking-tight text-slate-950">Main App</a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm text-slate-600 lg:flex">
          {navLinks.map((l) => {
            if (l.href === "/marketplace") {
              return (
                <div
                  key={l.href}
                  style={{ position: "relative" }}
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                  onFocus={openMenu}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) closeMenu();
                  }}
                >
                  <a
                    href="/marketplace"
                    className={`flex items-center gap-1 transition hover:text-slate-950 ${activePath === l.href ? "font-semibold text-slate-950" : ""}`}
                  >
                    {l.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>

                  {/* Centering wrapper — pointer-events blocked when closed so hidden panel can't intercept hover */}
                  <div style={{ position: "absolute", top: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", zIndex: 50, pointerEvents: menuOpen ? "auto" : "none" }}>
                    {/* Animated panel */}
                    <div
                      style={{
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen ? "translateY(0px)" : "translateY(-6px)",
                        pointerEvents: menuOpen ? "auto" : "none",
                        transition: "opacity 0.15s ease, transform 0.15s ease",
                        width: "252px",
                        background: "#ffffff",
                        borderRadius: "16px",
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)",
                        padding: "8px",
                      }}
                    >
                      {MARKETPLACE_MENU.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="hover:bg-slate-50"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            textDecoration: "none",
                            transition: "background 0.1s ease",
                          }}
                        >
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{item.label}</span>
                          <span style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{item.note}</span>
                        </a>
                      ))}
                      <div style={{ borderTop: "1px solid #f1f5f9", margin: "4px 0 0", padding: "8px 12px 4px" }}>
                        <a
                          href="/marketplace"
                          style={{ fontSize: "12px", fontWeight: 600, color: "#2d6a4f", textDecoration: "none" }}
                          className="hover:underline"
                        >
                          View all {BUSINESS_TYPE_COUNT}+ types →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <a key={l.href} href={l.href}
                className={`transition hover:text-slate-950 ${activePath === l.href ? "font-semibold text-slate-950" : ""}`}>
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a href="/contact"
            className="hidden rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 lg:block">
            Get started →
          </a>
          {/* Mobile burger */}
          <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 lg:hidden">
            {open ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                <path d="M0 1h15M0 6h15M0 11h15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-black/5 bg-white px-6 pb-4 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <div key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}
                  className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-slate-50 ${activePath === l.href ? "text-slate-950" : "text-slate-600"}`}>
                  {l.label}
                </a>
                {l.href === "/marketplace" && (
                  <div className="ml-3 flex flex-col">
                    {MARKETPLACE_MENU.map((item) => (
                      <a key={item.href} href={item.href} onClick={() => setOpen(false)}
                        className="rounded-xl px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a href="/contact" onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800">
              Get started →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

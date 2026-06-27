"use client";

import { useState, useEffect } from "react";
import SiteHeader from "../components/SiteHeader";
import { businesses, type Category } from "@/lib/marketplace/data";

const categories: { id: Category; label: string }[] = [
  { id: "all",      label: "All types"        },
  { id: "field",    label: "Field Service"    },
  { id: "personal", label: "Personal Service" },
  { id: "creative", label: "Creative & Events" },
];

export default function MarketplacePage() {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get("category");
    if (param === "field" || param === "personal" || param === "creative") setCategory(param);
  }, []);

  const filtered = businesses.filter((b) => {
    const matchCat    = category === "all" || b.category === category;
    const matchSearch = !search.trim() || b.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const demoCount  = businesses.filter((b) => b.demo).length;
  const totalCount = businesses.length;

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-slate-950">
      <SiteHeader activePath="/marketplace" />

      {/* Hero */}
      <section className="border-b border-black/5 bg-white px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Website marketplace
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Find your business type.
              <span className="block text-slate-400">We&apos;ll build your site.</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {demoCount} live demos across {totalCount}+ business types — each designed around what
              actually converts for that specific trade or service. Not a generic template. Your
              business, your layout, built to bring in customers.
            </p>
          </div>

          {/* Stats row */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:max-w-2xl">
            {[
              { label: "Business types",     value: `${totalCount}+` },
              { label: "Live demo sites",    value: `${demoCount}`   },
              { label: "NOT FINALIZED — DO NOT LAUNCH", value: "⚠️ PRICING TBD", warn: true },
            ].map((s) => (
              <div key={s.label} className="rounded-[1.5rem] border border-black/5 bg-[#f7f5ef] px-5 py-4"
                style={s.warn ? { background: "#fef3c7", border: "2px solid #d97706" } : undefined}>
                <p className="text-2xl font-semibold text-slate-950" style={s.warn ? { color: "#92400e" } : undefined}>{s.value}</p>
                <p className="mt-1 text-xs font-medium text-slate-500" style={s.warn ? { color: "#92400e", fontWeight: 700 } : undefined}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* What's always included */}
          <div className="mt-8 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Every site includes</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {[
                "Mobile-first, fast-loading design",
                "Lead capture & contact forms",
                "Google Analytics ready",
                "Hosted & managed",
                "1 revision round",
                "Email support",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800">
                  <span className="text-emerald-500">✓</span> {item}
                </span>
              ))}
            </div>
          </div>

          {/* Search + filter */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search business types…"
              className="w-full max-w-sm rounded-full border border-black/10 bg-[#f7f5ef] px-5 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    category === c.id
                      ? "bg-slate-950 text-white"
                      : "border border-black/10 bg-white text-slate-600 hover:border-slate-400"
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="mb-6 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-950">{filtered.length}</span> business types
            {category !== "all" && ` in ${categories.find((c) => c.id === category)?.label}`}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((biz) => (
              <div key={biz.id}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                {/* Header preview */}
                <div className={`relative h-36 bg-gradient-to-br ${biz.gradient} p-5`}>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg">
                      {biz.emoji}
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-24 rounded-full bg-white/40" />
                      <div className="h-1.5 w-16 rounded-full bg-white/25" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="h-2.5 w-3/4 rounded-full bg-white/30" />
                    <div className="h-2 w-1/2 rounded-full bg-white/20" />
                  </div>
                  <div className="absolute bottom-4 left-5 flex gap-2">
                    <div className="h-7 w-20 rounded-full bg-white/25" />
                    <div className="h-7 w-14 rounded-full bg-white/15" />
                  </div>
                  {biz.demo && (
                    <div className="absolute right-4 top-4 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-bold text-white">
                      Live demo
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-base font-semibold text-slate-950">{biz.name}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{biz.tagline}</p>

                  {/* What's included */}
                  <ul className="mt-3 space-y-1.5">
                    {biz.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex gap-2 pt-4">
                    {biz.demo ? (
                      <a href={biz.demo} target="_blank" rel="noopener noreferrer"
                        className="flex-1 rounded-full border border-black/10 py-2 text-center text-xs font-semibold text-slate-700 transition hover:border-slate-400">
                        View demo
                      </a>
                    ) : (
                      <span className="flex-1 rounded-full border border-dashed border-black/10 py-2 text-center text-xs text-slate-400">
                        Demo soon
                      </span>
                    )}
                    <a href={`/contact?type=${encodeURIComponent(biz.name)}`}
                      className="flex-1 rounded-full bg-slate-950 py-2 text-center text-xs font-semibold text-white transition hover:bg-slate-800">
                      Get this site →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex h-40 items-center justify-center text-sm text-slate-400">
              No results for &ldquo;{search}&rdquo; —{" "}
              <a href="/contact" className="ml-1 underline underline-offset-2 hover:text-slate-950">
                request this type →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-black/5 bg-white px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              From this page to a live site in days
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Pick your type",
                body: "Choose your business category. Tell us about your services, service area, and what you need.",
              },
              {
                step: "2",
                title: "We build it",
                body: "We customize the layout, copy, colors, and features around your specific trade. You get a working site, not a starter template.",
              },
              {
                step: "3",
                title: "Grow from there",
                body: "Add CRM, job tracking, invoicing, and ops tools whenever you're ready — all in the same platform.",
              },
            ].map((s) => (
              <div key={s.step} className="rounded-[1.5rem] border border-black/5 bg-[#f7f5ef] p-6">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                  {s.step}
                </div>
                <h3 className="text-base font-semibold text-slate-950">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-black/5 bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight">
            Don&apos;t see your business type?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Tell us what you do. We build for any local service business — if it exists, we can build
            a site for it.
          </p>
          <a href="/contact"
            className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-950 transition hover:bg-slate-100">
            Request your business type →
          </a>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-slate-950 px-6 py-8 text-center text-xs text-slate-600">
        © 2026 Main App · Websites and growth tools for local businesses
      </footer>
    </main>
  );
}

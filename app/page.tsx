"use client";

import { useState } from "react";
import SiteHeader from "./components/SiteHeader";
import { BUSINESS_TYPE_COUNT } from "@/lib/marketplace/data";


const sampleSites = [
  {
    trade: "Pressure Washing",
    label: "Residential & Commercial Wash",
    gradient: "from-[#063b4e] to-[#085272]",
    dot: "bg-sky-300",
    demo: "/samples/pressure-washing",
  },
  {
    trade: "Landscaping",
    label: "Seasonal Lawn & Garden",
    gradient: "from-emerald-800 to-green-700",
    dot: "bg-emerald-300",
    demo: "/samples/landscaping",
  },
  {
    trade: "Barbershop",
    label: "Clean cuts, easy booking",
    gradient: "from-slate-800 to-slate-700",
    dot: "bg-amber-400",
    demo: "/samples/barbershop",
  },
  {
    trade: "Painting",
    label: "Interior & Exterior Painting",
    gradient: "from-slate-900 to-slate-800",
    dot: "bg-slate-300",
    demo: "/samples/painting",
  },
  {
    trade: "Roofing",
    label: "Repairs, Replacement & Claims",
    gradient: "from-[#1e2d40] to-[#2a3d57]",
    dot: "bg-red-400",
    demo: "/samples/roofing",
  },
  {
    trade: "Home Cleaning",
    label: "Recurring & Deep Cleaning",
    gradient: "from-sky-600 to-sky-800",
    dot: "bg-white",
    demo: "/samples/cleaning",
  },
];

type FeatureStatus = "available" | "building" | "roadmap";

const features: { status: FeatureStatus; title: string; description: string }[] = [
  {
    status: "available",
    title: "White-label websites",
    description: "Built around your business type. Fast, mobile-first, and designed to convert visitors into real customers.",
  },
  {
    status: "available",
    title: "Lead capture & intake",
    description: "Contact forms, booking links, and quote flows that actually move people to action instead of dropping off.",
  },
  {
    status: "available",
    title: "Customer CRM",
    description: "Track every lead, follow-up, and job in one place. Built for businesses that want more than a spreadsheet.",
  },
  {
    status: "building",
    title: "Job & crew workflow",
    description: "Crew check-ins, job status tracking, and daily ops support — for service businesses managing active jobs.",
  },
  {
    status: "building",
    title: "Estimating support",
    description: "Move from inquiry to estimate faster. Smarter intake and property-based tools for businesses that quote work.",
  },
  {
    status: "building",
    title: "Door-knocking tools",
    description: "Map-based canvassing, pin status, territory assignment, and rep tracking — for teams that knock doors.",
  },
  {
    status: "roadmap",
    title: "Review & follow-up automation",
    description: "Automated review requests, reminders, and follow-ups so nothing slips after a job or appointment closes.",
  },
  {
    status: "roadmap",
    title: "Business email platform",
    description: "Send quotes, follow-ups, and campaigns from your own business address — no switching between tools.",
  },
  {
    status: "roadmap",
    title: "SMS & marketing tools",
    description: "Reach your customer list with seasonal promos, reminders, and campaigns without a separate platform.",
  },
  {
    status: "roadmap",
    title: "Bank account linking",
    description: "Connect your accounts to see income, expenses, and cash flow in one place — like QuickBooks but built into your platform.",
  },
  {
    status: "roadmap",
    title: "Invoicing & payments",
    description: "Send invoices, collect payments, and track financials without a separate accounting tool.",
  },
  {
    status: "roadmap",
    title: "Full internal admin",
    description: "Your own branded ops hub — reporting, permissions, scheduling, and tools that grow with the business.",
  },
];

const statusConfig: Record<FeatureStatus, { label: string; pill: string; border: string }> = {
  available: { label: "Available now",   pill: "bg-emerald-100 text-emerald-800", border: "border-emerald-200" },
  building:  { label: "In development",  pill: "bg-amber-100 text-amber-800",     border: "border-amber-200"   },
  roadmap:   { label: "On the roadmap",  pill: "bg-slate-100 text-slate-600",     border: "border-slate-200"   },
};

const roadmapItems = [
  {
    phase: "Now",
    color: "bg-emerald-500",
    label: "Live",
    items: [
      "White-label websites, built for your business type",
      "Lead capture — contact forms, quote requests, booking links",
      "Customer CRM — leads, jobs, notes, and follow-ups in one place",
    ],
  },
  {
    phase: "Building",
    color: "bg-amber-400",
    label: "In development",
    items: [
      "Job and crew workflow tools for active service businesses",
      "Estimating support — faster path from inquiry to quote",
      "Door-knocking suite — maps, pins, territory, and rep tracking",
    ],
  },
  {
    phase: "Next",
    color: "bg-slate-300",
    label: "Coming soon",
    items: [
      "Automated review requests and follow-up sequences",
      "Business email platform — send quotes, campaigns, and follow-ups from your own address",
      "SMS and marketing campaigns from your customer list",
    ],
  },
  {
    phase: "Advanced",
    color: "bg-violet-300",
    label: "Big picture",
    items: [
      "Bank account linking — connect accounts to see income, expenses, and cash flow in one place",
      "Secure payment collection through approved processors — invoicing, deposits, and receipts",
      "Full internal admin — reporting, role-based permissions, and audit logs for important actions",
    ],
  },
];

const testimonials = [
  {
    quote: "I had a Wix site for four years and it never brought in a single job on its own. Got the Main App pressure washing site set up and had my first website lead within two weeks.",
    name: "Grant D.",
    role: "Owner, pressure washing company",
    city: "Atlanta, GA",
    initial: "G",
    color: "bg-sky-700",
  },
  {
    quote: "What sold me was that it's built for landscaping specifically. The seasonal promo section, the quote form, the recurring upsell — it's all there. Not some generic template I have to hack together.",
    name: "Marcus T.",
    role: "Owner, lawn & landscaping",
    city: "Charlotte, NC",
    initial: "M",
    color: "bg-emerald-700",
  },
  {
    quote: "I looked at Squarespace and an agency. Squarespace was too DIY and the agency wanted $4k upfront. Main App got me a better-looking site AND a CRM for less than I was paying for my old GoDaddy plan.",
    name: "Diana R.",
    role: "Owner, barbershop",
    city: "Nashville, TN",
    initial: "D",
    color: "bg-amber-700",
  },
];

const comparisons = [
  {
    label: "Wix / Squarespace",
    points: ["Generic templates", "No local service focus", "No CRM or job tools", "You build it yourself"],
    bad: true,
  },
  {
    label: "Web Agency",
    points: ["$3k–$8k upfront", "Slow to build", "No ops tools", "Charge for every update"],
    bad: true,
  },
  {
    label: "Main App",
    points: ["Built for your trade", "Includes CRM & job tools", "Flat monthly, no surprises", "We build it, you own it"],
    bad: false,
  },
];

const HOMEPAGE_NAV = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#sites",        label: "Demos"        },
  { href: "#pricing",      label: "Pricing"      },
  { href: "/marketplace",  label: "Marketplace"  },
  { href: "/team",         label: "Team"         },
  { href: "/contact",      label: "Contact"      },
];

const AI_TOOLS = [
  {
    icon: "🌐",
    title: "Website Content Helper",
    description: "Writes your headlines, service descriptions, FAQs, and reviews based on your business type and services. Review everything before it goes live.",
    coming: false,
  },
  {
    icon: "💰",
    title: "Quote & Invoice Helper",
    description: "Suggests line items and pricing from your job notes. You approve every number before anything is saved or sent.",
    coming: false,
  },
  {
    icon: "📢",
    title: "Marketing Ideas",
    description: "Generates social post ideas, seasonal promotions, and caption drafts for your service area. You pick what to use — nothing posts automatically.",
    coming: false,
  },
  {
    icon: "📱",
    title: "Lead Follow-Up Drafts",
    description: "Drafts follow-up messages for leads who haven't responded. You review and send — nothing goes out on its own.",
    coming: false,
  },
  {
    icon: "📅",
    title: "Scheduling Assistant",
    description: "Will suggest job scheduling based on location, crew availability, and drive time. You make the final call on every booking.",
    coming: true,
  },
];

const tabs: FeatureStatus[] = ["available", "building", "roadmap"];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<FeatureStatus>("available");

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-slate-950">
      <SiteHeader activePath="/" links={HOMEPAGE_NAV} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-emerald-50/70 to-transparent" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Built for local service businesses
            </div>

            <h1 className="mt-8 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              A site built for your trade.
              <span className="mt-2 block text-slate-400">Tools to grow behind it.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-slate-600">
              Whether you pressure wash driveways, cut grass, fix pipes, or cut hair — you deserve a
              site that looks like a real business and actually brings in customers.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="#sites"
                className="rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                See sample sites
              </a>
              <a href="/marketplace"
                className="rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50">
                Browse all {BUSINESS_TYPE_COUNT}+ types →
              </a>
            </div>

            {/* Quick stats */}
            <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 divide-x divide-black/5 rounded-[1.5rem] border border-black/5 bg-white px-2 py-4 shadow-sm">
              {[
                { value: `${BUSINESS_TYPE_COUNT}+`,   label: "Business types"  },
                { value: "⚠️ PRICING TBD", label: "NOT FINALIZED — DO NOT LAUNCH", warn: true },
                { value: "3 days",label: "Avg time to live" },
              ].map((s) => (
                <div key={s.label} className="px-4 text-center"
                  style={s.warn ? { background: "#fef3c7", borderRadius: "8px", padding: "8px 4px" } : undefined}>
                  <p className="text-xl font-bold text-slate-950" style={s.warn ? { color: "#92400e", fontSize: "12px" } : undefined}>{s.value}</p>
                  <p className="mt-0.5 text-xs text-slate-500" style={s.warn ? { color: "#92400e", fontWeight: 700, fontSize: "9px", lineHeight: "1.3" } : undefined}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm font-medium text-slate-500">
              Built for local businesses across the country
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
              {[
                "Pressure Washing",
                "Landscaping",
                "Barbershops",
                "Roofing",
                "HVAC",
                "Painting",
                "And more",
              ].map((t) => (
                <span key={t} className="rounded-full border border-black/10 bg-[#f7f5ef] px-3 py-1 text-xs font-medium text-slate-600">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">How it works</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              From signup to live site — in days, not months.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              No agency back-and-forth. No DIY guesswork. We build it around your trade and hand you the tools to run it.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "01", title: "Tell us about your business", body: "Your trade, services, and service area. We use this to choose the right layout and content — no generic templates." },
              { n: "02", title: "We build your site",          body: "Your site goes live in days using your industry blueprint — hero, services, trust signals, and CTAs, all set up for your trade." },
              { n: "03", title: "Leads start coming in",       body: "Quote forms, contact flows, and call buttons are all wired up. When someone fills out a form, it lands straight in your dashboard." },
              { n: "04", title: "Manage everything in one place", body: "Track leads, customers, jobs, quotes, and invoices from your admin. No spreadsheets, no sticky notes, no app-switching." },
            ].map((step) => (
              <div key={step.n} className="rounded-[2rem] border border-black/5 bg-[#f7f5ef] p-7">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{step.n}</p>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Explanation */}
      <section id="ai-tools" className="border-t border-black/5 bg-[#f7f5ef]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">
              AI helpers built in
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Smarter tools. You stay in control.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Main App includes AI-powered helpers that take the slow parts off your plate. Every suggestion waits for your approval — nothing sends, posts, or deletes automatically.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AI_TOOLS.map((tool) => (
              <div
                key={tool.title}
                className={`flex flex-col rounded-[2rem] border p-7 shadow-sm ${
                  tool.coming
                    ? "border-black/5 bg-white"
                    : "border-black/5 bg-white"
                }`}
              >
                <div className="text-3xl" aria-hidden="true">{tool.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{tool.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{tool.description}</p>
                {tool.coming && (
                  <span className="mt-4 inline-block self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    Coming soon
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-slate-500">
            AI suggests. You decide. Nothing happens without your approval.
          </p>
        </div>
      </section>

      {/* Sample Sites */}
      <section id="sites" className="border-t border-black/5 bg-[#fcfaf5]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Sample websites
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              See what your site could look like
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Each site is designed around the goals of that specific business — not just a logo swap on a generic layout.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sampleSites.map((site) => (
              <a key={site.trade} href={site.demo} target="_blank" rel="noopener noreferrer"
                className="group rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className={`h-44 rounded-[1.5rem] bg-gradient-to-br ${site.gradient} p-5 text-white`}>
                  <div className="mb-5 flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${site.dot}`} />
                    <div className="h-2 w-20 rounded-full bg-white/30" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-white/30" />
                    <div className="h-3 w-1/2 rounded-full bg-white/20" />
                  </div>
                  <div className="mt-6 flex gap-2">
                    <div className="flex h-7 items-center rounded-full bg-white/20 px-3">
                      <div className="h-2 w-12 rounded-full bg-white/60" />
                    </div>
                    <div className="flex h-7 items-center rounded-full bg-white/10 px-3">
                      <div className="h-2 w-8 rounded-full bg-white/40" />
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between px-2 pb-2 pt-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{site.trade}</p>
                    <p className="mt-1 text-base font-semibold text-slate-950">{site.label}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-slate-600 transition group-hover:border-slate-400 group-hover:text-slate-950">
                    View demo →
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="/marketplace"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Browse all {BUSINESS_TYPE_COUNT}+ business types →
            </a>
            <p className="text-sm text-slate-500">
              Plumbing, HVAC, trainers, photographers, food trucks, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t border-black/5 bg-[#fcfaf5]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              From the field
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Real business owners, real results
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name}
                className="flex flex-col rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm">
                <div className="flex-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.color} text-sm font-bold text-white`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scrub Club — Proof Model */}
      <section className="border-t border-black/5 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Live proof model
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Scrub Club runs on this platform.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-400">
                A real exterior cleaning business using the same website, CRM, lead pipeline, job tracking, quoting, invoicing, and map tools you get. Not a demo. Not staging. A live business, in production, every day.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Custom website", "Lead capture", "CRM", "Quote flow", "Job tracking", "Invoicing", "Door-knocking map"].map((f) => (
                  <span key={f} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              <a href="/samples/pressure-washing" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                See the demo site →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Main App — comparison */}
      <section id="why" className="border-t border-black/5 bg-[#f7f5ef]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Why Main App
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Not a template builder. Not an agency. Something better.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Most local businesses end up choosing between a DIY builder that looks generic or an agency that charges thousands and disappears. Main App is the third option.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {comparisons.map((c) => (
              <div key={c.label}
                className={`rounded-[2rem] border p-7 ${
                  c.bad
                    ? "border-black/5 bg-white"
                    : "border-emerald-200 bg-emerald-950 text-white"
                }`}>
                <div className="flex items-center justify-between">
                  <p className={`text-base font-semibold ${c.bad ? "text-slate-950" : "text-white"}`}>
                    {c.label}
                  </p>
                  {!c.bad && (
                    <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-bold text-white">
                      This is us
                    </span>
                  )}
                </div>
                <ul className="mt-5 space-y-3">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm">
                      <span className={`mt-0.5 shrink-0 font-bold ${c.bad ? "text-rose-400" : "text-emerald-400"}`}>
                        {c.bad ? "✗" : "✓"}
                      </span>
                      <span className={c.bad ? "text-slate-600" : "text-emerald-100"}>
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-black/5 bg-[#f7f5ef]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Features
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Start simple. Go deeper when you need it.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Every business gets a great website and lead capture. Service businesses that want more can layer in CRM, job tracking, estimating, and operations tools.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-slate-950 text-white"
                    : "border border-black/10 bg-white text-slate-600 hover:border-slate-400"
                }`}>
                {statusConfig[tab].label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.filter((f) => f.status === activeTab).map((feature) => (
              <div key={feature.title}
                className={`rounded-[2rem] border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 ${statusConfig[feature.status].border}`}>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusConfig[feature.status].pill}`}>
                  {statusConfig[feature.status].label}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#fcfaf5]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Pricing</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Flat pricing. No per-user fees. No surprises.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Start with a website. Add tools as your business grows. Everything you need, nothing you don&apos;t.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "⚠️ PRICING TBD",
                period: "NOT FINALIZED — DO NOT LAUNCH",
                priceWarn: true,
                tagline: "For businesses that need a great website and nothing else.",
                cta: "Get started",
                popular: false,
                features: [
                  "Custom website built for your business type",
                  "Lead capture forms & contact flows",
                  "Mobile-optimized & fast",
                  "Google Analytics ready",
                  "1 revision round included",
                  "Email support",
                ],
              },
              {
                name: "Growth",
                price: "⚠️ PRICING TBD",
                period: "NOT FINALIZED — DO NOT LAUNCH",
                priceWarn: true,
                tagline: "For businesses actively managing leads, jobs, and follow-ups.",
                cta: "Get started",
                popular: true,
                features: [
                  "Everything in Starter",
                  "Full CRM — leads, customers, notes",
                  "Job & quote tracking",
                  "Invoicing & payment tracking",
                  "Admin dashboard",
                  "Priority email support",
                ],
              },
              {
                name: "Pro",
                price: "⚠️ PRICING TBD",
                period: "NOT FINALIZED — DO NOT LAUNCH",
                priceWarn: true,
                tagline: "For operators who want the complete stack.",
                cta: "Talk to us",
                popular: false,
                features: [
                  "Everything in Growth",
                  "Door-knocking suite — maps, pins, territory",
                  "Automated review requests",
                  "SMS & email follow-up campaigns",
                  "Team access & crew tools",
                  "Dedicated onboarding call",
                ],
              },
            ].map((plan) => (
              <div key={plan.name}
                className={`relative flex flex-col rounded-[2rem] border p-8 shadow-sm ${
                  plan.popular ? "border-slate-950 bg-slate-950 text-white" : "border-black/5 bg-white"
                }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold text-white">
                      Most popular
                    </span>
                  </div>
                )}
                <div>
                  <p className={`text-sm font-semibold ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>{plan.name}</p>
                  <div className="mt-2 flex items-end gap-1">
                    <span
                      className={plan.priceWarn ? undefined : "text-4xl font-bold tracking-tight"}
                      style={plan.priceWarn ? { display: "inline-block", background: "#fef3c7", border: "2px solid #d97706", borderRadius: "6px", padding: "3px 8px", fontSize: "13px", fontWeight: 800, color: "#92400e" } : undefined}
                    >{plan.price}</span>
                    <span
                      className={plan.priceWarn ? undefined : `mb-1 text-sm ${plan.popular ? "text-slate-400" : "text-slate-500"}`}
                      style={plan.priceWarn ? { fontSize: "9px", fontWeight: 700, color: "#92400e" } : undefined}
                    >{plan.period}</span>
                  </div>
                  <p className={`mt-3 text-sm leading-6 ${plan.popular ? "text-slate-400" : "text-slate-600"}`}>{plan.tagline}</p>
                </div>
                <ul className="mt-7 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className={`mt-0.5 shrink-0 text-xs font-bold ${plan.popular ? "text-emerald-400" : "text-emerald-600"}`}>✓</span>
                      <span className={plan.popular ? "text-slate-300" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="/contact"
                  className={`mt-8 block rounded-full py-3.5 text-center text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-white text-slate-950 hover:bg-slate-100"
                      : "bg-slate-950 text-white hover:bg-slate-800"
                  }`}>
                  {plan.cta} →
                </a>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Not sure which plan fits?{" "}
            <a href="/contact" className="font-medium underline underline-offset-2 hover:text-slate-950">
              Talk to us — no pressure.
            </a>
          </p>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="border-t border-black/5 bg-[#f7f5ef]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Roadmap
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Where things stand and where they&apos;re going
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              No vague promises. Here&apos;s exactly what&apos;s live, what&apos;s being built, and what&apos;s next.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {roadmapItems.map((phase) => (
              <div key={phase.phase}
                className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${phase.color}`} />
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    {phase.label}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-slate-950">{phase.phase}</h3>
                <ul className="mt-5 space-y-3">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Compliance & legal foundation note */}
          <div className="mt-8 rounded-[2rem] border border-indigo-100 bg-indigo-50/60 p-7">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 text-2xl" aria-hidden="true">⚖️</span>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                  Compliance &amp; Legal Foundation
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">
                  Built with payment safety and legal compliance in mind from day one
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  When payment and business operations features arrive, they will follow these principles:
                </p>
                <div className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    "Secure checkout via approved processors — Stripe or Square",
                    "Raw card data never stored on our servers",
                    "Hosted payment elements and tokenized card handling only",
                    "Invoices, receipts, and refund/cancellation support",
                    "Payment status and chargeback/dispute tracking",
                    "Sales tax settings placeholder for accountant review",
                    "Terms of service and privacy policy pages",
                    "Cookie and analytics consent if tracking is added",
                    "Customer opt-in for SMS and email marketing",
                    "Clear opt-out handling and unsubscribe flows",
                    "Role-based access for business team members",
                    "Audit logs for payments, approvals, and account changes",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1 text-indigo-400 shrink-0">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs leading-5 text-slate-400">
                  <strong className="text-slate-500">Disclaimer:</strong> Templates, contracts, and AI-generated business documents provided by this platform are not legal advice. Business owners are responsible for reviewing their legal, tax, and payment setup with their own attorney, accountant, or payment provider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="border-t border-black/5 bg-[#fcfaf5]">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-10 text-white lg:p-14">
            <h2 className="text-4xl font-semibold tracking-tight lg:text-5xl">
              Start with the website.
              <span className="mt-2 block text-emerald-300">Build from there.</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Get a site that looks great and brings in customers. Add CRM, operations, and automation when you&apos;re ready — all in the same platform.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="/contact"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Get started →
              </a>
              <a href="/marketplace"
                className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                Browse marketplace
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-[#f7f5ef]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <span className="text-base font-semibold text-slate-900">Main App</span>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Websites and growth tools for local businesses — barbershops, landscapers, pressure washers, and everyone in between.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: "Instagram", href: "https://instagram.com" },
                  { label: "X / Twitter", href: "https://x.com" },
                  { label: "LinkedIn", href: "https://linkedin.com" },
                  { label: "Facebook", href: "https://facebook.com" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-950">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                {[
                  { label: "Sample sites", href: "#sites"       },
                  { label: "Marketplace",  href: "/marketplace" },
                  { label: "Pricing",      href: "#pricing"     },
                  { label: "Features",     href: "#features"    },
                  { label: "Roadmap",      href: "#roadmap"     },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="transition hover:text-slate-950">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Company</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                {[
                  { label: "Team",             href: "/team"                     },
                  { label: "Contact",          href: "/contact"                  },
                  { label: "hello@mainapp.co", href: "mailto:hello@mainapp.co"   },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="transition hover:text-slate-950">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-black/5 pt-6 text-xs text-slate-400">
            © 2026 Main App · Built for local businesses everywhere.
          </div>
        </div>
      </footer>
    </main>
  );
}

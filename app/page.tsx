const trades = [
  "Landscaping",
  "Exterior Cleaning",
  "Painting",
  "Plumbing",
  "Roofing",
  "Junk Removal",
  "HVAC",
  "Doorknocking / Sales Teams",
];

const outcomes = [
  {
    title: "Get more leads",
    description:
      "Give service businesses a stronger online presence, better contact flows, and cleaner lead capture.",
  },
  {
    title: "Run jobs more efficiently",
    description:
      "Support crews, routes, check-ins, job flow, and daily operations from one system.",
  },
  {
    title: "Quote faster",
    description:
      "Help owners move from interest to estimate faster with smarter intake and future property-based tools.",
  },
  {
    title: "Follow up better",
    description:
      "Keep customer communication, reviews, reminders, and sales follow-up from slipping through the cracks.",
  },
];

const sampleSites = [
  {
    title: "Landscaping",
    blurb: "Seasonal offers, galleries, quote forms, and neighborhood trust-building.",
    accent: "from-emerald-50 to-lime-50",
  },
  {
    title: "Plumbing",
    blurb: "Emergency-first calls to action, fast scheduling, and high-trust local service pages.",
    accent: "from-sky-50 to-cyan-50",
  },
  {
    title: "Painting",
    blurb: "Premium before-and-after presentation, reviews, and project-focused conversion flow.",
    accent: "from-rose-50 to-pink-50",
  },
  {
    title: "Exterior Cleaning",
    blurb: "Simple lead capture, visual proof, and strong upsells for recurring maintenance work.",
    accent: "from-teal-50 to-emerald-50",
  },
];

const fitSteps = [
  "Choose your trade",
  "Pick what you need help with most",
  "See the best-fit setup for your business",
];

const roadmap = [
  "White-label websites",
  "Lead generation and intake",
  "CRM and customer tracking",
  "Crew and job workflow tools",
  "Auto estimating support",
  "Doorknocking metrics",
  "Map-based job support",
  "Review and SMS automation",
  "Marketing support tools",
  "Your own internal admin and business system",
];

const sectionLinks = [
  { href: "#top", label: "Top" },
  { href: "#trades", label: "Trades" },
  { href: "#sample-sites", label: "Samples" },
  { href: "#outcomes", label: "Outcomes" },
  { href: "#fit-finder", label: "Fit" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "/contact", label: "Contact" },
];

function SectionPillNav() {
  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="pointer-events-auto glass-card clean-shadow rounded-full border border-black/5 px-3 py-3">
        <div className="flex flex-col gap-2">
          {sectionLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main id="top" className="min-h-screen bg-[#f7f5ef] text-slate-950">
      <SectionPillNav />

      <section className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f5ef]/85 backdrop-blur-md section-fade">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="text-lg font-semibold tracking-tight text-slate-950">
            Main App
          </div>

          <nav className="hidden items-center gap-7 text-sm text-slate-600 lg:flex">
            <a href="#trades" className="transition hover:text-slate-950">
              Trades
            </a>
            <a href="#sample-sites" className="transition hover:text-slate-950">
              Samples
            </a>
            <a href="#fit-finder" className="transition hover:text-slate-950">
              Fit Finder
            </a>
            <a href="#roadmap" className="transition hover:text-slate-950">
              Roadmap
            </a>
            <a href="/contact" className="transition hover:text-slate-950">
              Contact
            </a>
          </nav>

          <a
            href="#fit-finder"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Find your setup
          </a>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f7f5ef] section-fade">
        <div className="animate-pulse-glow absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-100/60 to-transparent" />
        <div className="animate-float-soft absolute right-0 top-10 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="animate-float-soft-delayed absolute left-0 top-24 h-72 w-72 rounded-full bg-sky-200/25 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-24">
          <div className="max-w-3xl animate-fade-lift">
            <div className="inline-flex rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm">
              Clean websites, smarter systems, and growth tools for field-service businesses
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Build a stronger service business with a better website and better systems behind it.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Built for contractors, crews, and local service teams that want more leads, better follow-up, stronger branding, and smoother operations.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#sample-sites"
                className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                See sample sites
              </a>
              <a
                href="#fit-finder"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Find your best setup
              </a>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <div className="hover-rise rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-950">Broad enough to grow</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Start simple with the website, then expand into CRM, estimating, crew support, and marketing.
                </p>
              </div>

              <div className="hover-rise rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-950">Flexible by business type</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Adapt the offer for landscapers, painters, plumbers, cleaning companies, and sales teams.
                </p>
              </div>

              <div className="hover-rise rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-950">Built to become your own system too</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use this as the base for your own admin, tools, workflows, and higher-end internal setup.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center animate-fade-lift">
            <div className="clean-shadow-lg w-full rounded-[2rem] border border-black/5 bg-white p-4">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-200">Demo concept</p>
                    <p className="mt-1 text-2xl font-semibold">Exterior Cleaning Pro</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-emerald-100">
                    Live preview style
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl bg-white/10 p-5 hover-rise">
                    <p className="text-sm text-emerald-100">Homepage hero</p>
                    <div className="mt-3 h-24 rounded-xl bg-white/10" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/10 p-4 hover-rise">
                      <p className="text-xs text-emerald-100">Lead flow</p>
                      <div className="mt-3 h-20 rounded-xl bg-white/10" />
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 hover-rise">
                      <p className="text-xs text-emerald-100">Reviews</p>
                      <div className="mt-3 h-20 rounded-xl bg-white/10" />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-sky-200/10 p-4 ring-1 ring-inset ring-sky-100/20 hover-rise">
                    <p className="text-xs uppercase tracking-[0.18em] text-sky-100/80">
                      Future-ready
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-100">
                      Layer in CRM, estimating, field tools, and marketing automation as the business grows.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trades" className="border-t border-black/5 bg-[#fcfaf5] section-fade">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Built for your trade
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Start with who this is for
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Make it obvious that this platform can be shaped around the business type first, then layered with deeper tools over time.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trades.map((trade) => (
              <div
                key={trade}
                className="hover-rise rounded-3xl border border-black/5 bg-white p-5 text-sm font-semibold text-slate-900 shadow-sm"
              >
                {trade}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sample-sites" className="bg-[#f7f5ef] section-fade">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
              Sample websites by trade
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Then show what the website can look like
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Let people picture what they are buying before you move into systems, automation, and roadmap depth.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {sampleSites.map((site) => (
              <div
                key={site.title}
                className="hover-rise rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm"
              >
                <div className={`h-40 rounded-[1.5rem] border border-black/5 bg-gradient-to-br ${site.accent} p-4`}>
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-300" />
                      <span className="h-3 w-3 rounded-full bg-amber-300" />
                      <span className="h-3 w-3 rounded-full bg-emerald-300" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-2/3 rounded-full bg-white/70" />
                      <div className="h-16 rounded-2xl bg-white shadow-sm" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-slate-950">{site.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{site.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="outcomes" className="border-y border-black/5 bg-[#fcfaf5] section-fade">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Outcome-driven positioning
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              After that, explain what it helps them do
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Keep the story moving downward from identity, to visual examples, to business outcomes.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {outcomes.map((item, index) => (
              <div
                key={item.title}
                className={
                  index === 0
                    ? "hover-rise rounded-[2rem] border border-emerald-200 bg-emerald-50 p-7 shadow-sm"
                    : "hover-rise rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm"
                }
              >
                <h3 className="text-2xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fit-finder" className="bg-[#f7f5ef] section-fade">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Fit finder
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                Then guide them to the right setup
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Help visitors self-select without making the site feel like a wall of features or a confusing software dashboard.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#roadmap"
                  className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  See the roadmap
                </a>
                <a
                  href="/contact"
                  className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Contact us
                </a>
              </div>
            </div>

            <div className="glass-card clean-shadow rounded-[2rem] border border-black/5 p-6">
              <div className="rounded-[1.5rem] bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Sample flow
                </p>
                <div className="mt-6 space-y-4">
                  {fitSteps.map((step, index) => (
                    <div
                      key={step}
                      className="hover-rise flex items-start gap-4 rounded-2xl border border-black/5 bg-[#f7f5ef] p-4"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                        0{index + 1}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-950">{step}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          Keep the path easy, clear, and low-friction so even non-technical owners know where to go next.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap" className="border-y border-black/5 bg-[#fcfaf5] section-fade">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
              Roadmap
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Finish with what grows next
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Put the roadmap later in the scroll so it supports the sales story instead of interrupting it.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {roadmap.map((item) => (
              <div
                key={item}
                className="hover-rise rounded-3xl border border-black/5 bg-white p-5 text-sm font-medium text-slate-800 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5ef] section-fade">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <div className="clean-shadow-lg rounded-[2rem] border border-black/5 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-10 text-white lg:p-12">
            <h2 className="text-4xl font-semibold tracking-tight">
              Start with the sales site now. Build the bigger system behind it next.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
              That gives you something usable fast, while keeping the door open for your own admin, your own website tools, and a stronger long-term platform.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/contact"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Contact us
              </a>
              <a
                href="#top"
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back to top
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-black/5 bg-white px-6 py-5 text-sm text-slate-600 shadow-sm md:flex-row">
            <div className="font-medium text-slate-900">
              Keep moving with the sections below.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {sectionLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full bg-[#f7f5ef] px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-950 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

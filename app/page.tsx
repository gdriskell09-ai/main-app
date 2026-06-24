const featureGroups = [
  {
    title: "Sell",
    description:
      "White-label websites, lead capture, CRM, customer lists, and full doorknocking support.",
    items: [
      "White-label websites",
      "Lead generation",
      "CRM and customer tracking",
      "Customer lists and merging",
      "Doorknocking metrics",
    ],
  },
  {
    title: "Operate",
    description:
      "Crew management, route support, map tools, invoicing, and business operations in one place.",
    items: [
      "Crew management",
      "Route and map tools",
      "Gas, food, and medical map points",
      "Invoicing",
      "Past job tracking",
    ],
  },
  {
    title: "Estimate",
    description:
      "Build faster quotes with property intelligence, surface measurement, and owner-facing base estimates.",
    items: [
      "Auto estimating",
      "Surface measurement tools",
      "GIS and Google property data",
      "Photo-assisted estimates",
      "Base estimate tools",
    ],
  },
  {
    title: "Market",
    description:
      "Drive reviews, SMS outreach, social visibility, and future AI-assisted marketing workflows.",
    items: [
      "Review automation",
      "SMS marketing",
      "Social connection tools",
      "Lead source tracking",
      "Auto video marketing roadmap",
    ],
  },
];

const plans = [
  {
    name: "Basic",
    description:
      "The entry level system for white-label websites, leads, and customer management.",
    bullets: [
      "White-label website",
      "Lead capture",
      "CRM",
      "Customer lists",
      "Invoicing",
    ],
    featured: false,
  },
  {
    name: "Pro",
    description:
      "Adds stronger operations, estimating workflows, and selected AI-assisted tools.",
    bullets: [
      "Everything in Basic",
      "Crew tools",
      "Map features",
      "Doorknocking metrics",
      "Smarter estimating",
    ],
    featured: true,
  },
  {
    name: "Advanced",
    description:
      "The full system with advanced automation, AI support, and deeper business intelligence.",
    bullets: [
      "Everything in Pro",
      "Property enrichment",
      "Advanced AI assistance",
      "Marketing automation",
      "Custom integrations",
    ],
    featured: false,
  },
];

const roadmapGroups = [
  {
    title: "Available now",
    items: [
      "White-label websites",
      "Lead generation",
      "CRM and customer lists",
      "Customer merging",
      "Crew management",
      "Invoicing",
    ],
  },
  {
    title: "In development",
    items: [
      "Map tools for gas, food, and medical",
      "Auto estimating and surface measurement",
      "Doorknocking metrics",
      "Property intelligence from GIS and Google sources",
    ],
  },
  {
    title: "Advanced AI layer",
    items: [
      "AI recommendations",
      "Emergency late-job response tools",
      "Marketing idea generation",
      "Auto video marketing generation",
    ],
  },
  {
    title: "Custom and enterprise",
    items: [
      "Jobber-style workflow tools",
      "QuickBooks-style finance support",
      "SalesRabbit-style canvassing features",
      "Government and bank-linked workflows",
    ],
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              White-label software for home-service businesses
            </div>

            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              Sell branded websites, CRM, and crew tools under your own brand.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              Built for landscapers, painters, plumbers, exterior cleaning
              companies, doorknocking teams, and service businesses that want a
              stronger brand, better operations, and more leads.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#pricing"
                className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-300"
              >
                View levels
              </a>
              <a
                href="#roadmap"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View roadmap
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-medium text-white">
                  Built for local service businesses
                </p>
                <p className="mt-2 text-sm text-neutral-400">
                  Landscaping, painting, plumbing, exterior cleaning, and more.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-medium text-white">
                  Sell it as a website or full platform
                </p>
                <p className="mt-2 text-sm text-neutral-400">
                  Start with the website and expand into CRM, estimating, and
                  operations.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-medium text-white">
                  AI where it helps, not where it gets in the way
                </p>
                <p className="mt-2 text-sm text-neutral-400">
                  Keep the core product usable without forcing an AI dependency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              A platform that helps home-service businesses sell, operate,
              estimate, and market better
            </h2>
            <p className="mt-4 text-neutral-300">
              Keep the offer simple up front, then expand the product depth as
              customers need more.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {featureGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
              >
                <h3 className="text-xl font-semibold text-white">
                  {group.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {group.description}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-neutral-200">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">Levels</h2>
            <p className="mt-4 text-neutral-300">
              Package the platform by capability so customers can grow into it.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.featured
                    ? "rounded-3xl border border-cyan-400/40 bg-cyan-400/8 p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)]"
                    : "rounded-3xl border border-white/10 bg-white/[0.03] p-6"
                }
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {plan.featured ? (
                    <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-medium text-cyan-200">
                      Most popular
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-7 text-neutral-300">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3 text-sm text-neutral-200">
                  {plan.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roadmap" className="border-b border-white/10 bg-neutral-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">Roadmap</h2>
            <p className="mt-4 text-neutral-300">
              Show what the product does now, what is coming next, and what can
              be delivered for advanced clients.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {roadmapGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <h3 className="text-xl font-semibold">{group.title}</h3>
                <ul className="mt-5 space-y-3 text-sm text-neutral-300">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 p-8 lg:p-12">
            <h2 className="text-3xl font-semibold tracking-tight">
              Start with a better-looking sales site, then build the platform
              behind it one step at a time.
            </h2>
            <p className="mt-4 max-w-2xl text-neutral-300">
              The right move now is a polished front-end message, not trying to
              ship every advanced feature at once.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#pricing"
                className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-300"
              >
                Start with the offer
              </a>
              <a
                href="#roadmap"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Keep building the roadmap
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

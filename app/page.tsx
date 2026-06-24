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

const examples = [
  {
    title: "Website-first setup",
    description:
      "A cleaner online presence for businesses that need a better brand, more trust, and more inbound leads.",
  },
  {
    title: "Growth-focused setup",
    description:
      "A stronger system for teams that need websites, lead handling, reviews, outreach, and better visibility.",
  },
  {
    title: "Operations-focused setup",
    description:
      "A broader setup for businesses that want estimating, tracking, crew tools, and deeper business workflows.",
  },
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              Websites, systems, and growth tools for field-service businesses
            </div>

            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              Build a stronger service business with a better website and better
              systems behind it.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              Built for contractors, crews, and local service teams that want
              more leads, better follow-up, stronger branding, and smoother
              operations.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#trades"
                className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-300"
              >
                Explore by trade
              </a>
              <a
                href="#examples"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See possible setups
              </a>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-medium text-white">
                Broad enough to grow
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Start simple with the website, then expand into CRM,
                estimating, crew support, and marketing.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-medium text-white">
                Flexible by business type
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Adapt the offer for landscapers, painters, plumbers, cleaning
                companies, and sales teams.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-medium text-white">
                Built to become your own system too
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Use this as the base for your own admin, tools, workflows, and
                higher-end internal setup.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="trades"
        className="border-b border-white/10 bg-neutral-900/40"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              Built for service businesses that need more than a basic website
            </h2>
            <p className="mt-4 text-neutral-300">
              Position the system around the kind of business they run, then
              show the features and workflows that matter most to them.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trades.map((trade) => (
              <div
                key={trade}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm font-medium text-neutral-200 transition hover:border-cyan-400/30 hover:bg-white/[0.05]"
              >
                {trade}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              Sell outcomes first
            </h2>
            <p className="mt-4 text-neutral-300">
              People do not buy software categories first. They buy a better
              result for their business.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {outcomes.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="examples"
        className="border-b border-white/10 bg-neutral-900/40"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              Start with the right level of setup
            </h2>
            <p className="mt-4 text-neutral-300">
              Keep the structure flexible. Some businesses need a better site
              first. Others need a broader system behind it.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {examples.map((example, index) => (
              <div
                key={example.title}
                className={
                  index === 1
                    ? "rounded-3xl border border-cyan-400/30 bg-cyan-400/5 p-6"
                    : "rounded-3xl border border-white/10 bg-white/[0.03] p-6"
                }
              >
                <h3 className="text-xl font-semibold text-white">
                  {example.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {example.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              Keep the first version simple
            </h2>
            <p className="mt-4 text-neutral-300">
              The first goal is a clean public-facing site that sells the idea
              well. Then build the deeper tools behind it.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm font-medium text-cyan-300">Now</p>
              <ul className="mt-4 space-y-3 text-sm text-neutral-300">
                <li>Clear public homepage</li>
                <li>Trade-specific positioning</li>
                <li>Examples of possible setups</li>
                <li>Stronger sales messaging</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm font-medium text-cyan-300">Next</p>
              <ul className="mt-4 space-y-3 text-sm text-neutral-300">
                <li>Questionnaire flow</li>
                <li>Sample websites by trade</li>
                <li>Your private admin area</li>
                <li>Your own advanced internal website/system</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap" className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">Roadmap</h2>
            <p className="mt-4 text-neutral-300">
              Keep the vision broad, but present it in a way that still feels
              believable and focused.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {roadmap.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-neutral-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 p-8 lg:p-12">
            <h2 className="text-3xl font-semibold tracking-tight">
              Start with the sales site now. Build the bigger system behind it
              next.
            </h2>
            <p className="mt-4 max-w-2xl text-neutral-300">
              That gives you something usable fast, while keeping the door open
              for your own admin, your own website tools, and a stronger
              long-term platform.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#trades"
                className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-300"
              >
                Keep building
              </a>
              <a
                href="#roadmap"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Review roadmap
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

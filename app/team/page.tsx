import SiteHeader from "../components/SiteHeader";

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-slate-950">
      <SiteHeader activePath="/team" />

      {/* Hero */}
      <section className="border-b border-black/5 bg-white px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">The team</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Built by someone who gets it.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Main App started with one question: why does every local service business have to choose between a great website, a working CRM, and tools that help them grow? The answer is — they shouldn&apos;t have to.
          </p>
        </div>
      </section>

      {/* Team member */}
      <section className="px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
            <div className="h-3 bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-500" />
            <div className="p-8 lg:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-950 text-2xl font-bold text-white">
                  G
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-slate-950">Grant Driskell</h2>
                  <p className="mt-1 text-sm font-medium text-emerald-700">Founder</p>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    Operator-turned-builder. Grant started Main App after watching too many local businesses lose customers because they couldn&apos;t afford the tools the big guys use. The goal: give every local business — barbershops, landscapers, pressure washers, personal trainers — a fighting chance online.
                  </p>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    The platform is built with the same tools used by high-growth startups, priced for the business owner who&apos;s focused on the work, not the tech stack.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                      className="rounded-full border border-black/10 bg-[#f7f5ef] px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400">
                      Instagram
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                      className="rounded-full border border-black/10 bg-[#f7f5ef] px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400">
                      LinkedIn
                    </a>
                    <a href="mailto:hello@mainapp.co"
                      className="rounded-full border border-black/10 bg-[#f7f5ef] px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400">
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-t border-black/5 bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">What we&apos;re building</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { emoji: "🌐", title: "Websites that convert", body: "Not templates. Business-specific layouts built to turn visitors into customers." },
              { emoji: "📋", title: "A CRM that makes sense", body: "Leads, customers, jobs, quotes, invoices — all in one place, built for how you actually work." },
              { emoji: "🚪", title: "Tools for the field", body: "Door-knocking maps, territory tracking, and canvassing tools for businesses that grow on the ground." },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-black/5 p-5 shadow-sm">
                <div className="mb-3 text-3xl">{item.emoji}</div>
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <a href="/contact" className="rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Work with us →
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 px-6 py-8 text-center text-xs text-slate-500">
        © 2026 Main App · <a href="/" className="hover:text-slate-950">Home</a> · <a href="/marketplace" className="hover:text-slate-950">Marketplace</a> · <a href="mailto:hello@mainapp.co" className="hover:text-slate-950">hello@mainapp.co</a>
      </footer>
    </main>
  );
}

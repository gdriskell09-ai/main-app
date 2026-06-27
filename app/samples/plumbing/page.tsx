const services = [
  { icon: "💧", title: "Leak Repair", description: "Pipe leaks, slab leaks, and hidden water damage. We locate and fix leaks fast before they cause serious damage." },
  { icon: "🚿", title: "Drain Cleaning", description: "Clogged drains cleared with professional hydro-jetting. We don't just mask the problem — we clear it completely." },
  { icon: "🌡️", title: "Water Heaters", description: "Tank and tankless water heater installation, repair, and replacement. Same-day service on most jobs." },
  { icon: "🔩", title: "Pipe Work", description: "Re-piping, pipe relining, and full plumbing installation for new construction and remodels." },
  { icon: "🏠", title: "Sewer & Drain", description: "Sewer line repair, hydro-jetting, camera inspection, and trenchless sewer replacement." },
  { icon: "⚡", title: "Emergency Plumbing", description: "Burst pipes, overflows, and gas line emergencies. Available 24/7 — we pick up on the first ring." },
];

const reviews = [
  { name: "Marcus L.", stars: 5, text: "Burst pipe at 11pm on a Sunday. FlowRight had a plumber at my door within an hour. Saved my hardwood floors. Cannot recommend them enough." },
  { name: "Denise W.", stars: 5, text: "Finally found a plumber who doesn't try to upsell me on everything. Straight quote, showed up on time, cleaned up after. That's all I ask." },
  { name: "Paul G.", stars: 5, text: "Had them do a full re-pipe on an older home. Three days, no surprises, and the price came in under the estimate. Rare find." },
];

export default function PlumbingDemo() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* Emergency bar */}
      <div className="bg-orange-600 px-4 py-2 text-center text-sm font-bold text-white">
        🚨 Burst pipe? Flooding? Call 24/7: (555) 710-0400
      </div>

      {/* Nav */}
      <header className="border-b border-black/5 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-tight text-[#1c2e4a]">FlowRight</span>
            <span className="ml-1.5 text-sm font-medium text-slate-500">Plumbing & Drain</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#reviews" className="hover:text-slate-900">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden text-sm font-bold text-[#1c2e4a] md:block">(555) 710-0400</a>
            <a href="/contact" className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700">
              Book a Plumber
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1c2e4a] to-[#253d61] px-6 py-24 text-white lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-orange-200">
              ⭐ 4.9 · 600+ jobs · Licensed Master Plumbers
            </div>
            <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
              Plumbing fixed right.
              <span className="block text-orange-400">The first time.</span>
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-slate-300">
              No mysteries, no markups, no call centers. Just a licensed plumber who shows up, fixes the problem, and gives you a fair price.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="/contact" className="rounded-full bg-orange-600 px-8 py-4 text-base font-bold text-white transition hover:bg-orange-700">
                Book a Plumber
              </a>
              <a href="#" className="rounded-full border border-white/40 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10">
                📞 Emergency Line
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-black/5 bg-orange-50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-[#1c2e4a]">
          {["✓ Licensed Master Plumbers", "✓ 24/7 Emergency Service", "✓ Upfront Flat-Rate Pricing", "✓ Same-Day Available", "✓ Fully Insured"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="services" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-600">Our Work</p>
            <h2 className="mt-2 text-4xl font-bold text-[#1c2e4a]">Plumbing Services</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 text-4xl">{s.icon}</div>
                <h3 className="text-lg font-bold text-[#1c2e4a]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-[#1c2e4a] px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold">Trusted by Homeowners</h2>
            <p className="mt-2 text-slate-400">4.9 stars · 150+ Google reviews</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl bg-white/10 p-6">
                <div className="mb-3 text-yellow-300">{"★".repeat(r.stars)}</div>
                <p className="text-sm leading-7 text-slate-300">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 text-sm font-bold text-white">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-4xl font-bold text-[#1c2e4a]">Why FlowRight?</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { title: "Upfront flat-rate pricing", body: "You'll know the cost before we start. No hourly surprises, no hidden fees." },
              { title: "We own the work", body: "Every repair is backed by our 1-year labor warranty. If something goes wrong, we come back." },
              { title: "Real plumbers, not dispatchers", body: "When you call, a licensed plumber answers — not an answering service or call center." },
              { title: "Respect for your home", body: "We wear boot covers, protect your floors, and clean up completely before we leave." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 p-6">
                <p className="font-bold text-[#1c2e4a]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-600 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold">Ready to fix it the right way?</h2>
          <p className="mt-4 text-lg text-orange-100">Book online or call 24/7. Same-day available on most jobs.</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="/contact" className="rounded-full bg-white px-8 py-4 text-base font-bold text-orange-600 transition hover:bg-orange-50">Book Online</a>
            <a href="#" className="rounded-full border-2 border-white/60 px-8 py-4 text-base font-bold transition hover:bg-white/10">(555) 710-0400</a>
          </div>
        </div>
      </section>

      <footer className="bg-[#111e30] px-6 py-8 text-center text-xs text-slate-600">
        © 2026 FlowRight Plumbing · Licensed Master Plumbers · 24/7 Emergency Service
      </footer>
    </div>
  );
}

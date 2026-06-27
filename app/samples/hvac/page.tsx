const services = [
  { icon: "❄️", title: "AC Installation", description: "New central air, ductless mini-splits, or zoned systems. We size and install the right unit for your home." },
  { icon: "🔥", title: "Furnace & Heating", description: "Gas, electric, or heat pump furnace installation and repair. Fast diagnostics, same-day service available." },
  { icon: "🌀", title: "Heat Pumps", description: "Energy-efficient heating and cooling in one system. We install and service all major heat pump brands." },
  { icon: "📋", title: "Maintenance Plans", description: "Annual tune-ups keep your system running efficiently and prevent costly breakdowns. Starting at $129/year." },
  { icon: "🌿", title: "Air Quality", description: "Whole-home air purifiers, UV systems, humidifiers, and duct cleaning to improve the air your family breathes." },
  { icon: "⚡", title: "Emergency Repairs", description: "24/7 emergency HVAC service. We answer on the first ring and dispatch a tech within the hour." },
];

const reviews = [
  { name: "Sharon T.", stars: 5, text: "Our AC went out on a Friday night in July. Arctic Air had someone at our house within 90 minutes. Fixed the same night. Lifesavers." },
  { name: "Jim K.", stars: 5, text: "Installed a new heat pump system for us — the tech explained every step, cleaned up everything, and the price matched the quote exactly." },
  { name: "Rachel M.", stars: 5, text: "We're on their maintenance plan. They caught a cracked heat exchanger before it became a carbon monoxide problem. Worth every penny." },
];

export default function HvacDemo() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* Emergency bar */}
      <div className="bg-red-600 px-4 py-2 text-center text-sm font-bold text-white">
        🚨 24/7 Emergency Service — Call Now: (555) 840-0300
      </div>

      {/* Nav */}
      <header className="border-b border-black/5 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-tight text-[#1a2f50]">Arctic Air</span>
            <span className="ml-1.5 text-sm font-medium text-slate-500">HVAC & Mechanical</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#reviews" className="hover:text-slate-900">Reviews</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden text-sm font-bold text-[#1a2f50] md:block">(555) 840-0300</a>
            <a href="/contact" className="rounded-full bg-[#1a2f50] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#263d6b]">
              Free Estimate
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a2f50] to-[#263d6b] px-6 py-24 text-white lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-blue-200">
              ⭐ 4.9 · 800+ jobs completed · Licensed & Insured
            </div>
            <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
              HVAC service you can
              <span className="block text-blue-300">actually count on.</span>
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-blue-100">
              Fast, honest HVAC repair and installation — residential and light commercial. We answer the phone and we show up on time.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="/contact" className="rounded-full bg-white px-8 py-4 text-base font-bold text-[#1a2f50] transition hover:bg-blue-50">
                Schedule Service
              </a>
              <a href="#" className="rounded-full border border-white/40 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10">
                📞 Emergency Line
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-black/5 bg-blue-50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-[#1a2f50]">
          {["✓ 24/7 Emergency Service", "✓ Licensed & Insured", "✓ Same-Day Available", "✓ Up-Front Pricing", "✓ 100% Satisfaction Guarantee"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="services" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">What We Do</p>
            <h2 className="mt-2 text-4xl font-bold text-[#1a2f50]">Heating & Cooling Services</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 text-4xl">{s.icon}</div>
                <h3 className="text-lg font-bold text-[#1a2f50]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-[#f0f6ff] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-[#1a2f50]">How It Works</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { step: "1", title: "Call or Book Online", body: "Reach us 24/7 by phone or schedule online in under 2 minutes. No hold music, no call centers." },
              { step: "2", title: "Same-Day Dispatch", body: "A certified technician arrives on time. We give you a 2-hour window and text when we're 30 minutes out." },
              { step: "3", title: "Up-Front Price", body: "We diagnose the issue and give you an exact price before we start. No surprises on the invoice." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl bg-white p-7 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1a2f50] text-xl font-bold text-white">{s.step}</div>
                <h3 className="text-lg font-bold text-[#1a2f50]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-[#1a2f50] px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold">What Customers Say</h2>
            <p className="mt-2 text-blue-300">4.9 stars · 200+ Google reviews</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl bg-white/10 p-6">
                <div className="mb-3 text-yellow-300">{"★".repeat(r.stars)}</div>
                <p className="text-sm leading-7 text-blue-100">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 text-sm font-bold text-white">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-600 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold">AC down? Heat not working?</h2>
          <p className="mt-4 text-lg text-red-100">We&apos;re available right now. Call or schedule online.</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#" className="rounded-full bg-white px-8 py-4 text-base font-bold text-red-600 transition hover:bg-red-50">
              📞 (555) 840-0300
            </a>
            <a href="/contact" className="rounded-full border-2 border-white/60 px-8 py-4 text-base font-bold transition hover:bg-white/10">
              Schedule Online
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#111d30] px-6 py-8 text-center text-xs text-slate-600">
        © 2026 Arctic Air HVAC · Licensed & Insured · 24/7 Emergency Service
      </footer>
    </div>
  );
}

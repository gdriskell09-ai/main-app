const services = [
  { icon: "🏡", title: "Exterior Painting", description: "Full exterior painting including prep, priming, and two coats. We protect your landscaping and clean up completely." },
  { icon: "🛋️", title: "Interior Painting", description: "Wall, ceiling, trim, and accent walls done right. We move furniture, tape edges perfectly, and leave zero mess." },
  { icon: "🚪", title: "Cabinet Refinishing", description: "Transform dated cabinets without the cost of replacement. Factory-smooth finish using professional spray equipment." },
  { icon: "🖌️", title: "Deck & Fence Staining", description: "Prep, stain, and seal your deck or fence to protect it from the elements and keep it looking fresh for years." },
  { icon: "🏢", title: "Commercial Painting", description: "Office buildings, retail spaces, and rental properties. We work around your schedule to minimize downtime." },
  { icon: "✨", title: "Drywall Repair", description: "Holes, cracks, water damage — we fix it and paint over it so smoothly you won't know it was ever there." },
];

const reviews = [
  { name: "Lindsey T.", stars: 5, text: "Apex painted our entire interior in 3 days. The walls look flawless — you can't tell where they cut in against the crown molding. Exceptional work." },
  { name: "Phil D.", stars: 5, text: "I hired them for cabinet refinishing after getting quotes from 3 companies. Best price and the results look like new construction. Unbelievable." },
  { name: "Susan K.", stars: 5, text: "They refinished our deck and it looks brand new. Showed up on time, worked clean, finished ahead of schedule. 10/10." },
];

export default function PaintingDemo() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* Nav */}
      <header className="border-b border-black/5 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-950">Apex</span>
            <span className="ml-1 text-sm font-medium text-slate-500">Painting Co.</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#reviews" className="hover:text-slate-900">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden text-sm font-semibold text-slate-950 md:block">(555) 190-0400</a>
            <a href="/contact" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
              Free Estimate
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-950 to-slate-800 px-6 py-24 text-white lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-slate-300">
              ⭐ 4.9 · Licensed & Insured · [Your City]
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight lg:text-6xl">
              Painting done the
              <span className="block text-slate-300">right way.</span>
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-slate-400">
              Interior, exterior, cabinets, and more. Apex Painting delivers flawless finishes for homeowners and businesses who don&apos;t settle for good enough.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="/contact" className="rounded-full bg-white px-8 py-4 text-base font-bold text-slate-950 transition hover:bg-slate-100">
                Get Free Estimate
              </a>
              <a href="#" className="rounded-full border border-white/30 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10">
                (555) 190-0400
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-black/5 bg-slate-50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-slate-700">
          {["✓ Licensed & Insured", "✓ Free Estimates", "✓ All Work Guaranteed", "✓ 10+ Years Experience", "✓ Locally Owned"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="services" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">What We Do</p>
            <h2 className="mt-2 text-4xl font-bold text-slate-950">Our Services</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">From a single accent wall to a full commercial repaint, we have the crew and equipment to do it right.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 text-4xl">{s.icon}</div>
                <h3 className="text-lg font-bold text-slate-950">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold">How We Work</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { n: "1", title: "Free estimate", body: "We come out, assess the job, and give you an upfront written quote. No surprises." },
              { n: "2", title: "Prep & protect", body: "We protect your floors, furniture, and landscaping before a single brush stroke." },
              { n: "3", title: "Perfect finish", body: "Two coats minimum, proper drying time, and crisp lines that make the work stand out." },
              { n: "4", title: "Full cleanup", body: "We remove all tape, touch up anything needed, and leave your space cleaner than we found it." },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/20 text-lg font-bold text-white">
                  {step.n}
                </div>
                <h3 className="font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Testimonials</p>
            <h2 className="mt-2 text-4xl font-bold text-slate-950">Our Work Speaks for Itself</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="mb-4 text-amber-400">{"★".repeat(r.stars)}</div>
                <p className="text-sm leading-7 text-slate-700">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 text-sm font-bold text-slate-500">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold">Ready to Transform Your Space?</h2>
          <p className="mt-4 text-lg text-slate-400">Get your free, no-obligation estimate. We respond same day.</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="/contact" className="rounded-full bg-white px-8 py-4 text-base font-bold text-slate-950 transition hover:bg-slate-100">
              Request Free Estimate
            </a>
            <a href="#" className="rounded-full border border-white/30 px-8 py-4 text-base font-bold transition hover:bg-white/10">
              (555) 190-0400
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black px-6 py-8 text-center text-xs text-slate-600">
        © 2026 Apex Painting Co. · Licensed & Insured · [Your City]
      </footer>
    </div>
  );
}

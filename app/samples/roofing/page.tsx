const services = [
  { icon: "🏠", title: "Roof Replacement", description: "Full tear-off and replacement with architectural shingles, proper flashing, and a clean ridge cap. Done in one day." },
  { icon: "🔧", title: "Roof Repair", description: "Missing shingles, leaks, storm damage — we find the problem and fix it properly so it doesn't come back." },
  { icon: "🌧️", title: "Leak Diagnosis", description: "We trace the source of any leak, even tricky ones, and fix it right. Written report included." },
  { icon: "🌬️", title: "Storm Damage Claims", description: "We inspect and document storm damage and work directly with your insurance adjuster to maximize your claim." },
  { icon: "🪟", title: "Gutters & Fascia", description: "New gutters, gutter guards, fascia boards, and soffit repair — everything above the siding line." },
  { icon: "📋", title: "Free Inspections", description: "Not sure if you have a problem? We'll get up there and tell you honestly. Free for homeowners." },
];

const reviews = [
  { name: "Brenda H.", stars: 5, text: "Storm took out a section of our roof on a Tuesday. Ridge Line had it fully replaced by Thursday. Fast, clean, and exactly what they quoted." },
  { name: "Tom S.", stars: 5, text: "They helped us through the entire insurance claim. We didn't pay a dime out of pocket. Couldn't ask for more professional service." },
  { name: "Carla M.", stars: 5, text: "Had a leak that two other roofers couldn't find. Ridge Line found it in 20 minutes. Honest, skilled, and fair priced." },
];

export default function RoofingDemo() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* Nav */}
      <header className="border-b border-black/5 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-tight text-[#1e2d40]">Ridge Line</span>
            <span className="ml-1 text-sm font-medium text-slate-500">Roofing</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#reviews" className="hover:text-slate-900">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden text-sm font-semibold text-[#1e2d40] md:block">(555) 964-0300</a>
            <a href="/contact" className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700">
              Free Inspection
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e2d40] via-[#2a3d57] to-[#1e2d40] px-6 py-24 text-white lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-slate-300">
              ⭐ 4.9 · GAF Certified · Licensed & Insured
            </div>
            <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
              Your Roof.
              <span className="block text-red-400">Our Reputation.</span>
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-slate-300">
              Licensed, certified, and insurance-approved. Ridge Line Roofing handles repairs, replacements, and storm claims across your area and surrounding counties.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="/contact" className="rounded-full bg-red-600 px-8 py-4 text-base font-bold text-white transition hover:bg-red-700">
                Free Roof Inspection
              </a>
              <a href="#" className="rounded-full border border-white/30 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10">
                📞 (555) 964-0300
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-400">Most inspections completed within 24 hours of your request.</p>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-black/5 bg-slate-50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-[#1e2d40]">
          {["✓ GAF Certified", "✓ Licensed & Insured", "✓ Insurance Claims Specialist", "✓ Lifetime Warranty Available", "✓ Free Inspections"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="services" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-red-500">What We Do</p>
            <h2 className="mt-2 text-4xl font-bold text-[#1e2d40]">Roofing Services</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 text-4xl">{s.icon}</div>
                <h3 className="text-lg font-bold text-[#1e2d40]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-[#1e2d40] px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold">What Homeowners Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl bg-white/10 p-6">
                <div className="mb-3 text-red-400">{"★".repeat(r.stars)}</div>
                <p className="text-sm leading-7 text-slate-200">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 text-sm font-bold text-slate-300">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-600 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold">Don&apos;t Wait on a Roof Problem.</h2>
          <p className="mt-4 text-lg text-red-100">Small issues become big repairs fast. Get a free inspection and know exactly where you stand.</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="/contact" className="rounded-full bg-white px-8 py-4 text-base font-bold text-red-700 transition hover:bg-red-50">Schedule Free Inspection</a>
            <a href="#" className="rounded-full border-2 border-white/60 px-8 py-4 text-base font-bold transition hover:bg-white/10">(555) 964-0300</a>
          </div>
        </div>
      </section>

      <footer className="bg-[#0f1a26] px-6 py-8 text-center text-xs text-slate-600">
        © 2026 Ridge Line Roofing · Licensed & Insured · GAF Certified
      </footer>
    </div>
  );
}

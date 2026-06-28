const services = [
  { icon: "🌿", title: "Lawn Mowing & Edging", description: "Clean cuts, crisp edges, clippings cleared. Weekly, bi-weekly, or one-time service available." },
  { icon: "🌳", title: "Landscape Design", description: "We plan and install beds, borders, and plantings that look great and thrive in your climate." },
  { icon: "🍂", title: "Seasonal Cleanup", description: "Spring and fall cleanup to prep your yard for the season ahead — debris, leaves, pruning, mulching." },
  { icon: "💧", title: "Irrigation & Drainage", description: "Install or service sprinkler systems and drainage solutions so your yard stays healthy and dry." },
  { icon: "🌱", title: "Sod & Seeding", description: "New lawns, overseeding thin areas, or repairing damaged patches — we get grass growing right." },
  { icon: "✂️", title: "Hedge & Tree Trimming", description: "Maintain clean, shapely hedges and properly pruned trees that boost your home's curb appeal." },
];

const reviews = [
  { name: "Robert L.", stars: 5, text: "GreenEdge has been doing our lawn for 3 years. Never once had to chase them — they show up, they do good work, and it shows." },
  { name: "Amanda P.", stars: 5, text: "We hired them for a full backyard redesign. The beds they installed look incredible. Neighbors keep asking who did our yard." },
  { name: "Chris H.", stars: 5, text: "Best price in town for the quality you get. Showed up on time, cleaned up after themselves, yard looks perfect." },
];

export default function LandscapingDemo() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* Nav */}
      <header className="border-b border-black/5 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-tight text-[#1a4a1a]">GreenEdge</span>
            <span className="ml-1 text-sm font-medium text-slate-500">Lawn & Landscaping</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#reviews" className="hover:text-slate-900">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden text-sm font-semibold text-[#1a4a1a] md:block">(555) 420-0900</a>
            <a href="/contact" className="rounded-full bg-[#1a4a1a] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#2a6a2a]">
              Free Estimate
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a4a1a] to-[#2d7a2d] px-6 py-24 text-white lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-green-200">
              ⭐ 4.8 stars · Serving your area since 2017
            </div>
            <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
              Your Yard, Done Right.
              <span className="block text-green-300">Every Single Week.</span>
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-green-100">
              Full-service lawn care and landscaping for homeowners who want a beautiful yard without lifting a finger.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="/contact" className="rounded-full bg-white px-8 py-4 text-base font-bold text-[#1a4a1a] transition hover:bg-green-50">
                Get Free Estimate
              </a>
              <a href="#" className="rounded-full border border-white/40 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10">
                📞 (555) 420-0900
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-green-50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-[#1a4a1a]">
          {["✓ Licensed & Insured", "✓ Free Estimates", "✓ Flexible Schedules", "✓ No Contracts Required", "✓ Locally Owned"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="services" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-green-600">What We Offer</p>
            <h2 className="mt-2 text-4xl font-bold text-[#1a4a1a]">Full-Service Lawn Care</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">From weekly mowing to full landscape installs — we handle everything your outdoor space needs.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-3 text-4xl">{s.icon}</div>
                <h3 className="text-lg font-bold text-[#1a4a1a]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-[#1a4a1a] px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold">Trusted by Hundreds of Homeowners</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl bg-white/10 p-6">
                <div className="mb-3 text-green-400">{"★".repeat(r.stars)}</div>
                <p className="text-sm leading-7 text-green-100">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 text-sm font-bold">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-500 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold">Get a Free Estimate Today</h2>
          <p className="mt-4 text-lg text-green-100">No commitment, no pressure. We&apos;ll walk your property and give you an honest price.</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="/contact" className="rounded-full bg-white px-8 py-4 text-base font-bold text-green-700 transition hover:bg-green-50">Request Estimate</a>
            <a href="#" className="rounded-full border-2 border-white/60 px-8 py-4 text-base font-bold transition hover:bg-white/10">(555) 420-0900</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d2e0d] px-6 py-10 text-slate-400">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 text-center text-sm md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-bold text-white">GreenEdge Lawn & Landscaping</p>
            <p className="mt-1">Serving your area and surrounding areas since 2017</p>
          </div>
          <div className="space-y-1">
            <p>📞 (555) 420-0900</p>
            <p>✉️ hello@greenedgelawn.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

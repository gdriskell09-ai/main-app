const services = [
  { icon: "🏠", title: "Standard Cleaning", description: "Recurring home cleaning — kitchens, baths, bedrooms, floors, and surfaces. Weekly, bi-weekly, or monthly." },
  { icon: "✨", title: "Deep Cleaning", description: "Top-to-bottom cleaning including baseboards, inside appliances, cabinet fronts, and everything in between." },
  { icon: "📦", title: "Move In / Move Out", description: "Spotless for new owners or get your deposit back. We clean everything the regular service misses." },
  { icon: "🏢", title: "Office Cleaning", description: "Keep your workspace clean and professional. Daily, weekly, or one-time commercial cleaning available." },
  { icon: "🎉", title: "Post-Event Cleanup", description: "After parties, rentals, or construction. We handle the chaos so you don't have to." },
  { icon: "🌿", title: "Eco Cleaning", description: "All-natural, non-toxic products that are safe for kids, pets, and the environment. Just as effective." },
];

const reviews = [
  { name: "Megan S.", stars: 5, text: "Sparkle has cleaned our house every two weeks for a year. Consistent, thorough, and the team is always professional. Worth every penny." },
  { name: "Dave R.", stars: 5, text: "We needed a move-out clean on short notice. They came the next day and the landlord said it was the cleanest he'd seen a unit. Got the full deposit back." },
  { name: "Priya N.", stars: 5, text: "I switched to their eco-friendly option because of my toddler and it works just as well. The house smells clean without that chemical smell." },
];

export default function CleaningDemo() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* Nav */}
      <header className="border-b border-black/5 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-tight text-[#1a3a4a]">Sparkle</span>
            <span className="ml-1 text-sm font-medium text-slate-500">Home & Office Cleaning</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#reviews" className="hover:text-slate-900">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden text-sm font-semibold text-[#1a3a4a] md:block">(555) 772-0200</a>
            <a href="/contact" className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600">
              Book Now
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-600 to-sky-800 px-6 py-24 text-white lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-sky-200">
              ⭐ 4.9 · 300+ happy clients · [Your City]
            </div>
            <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
              A cleaner home,
              <span className="block text-sky-200">without the effort.</span>
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-sky-100">
              Professional cleaning for homes and offices — on your schedule, with products you can trust around your family and pets.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="/contact" className="rounded-full bg-white px-8 py-4 text-base font-bold text-sky-700 transition hover:bg-sky-50">
                Book a Cleaning
              </a>
              <a href="#" className="rounded-full border border-white/40 px-8 py-4 text-base font-bold text-white transition hover:bg-white/10">
                📞 (555) 772-0200
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-black/5 bg-sky-50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-sky-800">
          {["✓ Fully Insured & Bonded", "✓ Background-Checked Staff", "✓ Satisfaction Guarantee", "✓ Eco-Friendly Options", "✓ Flexible Scheduling"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="services" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-500">What We Offer</p>
            <h2 className="mt-2 text-4xl font-bold text-[#1a3a4a]">Cleaning Services</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 text-4xl">{s.icon}</div>
                <h3 className="text-lg font-bold text-[#1a3a4a]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-sky-700 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold">300+ Happy Clients</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl bg-white/10 p-6">
                <div className="mb-3 text-yellow-300">{"★".repeat(r.stars)}</div>
                <p className="text-sm leading-7 text-sky-100">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 text-sm font-bold text-white">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sky-500 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold">Ready for a Cleaner Home?</h2>
          <p className="mt-4 text-lg text-sky-100">Book online in 60 seconds. We&apos;ll confirm within the hour.</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="/contact" className="rounded-full bg-white px-8 py-4 text-base font-bold text-sky-700 transition hover:bg-sky-50">Book a Cleaning</a>
            <a href="#" className="rounded-full border-2 border-white/60 px-8 py-4 text-base font-bold transition hover:bg-white/10">(555) 772-0200</a>
          </div>
        </div>
      </section>

      <footer className="bg-[#0d2030] px-6 py-8 text-center text-xs text-slate-600">
        © 2026 Sparkle Cleaning · Insured & Bonded · [Your City]
      </footer>
    </div>
  );
}

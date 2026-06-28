const services = [
  {
    icon: "🏡",
    title: "House Washing",
    description:
      "Gentle soft-wash treatment removes dirt, mold, and mildew from all siding types without damage. Your home looks new again.",
  },
  {
    icon: "🚗",
    title: "Driveway & Concrete",
    description:
      "High-pressure cleaning strips oil stains, rust, gum, and years of buildup from driveways, patios, and walkways.",
  },
  {
    icon: "🌿",
    title: "Deck & Fence",
    description:
      "Restore weathered wood, composite, and vinyl surfaces. We prep and clean so your deck is ready for staining or just looks great.",
  },
  {
    icon: "🏠",
    title: "Roof Soft Wash",
    description:
      "Low-pressure, EPA-approved treatment kills algae, moss, and black streaks at the root — without blasting off shingles.",
  },
];

const steps = [
  { n: "01", title: "Get a free quote", body: "Call or fill out our quick form. We respond same day and provide an upfront price — no surprises." },
  { n: "02", title: "We show up on time", body: "Our crew arrives in the scheduled window, fully equipped. We protect your plants and property before we start." },
  { n: "03", title: "You enjoy the results", body: "Walk around your freshly cleaned home and let us know you're happy before we leave. Satisfaction guaranteed." },
];

const reviews = [
  { name: "Sarah M.", stars: 5, text: "I couldn't believe the difference on our driveway. Years of staining gone in under an hour. Booked them for the house next." },
  { name: "Mike T.", stars: 5, text: "Professional crew, on time, and the house looks better than when we bought it. Price was exactly what they quoted." },
  { name: "Jennifer R.", stars: 5, text: "I was worried about soft washing near our garden but they covered everything and did a perfect job. Will 100% use again." },
];

const whyUs = [
  { title: "Locally owned", body: "We live here too. Our reputation in the community matters more to us than any one job." },
  { title: "100% satisfaction", body: "If you're not happy, we come back and fix it at no charge. We don't leave until it's right." },
  { title: "Eco-friendly", body: "Our cleaning solutions are biodegradable and safe for your family, pets, and landscaping." },
];

export default function PressureWashingDemo() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* Nav */}
      <header className="border-b border-black/5 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-tight text-[#063b4e]">ShineLine</span>
            <span className="ml-1 text-sm font-medium text-slate-500">Pressure Washing</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#reviews" className="hover:text-slate-900">Reviews</a>
            <a href="#contact-section" className="hover:text-slate-900">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden text-sm font-semibold text-[#063b4e] md:block">
              (555) 246-0000
            </a>
            <a
              href="/contact"
              className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Free Quote
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#063b4e] px-6 py-24 text-white lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#063b4e] via-[#085272] to-[#063b4e] opacity-90" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-300">
              ⭐ 4.9 stars · 200+ 5-star reviews
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight lg:text-6xl">
              Professional Pressure Washing
              <span className="block text-orange-400">You Can Trust.</span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-slate-300">
              Licensed, insured, and satisfaction guaranteed. We restore homes, driveways, decks, and roofs across your area.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/contact"
                className="rounded-full bg-orange-500 px-8 py-4 text-base font-bold text-white transition hover:bg-orange-600"
              >
                Get a Free Quote
              </a>
              <a
                href="#"
                className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white transition hover:bg-white/20"
              >
                📞 (555) 246-0000
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-b border-black/5 bg-[#f0f9ff] px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-semibold text-[#063b4e]">
          {["✓ Licensed & Insured", "✓ Free Estimates", "✓ Eco-Friendly Solutions", "✓ Same-Day Response", "✓ Satisfaction Guaranteed"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="services" className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">What We Do</p>
            <h2 className="mt-2 text-4xl font-bold text-[#063b4e]">Our Services</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
              We handle everything from a single driveway wash to full exterior cleaning packages for the whole property.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 text-4xl">{s.icon}</div>
                <h3 className="text-lg font-bold text-[#063b4e]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After visual */}
      <section className="bg-[#f0f9ff] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">Results</p>
            <h2 className="mt-2 text-4xl font-bold text-[#063b4e]">Before & After</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl">
              <div className="flex items-end justify-start bg-gradient-to-br from-slate-300 to-slate-400 p-5" style={{ height: 240 }}>
                <span className="rounded-full bg-black/40 px-3 py-1 text-sm font-bold text-white">Before</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl">
              <div className="flex items-end justify-start bg-gradient-to-br from-[#063b4e] to-[#085272] p-5" style={{ height: 240 }}>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white">After</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-400">Actual project results — driveway and house exterior cleaning.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-500">Simple Process</p>
            <h2 className="mt-2 text-4xl font-bold text-[#063b4e]">How It Works</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#063b4e] text-xl font-bold text-white">
                  {step.n}
                </div>
                <h3 className="text-xl font-bold text-[#063b4e]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-[#063b4e] px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-orange-400">Happy Customers</p>
            <h2 className="mt-2 text-4xl font-bold">What Our Customers Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl bg-white/10 p-6">
                <div className="mb-4 flex gap-1 text-orange-400">
                  {"★".repeat(r.stars)}
                </div>
                <p className="text-sm leading-7 text-slate-200">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 text-sm font-bold text-white">— {r.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-slate-300">
              <span className="text-2xl font-bold text-white">4.9</span> average rating across{" "}
              <span className="font-bold text-white">200+ Google reviews</span>
            </p>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">Why ShineLine</p>
              <h2 className="mt-2 text-4xl font-bold text-[#063b4e]">
                The difference is in the details.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-500">
                We&apos;re not the cheapest option — we&apos;re the last one you&apos;ll need to call. Our crew treats your property like it&apos;s their own.
              </p>
              <div className="mt-8 space-y-5">
                {whyUs.map((w) => (
                  <div key={w.title} className="flex gap-4">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">✓</span>
                    <div>
                      <p className="font-bold text-[#063b4e]">{w.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{w.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: "500+", label: "Jobs Completed" },
                { n: "4.9★", label: "Average Rating" },
                { n: "7 yrs", label: "In Business" },
                { n: "100%", label: "Satisfaction Guarantee" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-100 bg-[#f0f9ff] p-6 text-center shadow-sm"
                >
                  <p className="text-3xl font-bold text-[#063b4e]">{stat.n}</p>
                  <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact-section" className="bg-orange-500 px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold">Ready for a Fresh Clean?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-orange-100">
            Get your free, no-obligation quote today. We respond same day and can usually schedule within the week.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="rounded-full bg-white px-8 py-4 text-base font-bold text-orange-600 transition hover:bg-orange-50"
            >
              Get Free Quote
            </a>
            <a
              href="#"
              className="rounded-full border-2 border-white/60 px-8 py-4 text-base font-bold text-white transition hover:border-white hover:bg-white/10"
            >
              (555) 246-0000
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#031f2b] px-6 py-12 text-slate-400">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-lg font-bold text-white">ShineLine Pressure Washing</p>
              <p className="mt-2 text-sm leading-6">Professional exterior cleaning for homes and businesses in your area.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Contact</p>
              <div className="mt-3 space-y-2 text-sm">
                <p>📞 (555) 246-0000</p>
                <p>✉️ hello@shineline.com</p>
                <p>📍 Your Service Area</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white">Hours</p>
              <div className="mt-3 space-y-1 text-sm">
                <p>Monday – Friday: 7AM – 6PM</p>
                <p>Saturday: 8AM – 4PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-600">
            © 2026 ShineLine Pressure Washing · Licensed & Insured · All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}

const services = [
  { title: "Classic Cut", price: "$30", desc: "Precision scissor and clipper cut, styled to perfection." },
  { title: "Fade / Taper", price: "$35", desc: "High, mid, or low — clean blends and sharp lines every time." },
  { title: "Beard Trim & Line", price: "$20", desc: "Shape, trim, and define your beard with a straight-razor finish." },
  { title: "Hot Towel Shave", price: "$40", desc: "The full experience. Pre-shave oil, warm lather, straight razor, hot towel finish." },
  { title: "Kid's Cut", price: "$22", desc: "Patient and skilled cuts for kids 12 and under. In and out fast." },
  { title: "Cut + Beard Combo", price: "$50", desc: "The works — haircut plus full beard service at a discounted rate." },
];

const barbers = [
  { name: "Marcus A.", since: "2015", specialty: "Fades & Designs" },
  { name: "Devon K.", since: "2018", specialty: "Classic Cuts & Shaves" },
  { name: "Tre W.", since: "2021", specialty: "Beard Work & Color" },
];

const reviews = [
  { name: "Jordan M.", stars: 5, text: "Marcus keeps my fade tighter than anywhere I've been. Don't bother going anywhere else in the city." },
  { name: "Darius F.", stars: 5, text: "Been coming here since they opened. Good vibes, consistent cuts, and they always get you in on time." },
  { name: "Kevin B.", stars: 5, text: "Devon did my hot towel shave for my wedding. Looked and felt unreal. Bring your groomsmen here." },
];

export default function BarbershopDemo() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] font-sans text-white">

      {/* Nav */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <span className="text-xl font-bold tracking-tight text-white">Fresh Cuts</span>
            <span className="ml-1.5 text-sm font-medium text-slate-500">Barbershop</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#team" className="hover:text-white">The Team</a>
            <a href="#hours" className="hover:text-white">Hours</a>
          </div>
          <a href="/contact" className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-amber-400">
            Book Now
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-28 lg:py-36">
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-amber-400 mb-6">
            ⭐ 4.9 · Walk-ins welcome · Locally Owned
          </div>
          <h1 className="max-w-2xl text-6xl font-black leading-none tracking-tighter lg:text-7xl">
            Fresh Cuts.<br />
            <span className="text-amber-400">Clean Fades.</span><br />
            No Compromises.
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-slate-400">
            A real barbershop with real barbers who take their craft seriously. Walk in or book ahead.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="/contact" className="rounded-full bg-amber-500 px-8 py-4 text-base font-bold text-black transition hover:bg-amber-400">
              Book Appointment
            </a>
            <a href="#" className="rounded-full border border-white/20 px-8 py-4 text-base font-bold text-white transition hover:bg-white/5">
              (555) 832-0700
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-2">What We Offer</p>
          <h2 className="text-4xl font-black tracking-tight text-white mb-10">Services & Pricing</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition hover:bg-white/[0.07]">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-bold text-white">{s.title}</h3>
                  <span className="text-base font-black text-amber-400">{s.price}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-2">The Crew</p>
          <h2 className="text-4xl font-black tracking-tight text-white mb-10">Meet Your Barbers</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {barbers.map((b) => (
              <div key={b.name} className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-3xl">✂️</div>
                <p className="text-lg font-bold text-white">{b.name}</p>
                <p className="mt-1 text-sm text-amber-400">{b.specialty}</p>
                <p className="mt-1 text-xs text-slate-500">Cutting since {b.since}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-white/5 bg-white/[0.02] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-black tracking-tight text-white mb-10">What They Say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-2xl border border-white/5 p-6">
                <div className="mb-4 text-amber-400">{"★".repeat(r.stars)}</div>
                <p className="text-sm leading-7 text-slate-300">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 text-sm font-bold text-slate-400">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours + Location */}
      <section id="hours" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-2">Hours</p>
            <h2 className="text-3xl font-black text-white mb-6">When We&apos;re Open</h2>
            {[
              ["Monday – Friday", "9AM – 8PM"],
              ["Saturday", "8AM – 6PM"],
              ["Sunday", "10AM – 4PM"],
            ].map(([day, hrs]) => (
              <div key={day} className="flex justify-between border-b border-white/5 py-3 text-sm">
                <span className="text-slate-400">{day}</span>
                <span className="font-semibold text-white">{hrs}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-2">Location</p>
            <h2 className="text-3xl font-black text-white mb-6">Find Us</h2>
            <div className="space-y-3 text-sm text-slate-400">
              <p>📍 123 Main Street, Suite 100<br />Columbus, OH 43215</p>
              <p>📞 (555) 832-0700</p>
              <p>✉️ freshcuts@example.com</p>
            </div>
            <a href="/contact" className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-amber-400">
              Book Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-slate-600">
        © 2026 Fresh Cuts Barbershop · All rights reserved
      </footer>
    </div>
  );
}

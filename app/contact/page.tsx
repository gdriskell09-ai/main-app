"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SiteHeader from "../components/SiteHeader";

const businessTypes = [
  "Pressure Washing",
  "Landscaping & Lawn Care",
  "Painting",
  "Roofing",
  "Home Cleaning",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Window Cleaning",
  "Junk Removal",
  "Tree Service",
  "Pest Control",
  "Pool Service",
  "Handyman",
  "Concrete & Flatwork",
  "Fencing",
  "Gutter Services",
  "Solar Installation",
  "Barbershop",
  "Hair Salon",
  "Nail Salon",
  "Personal Training",
  "Massage Therapy",
  "Tattoo Studio",
  "Dog Grooming",
  "Esthetician / Spa",
  "Gym / Fitness Studio",
  "Photography",
  "Catering & Food Trucks",
  "DJ & Events",
  "Tutoring & Coaching",
  "Video Production",
  "Florist",
  "Other",
];

const needs = [
  "Website",
  "CRM / Customer tracking",
  "Lead capture",
  "Job & crew tools",
  "Door-knocking tools",
  "Estimating support",
  "All of the above",
];

type FormState = "idle" | "submitting" | "success" | "error";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function formatPhoneInput(value: string): string {
  const d = digitsOnly(value).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    business: "",
    type: "",
    need: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) setForm((prev) => ({ ...prev, type }));
  }, [searchParams]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.phone && digitsOnly(form.phone).length !== 10) {
      setErrorMsg("Please enter a full 10-digit US phone number, or leave phone blank.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong — please try again or email us directly.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Could not reach the server. Please check your connection or email us at hello@mainapp.co.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-slate-950">
      <SiteHeader activePath="/contact" />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          {/* Left — context */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Get started
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Let&apos;s figure out what your business needs
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Fill out the form and we&apos;ll reach out within one business day. No pressure, no
              sales pitch — just a quick conversation about what would actually help.
            </p>

            <div className="mt-10 space-y-5">
              {[
                {
                  title: "Honest about what we have",
                  body: "We'll tell you what's live now vs. what's coming — and only recommend what fits where you are.",
                },
                {
                  title: "Built around your business type",
                  body: "Every setup is shaped around what actually converts for your specific trade or service.",
                },
                {
                  title: "Grows with you",
                  body: "Start with a website. Add CRM, estimating, and operations tools when you're ready.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Or just email us directly
              </p>
              <a
                href="mailto:hello@mainapp.co"
                className="mt-2 block text-base font-semibold text-slate-950 transition hover:text-emerald-700"
              >
                hello@mainapp.co
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div className="clean-shadow rounded-[2rem] border border-black/5 bg-white p-8 lg:p-10">
            {status === "success" ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
                  ✓
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-950">Got it — thanks.</h2>
                <p className="mt-3 max-w-sm text-base leading-7 text-slate-600">
                  We&apos;ll be in touch within one business day. Check your inbox (and spam, just in
                  case).
                </p>
                <a
                  href="/"
                  className="mt-8 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Back to home
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Your name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Smith"
                      className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Business name
                    </label>
                    <input
                      name="business"
                      value={form.business}
                      onChange={handleChange}
                      required
                      placeholder="Smith&apos;s Lawn Care"
                      className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Business type
                  </label>
                  <input
                    name="type"
                    list="biz-types"
                    value={form.type}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Pressure Washing"
                    className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
                  />
                  <datalist id="biz-types">
                    {businessTypes.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    What do you need most right now?
                  </label>
                  <select
                    name="need"
                    value={form.need}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
                  >
                    <option value="" disabled>
                      Select one
                    </option>
                    {needs.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="jane@smithslawn.com"
                      className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Phone{" "}
                      <span className="font-normal text-slate-400">(optional)</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: formatPhoneInput(e.target.value) }))}
                      placeholder="(555) 000-0000"
                      className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    City &amp; State{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Atlanta, GA"
                    className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Anything else?{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us a bit about your business or what you're trying to solve."
                    className="w-full resize-none rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
                  />
                </div>

                {errorMsg && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full rounded-full bg-slate-950 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-[#f7f5ef]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
            <a href="/" className="font-semibold text-slate-900">
              Main App
            </a>
            <span>Websites and growth tools for local businesses.</span>
            <a href="mailto:hello@mainapp.co" className="transition hover:text-slate-950">
              hello@mainapp.co
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactForm />
    </Suspense>
  );
}

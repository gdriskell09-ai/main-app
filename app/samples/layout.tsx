"use client";

import { usePathname } from "next/navigation";

const SAMPLE_TYPES: Record<string, string> = {
  "pressure-washing": "Pressure Washing",
  "landscaping":      "Landscaping",
  "barbershop":       "Barbershop",
  "painting":         "Painting",
  "roofing":          "Roofing",
  "cleaning":         "Home Cleaning",
  "hvac":             "HVAC",
  "plumbing":         "Plumbing",
};

export default function SamplesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segment  = pathname?.split("/").filter(Boolean).pop() ?? "";
  const bizType  = SAMPLE_TYPES[segment] ?? "";
  const contactUrl = bizType
    ? `/contact?type=${encodeURIComponent(bizType)}`
    : "/contact";

  return (
    <>
      {/* Demo notice */}
      <div className="sticky top-0 z-50 bg-slate-950 px-4 py-2.5 text-center text-xs text-slate-300">
        <span className="text-slate-500">Built on the Main App engine.</span>
        {bizType && <span className="mx-2 text-slate-700">·</span>}
        {bizType && <span className="text-slate-400">Want a {bizType} site like this?</span>}
        {" "}
        <a
          href={contactUrl}
          className="ml-1 font-semibold text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
        >
          Get started →
        </a>
      </div>
      {children}
    </>
  );
}

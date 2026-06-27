import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

async function geocodeCity(city: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&countrycodes=us`;
    const res = await fetch(url, {
      headers: { "User-Agent": "MainApp/1.0 contact@mainapp.co" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

async function notifyNewLead(name: string, email: string, business: string, type: string, need: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Main App <notifications@mainapp.co>",
      to: ["hello@mainapp.co"],
      subject: `New lead: ${name}${business ? ` — ${business}` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;padding:24px">
          <h2 style="margin:0 0 16px;font-size:20px">New lead submitted</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px">Name</td><td style="padding:6px 0;font-size:13px;font-weight:600">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px">Email</td><td style="padding:6px 0;font-size:13px">${email}</td></tr>
            ${business ? `<tr><td style="padding:6px 0;color:#64748b;font-size:13px">Business</td><td style="padding:6px 0;font-size:13px">${business}</td></tr>` : ""}
            ${type ? `<tr><td style="padding:6px 0;color:#64748b;font-size:13px">Type</td><td style="padding:6px 0;font-size:13px">${type}</td></tr>` : ""}
            ${need ? `<tr><td style="padding:6px 0;color:#64748b;font-size:13px">Needs</td><td style="padding:6px 0;font-size:13px">${need}</td></tr>` : ""}
          </table>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mainapp.co"}/admin" style="display:inline-block;margin-top:20px;background:#0f172a;color:#fff;padding:10px 20px;border-radius:9999px;font-size:13px;font-weight:600;text-decoration:none">
            View in admin →
          </a>
        </div>
      `,
    }),
  }).catch(() => {});
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, business, type, need, email, phone, city, message } = body as {
    name?: string; business?: string; type?: string; need?: string;
    email?: string; phone?: string; city?: string; message?: string;
  };

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  // Geocode city — best-effort, never blocks
  let lat: number | null = null;
  let lng: number | null = null;
  if (city?.trim()) {
    const coords = await geocodeCity(city.trim());
    if (coords) { lat = coords.lat; lng = coords.lng; }
  }

  const supabase = await createClient();

  const { error } = await supabase.from("leads").insert({
    name: name.trim(),
    business: business?.trim() || null,
    type: type?.trim() || null,
    need: need?.trim() || null,
    email: email.trim(),
    phone: phone?.trim() || null,
    city: city?.trim() || null,
    lat,
    lng,
    message: message?.trim() || null,
  });

  if (error) {
    console.error("[contact] Supabase insert error:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json(
      { error: "Could not save your message. Please try again or email us at hello@mainapp.co." },
      { status: 500 }
    );
  }

  // Fire-and-forget — never blocks or fails the response
  notifyNewLead(name, email, business ?? "", type ?? "", need ?? "").catch(() => {});

  return NextResponse.json({ ok: true });
}

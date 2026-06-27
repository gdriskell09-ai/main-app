"use client";

import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createClient } from "@/lib/supabase/client";

type PinStatus = "new" | "knocked" | "no_answer" | "interested" | "estimate_sent" | "booked" | "completed";

type CanvassPin = {
  id: number;
  lat: number;
  lng: number;
  address: string | null;
  status: PinStatus;
  notes: string | null;
  rep_name: string | null;
  created_at: string;
};

const STATUS: Record<PinStatus, { label: string; color: string; bg: string }> = {
  new:           { label: "New",           color: "#94a3b8", bg: "#f1f5f9" },
  knocked:       { label: "Knocked",       color: "#60a5fa", bg: "#eff6ff" },
  no_answer:     { label: "No Answer",     color: "#f97316", bg: "#fff7ed" },
  interested:    { label: "Interested",    color: "#a78bfa", bg: "#f5f3ff" },
  estimate_sent: { label: "Estimate Sent", color: "#fbbf24", bg: "#fffbeb" },
  booked:        { label: "Booked",        color: "#10b981", bg: "#ecfdf5" },
  completed:     { label: "Completed",     color: "#059669", bg: "#d1fae5" },
};

const ALL_STATUSES = Object.keys(STATUS) as PinStatus[];

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng); } });
  return null;
}

export default function CanvassMap() {
  const [pins, setPins] = useState<CanvassPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PinStatus | "all">("all");
  const supabase = createClient();

  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const load = useCallback(async () => {
    const { data } = await supabase.from("canvass_pins").select("*").order("created_at", { ascending: false });
    setPins((data as CanvassPin[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function handleMapClick(lat: number, lng: number) {
    const { data } = await supabase.from("canvass_pins").insert({ lat, lng }).select().single();
    if (data) setPins((prev) => [data as CanvassPin, ...prev]);
  }

  async function handleUpdateStatus(id: number, status: PinStatus) {
    await supabase.from("canvass_pins").update({ status }).eq("id", id);
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  async function handleUpdateAddress(id: number, address: string) {
    await supabase.from("canvass_pins").update({ address }).eq("id", id);
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, address } : p)));
  }

  async function handleUpdateNotes(id: number, notes: string) {
    await supabase.from("canvass_pins").update({ notes }).eq("id", id);
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, notes } : p)));
  }

  async function handleDelete(id: number) {
    await supabase.from("canvass_pins").delete().eq("id", id);
    setPins((prev) => prev.filter((p) => p.id !== id));
  }

  const counts = ALL_STATUSES.reduce<Record<PinStatus, number>>((acc, s) => {
    acc[s] = pins.filter((p) => p.status === s).length;
    return acc;
  }, {} as Record<PinStatus, number>);

  const visible = filter === "all" ? pins : pins.filter((p) => p.status === filter);
  const center: [number, number] = pins.length > 0
    ? [pins.reduce((s, p) => s + p.lat, 0) / pins.length, pins.reduce((s, p) => s + p.lng, 0) / pins.length]
    : [39.5, -98.35];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Map */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading map…</div>
        ) : (
          <MapContainer center={center} zoom={pins.length > 0 ? 13 : 4}
            style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickHandler onMapClick={handleMapClick} />
            {visible.map((pin) => (
              <CircleMarker key={pin.id} center={[pin.lat, pin.lng]} radius={10}
                pathOptions={{ color: "#fff", weight: 2, fillColor: STATUS[pin.status].color, fillOpacity: 0.9 }}>
                <Popup minWidth={200}>
                  <div style={{ fontFamily: "sans-serif" }}>
                    <div style={{ marginBottom: "8px" }}>
                      <select
                        value={pin.status}
                        onChange={(e) => handleUpdateStatus(pin.id, e.target.value as PinStatus)}
                        style={{
                          width: "100%", padding: "4px 8px", borderRadius: "6px", border: "1px solid #e2e8f0",
                          background: STATUS[pin.status].bg, color: STATUS[pin.status].color,
                          fontWeight: 600, fontSize: "12px", cursor: "pointer",
                        }}>
                        {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
                      </select>
                    </div>
                    <input
                      defaultValue={pin.address ?? ""}
                      placeholder="Address (optional)"
                      onBlur={(e) => { if (e.target.value !== (pin.address ?? "")) handleUpdateAddress(pin.id, e.target.value); }}
                      style={{ width: "100%", padding: "4px 8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "12px", marginBottom: "6px", boxSizing: "border-box" }}
                    />
                    <textarea
                      defaultValue={pin.notes ?? ""}
                      placeholder="Notes…"
                      rows={2}
                      onBlur={(e) => { if (e.target.value !== (pin.notes ?? "")) handleUpdateNotes(pin.id, e.target.value); }}
                      style={{ width: "100%", padding: "4px 8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "12px", resize: "none", boxSizing: "border-box" }}
                    />
                    <button
                      onClick={() => handleDelete(pin.id)}
                      style={{ marginTop: "6px", fontSize: "11px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      Delete pin
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Sidebar */}
      <div className="hidden w-56 shrink-0 flex-col gap-3 overflow-y-auto border-l border-black/5 bg-[#f7f5ef] p-3 lg:flex">
        <div className="rounded-xl border border-black/5 bg-white px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total pins</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">{pins.length}</p>
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-2">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Filter by status</p>
          <button onClick={() => setFilter("all")}
            className={`mb-1 w-full rounded-lg px-2 py-1.5 text-left text-xs font-medium transition ${filter === "all" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
            All ({pins.length})
          </button>
          {ALL_STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`w-full rounded-lg px-2 py-1.5 text-left text-xs font-medium transition ${filter === s ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: STATUS[s].color }} />
              {STATUS[s].label} ({counts[s]})
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-dashed border-black/10 p-3 text-xs text-slate-400">
          <p className="font-semibold text-slate-600">How to use</p>
          <p className="mt-1 leading-5">Click anywhere on the map to drop a pin. Tap a pin to update its status, add an address, or leave notes.</p>
        </div>

        <div className="rounded-xl border border-black/5 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Pipeline</p>
          <div className="space-y-1.5">
            {(["interested", "estimate_sent", "booked"] as PinStatus[]).map((s) => (
              <div key={s} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: STATUS[s].color }} />
                  <span className="text-xs text-slate-600">{STATUS[s].label}</span>
                </div>
                <span className="text-xs font-semibold text-slate-950">{counts[s]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

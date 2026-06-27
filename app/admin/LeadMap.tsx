"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "not_interested";

type MapLead = {
  id: number;
  name: string;
  business: string | null;
  status: LeadStatus;
  city: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  new:            "#10b981",
  contacted:      "#38bdf8",
  qualified:      "#a78bfa",
  converted:      "#f59e0b",
  not_interested: "#94a3b8",
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  new:            "New",
  contacted:      "Contacted",
  qualified:      "Qualified",
  converted:      "Converted",
  not_interested: "Not interested",
};

export default function LeadMap({ leads }: { leads: MapLead[] }) {
  useEffect(() => {
    // Fix default marker icon paths broken by webpack
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const mapped = leads.filter((l) => l.lat != null && l.lng != null);

  const center: [number, number] = mapped.length > 0
    ? [mapped.reduce((s, l) => s + l.lat!, 0) / mapped.length,
       mapped.reduce((s, l) => s + l.lng!, 0) / mapped.length]
    : [39.5, -98.35];

  const zoom = mapped.length > 0 ? 6 : 4;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mapped.map((lead) => (
        <CircleMarker
          key={lead.id}
          center={[lead.lat!, lead.lng!]}
          radius={10}
          pathOptions={{
            color: "#fff",
            weight: 2,
            fillColor: STATUS_COLORS[lead.status],
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <div style={{ minWidth: "160px" }}>
              <p style={{ fontWeight: 700, fontSize: "13px", marginBottom: "2px" }}>{lead.name}</p>
              {lead.business && <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>{lead.business}</p>}
              <span style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: 600,
                background: STATUS_COLORS[lead.status] + "22",
                color: STATUS_COLORS[lead.status],
              }}>
                {STATUS_LABELS[lead.status]}
              </span>
              {lead.city && <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>{lead.city}</p>}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

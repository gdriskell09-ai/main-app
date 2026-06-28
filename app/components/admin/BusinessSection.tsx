"use client";

import { useState, useEffect, useCallback } from "react";
import React from "react";
import type { BusinessProfile, CustomModuleId, GeneratedWebsiteContent } from "@/lib/business/types";
import type { StylePackId } from "@/lib/website-engine/types";
import {
  getAllProfiles,
  saveProfile,
  deleteProfile,
  createId,
} from "@/lib/business/storage";
import { getBlueprint } from "@/lib/business/blueprints/index";
import {
  consumeWebsiteProfileDraft,
  consumeWebsiteProfilePendingEdit,
} from "@/lib/business/draftProfile";

// ── Constants ────────────────────────────────────────────────────

const STYLE_PACKS: { id: StylePackId; label: string; color: string }[] = [
  { id: "bold-contractor",  label: "Bold Contractor",  color: "#ea580c" },
  { id: "clean-pro",        label: "Clean Pro",        color: "#0ea5e9" },
  { id: "luxury-dark",      label: "Luxury Dark",      color: "#c9a227" },
  { id: "premium-glass",    label: "Premium Glass",    color: "#4f46e5" },
  { id: "high-energy",      label: "High Energy",      color: "#ef4444" },
  { id: "playful-bright",   label: "Playful Bright",   color: "#f43f5e" },
  { id: "premium-minimal",  label: "Premium Minimal",  color: "#2d6a4f" },
];

const CUSTOM_MODULES: { id: CustomModuleId; label: string; description: string; industries?: string[] }[] = [
  {
    id: "GalleryMasonry",
    label: "Photo Gallery",
    description: "Masonry grid gallery for showcasing project photos and work",
  },
  {
    id: "PressureWashRevealSection",
    label: "Before/After Reveal",
    description: "Animated before/after reveal slider — best for cleaning and washing businesses",
    industries: ["Pressure Washing"],
  },
  {
    id: "CustomIceCreamHero",
    label: "Food/Dessert Hero",
    description: "Fun animated hero section for food and dessert businesses",
    industries: ["Ice Cream / Food"],
  },
];

const INDUSTRIES = [
  "Pressure Washing",
  "Lawn & Landscaping",
  "Painting",
  "Roofing",
  "HVAC",
  "Plumbing",
  "Gym / Fitness Studio",
  "Personal Trainer",
  "Barber / Salon",
  "Restaurant / Cafe",
  "Ice Cream / Food",
  "Other / General Contractor",
];

function blankProfile(): Omit<BusinessProfile, "id" | "createdAt" | "updatedAt"> {
  return {
    businessName: "",
    industry: "",
    phone: "",
    email: "",
    serviceArea: "",
    city: "",
    brandColor: "#0ea5e9",
    logoUrl: "",
    services: [],
    businessDescription: "",
    preferredStylePack: "bold-contractor",
    desiredCustomModules: [],
    websiteGoals: "",
    quoteFormNeeds: "",
  };
}

// ── Shared tiny UI helpers ────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "12px",
        fontWeight: 600,
        color: "#475569",
        marginBottom: "6px",
        letterSpacing: "0.01em",
      }}
    >
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 13px",
  borderRadius: "10px",
  border: "1.5px solid #e2e8f0",
  fontSize: "14px",
  color: "#0f172a",
  background: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s ease",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// ── BusinessSection ───────────────────────────────────────────────

type View = "list" | "create" | "edit";
type GenStatus = "idle" | "generating" | "success" | "error";

export default function BusinessSection() {
  const [view, setView]         = useState<View>("list");
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [editing, setEditing]   = useState<BusinessProfile | null>(null);
  const [prefillData, setPrefillData] = useState<Partial<BusinessProfile> | null>(null);
  const [genStatus,      setGenStatus]      = useState<Record<string, GenStatus>>({});
  const [genError,       setGenError]       = useState<Record<string, string>>({});
  const [deleteConfirm,  setDeleteConfirm]  = useState<Record<string, boolean>>({});
  const [clearConfirm,   setClearConfirm]   = useState<Record<string, boolean>>({});

  const load = useCallback(() => setProfiles(getAllProfiles()), []);

  useEffect(() => {
    load();
    // Consume a pending draft (from Customer panel or Copy Kit)
    const draft = consumeWebsiteProfileDraft();
    if (draft) {
      setPrefillData(draft);
      setEditing(null);
      setView("create");
      return;
    }
    // Consume a pending edit (from preview page or Customer Edit button)
    const pendingId = consumeWebsiteProfilePendingEdit();
    if (pendingId) {
      const target = getAllProfiles().find((p) => p.id === pendingId);
      if (target) {
        setEditing(target);
        setView("edit");
      }
    }
  }, [load]);

  function openCreate() {
    setEditing(null);
    setPrefillData(null);
    setView("create");
  }

  function openEdit(p: BusinessProfile) {
    setEditing(p);
    setView("edit");
  }

  function handleSaved() {
    load();
    setView("list");
    setEditing(null);
    setPrefillData(null);
  }

  function handleDelete(id: string) {
    deleteProfile(id);
    setDeleteConfirm((prev) => { const n = { ...prev }; delete n[id]; return n; });
    load();
  }

  async function handleGenerate(p: BusinessProfile) {
    setGenStatus((prev) => ({ ...prev, [p.id]: "generating" }));
    setGenError((prev) => ({ ...prev, [p.id]: "" }));
    try {
      const res = await fetch("/api/generate-website-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: p }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data: GeneratedWebsiteContent = await res.json();
      const updated = saveProfile({ ...p, generatedContent: data });
      setProfiles((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setGenStatus((prev) => ({ ...prev, [p.id]: "success" }));
    } catch (err) {
      setGenStatus((prev) => ({ ...prev, [p.id]: "error" }));
      setGenError((prev) => ({
        ...prev,
        [p.id]: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  }

  function handleClear(p: BusinessProfile) {
    const updated = saveProfile({ ...p, generatedContent: undefined });
    setProfiles((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    setGenStatus((prev) => ({ ...prev, [p.id]: "idle" }));
    setGenError((prev) => ({ ...prev, [p.id]: "" }));
    setClearConfirm((prev) => { const n = { ...prev }; delete n[p.id]; return n; });
  }

  if (view === "create" || view === "edit") {
    return (
      <BusinessEditor
        existing={editing}
        prefill={prefillData ?? undefined}
        onSaved={handleSaved}
        onCancel={() => { setView("list"); setEditing(null); setPrefillData(null); }}
      />
    );
  }

  // ── List view ──────────────────────────────────────────────────
  return (
    <div className="w-full h-full overflow-y-auto">
    <div style={{ padding: "32px 16px 64px", maxWidth: "860px" }}>
      <style>{`
        @media (max-width: 640px) {
          .bs-card-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
            }}
          >
            Website Profiles
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              margin: "4px 0 0",
            }}
          >
            Create and manage client profiles. Each profile generates a live website preview.
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            padding: "10px 22px",
            borderRadius: "12px",
            background: "#0f172a",
            color: "#ffffff",
            border: "none",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + New Profile
        </button>
      </div>

      {/* Empty state */}
      {profiles.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "64px 24px",
            background: "#f8fafc",
            borderRadius: "20px",
            border: "2px dashed #e2e8f0",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>🏢</div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#0f172a",
              margin: "0 0 8px",
            }}
          >
            No business profiles yet
          </h3>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px" }}>
            Create your first profile to generate a website preview.
          </p>
          <button
            onClick={openCreate}
            style={{
              padding: "11px 26px",
              borderRadius: "12px",
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Create First Business
          </button>
        </div>
      )}

      {/* Profile cards */}
      {profiles.length > 0 && (
        <div
          className="bs-card-grid"
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
          }}
        >
          {profiles.map((p) => {
            const packColor =
              STYLE_PACKS.find((s) => s.id === p.preferredStylePack)?.color ?? "#0ea5e9";
            const isStale = !!(
              p.updatedAt &&
              p.generatedContent?.generatedAt &&
              new Date(p.updatedAt) > new Date(p.generatedContent.generatedAt)
            );
            return (
              <div
                key={p.id}
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "18px",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Pack color stripe */}
                <div
                  style={{
                    height: "4px",
                    borderRadius: "2px",
                    background: `linear-gradient(90deg, ${packColor}, ${packColor}80)`,
                    marginBottom: "4px",
                  }}
                />
                <div>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 4px",
                    }}
                  >
                    {p.businessName}
                  </h3>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "12px",
                      color: "#64748b",
                      background: "#f1f5f9",
                      borderRadius: "6px",
                      padding: "2px 8px",
                    }}
                  >
                    {p.industry || "No industry set"}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#64748b",
                  }}
                >
                  {p.city && <span>📍 {p.city}</span>}
                  {p.phone && <span>📞 {p.phone}</span>}
                  {p.services.length > 0 && (
                    <span style={{ gridColumn: "span 2" }}>
                      🛠 {p.services.slice(0, 3).join(", ")}
                      {p.services.length > 3 && ` +${p.services.length - 3}`}
                    </span>
                  )}
                </div>

                {/* Style pack badge + content source badge */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: packColor,
                      background: `${packColor}15`,
                      borderRadius: "6px",
                      padding: "3px 9px",
                      border: `1px solid ${packColor}30`,
                    }}
                  >
                    {STYLE_PACKS.find((s) => s.id === p.preferredStylePack)?.label}
                  </span>
                  {p.desiredCustomModules.map((m) => (
                    <span
                      key={m}
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "#475569",
                        background: "#f1f5f9",
                        borderRadius: "6px",
                        padding: "3px 9px",
                      }}
                    >
                      {CUSTOM_MODULES.find((c) => c.id === m)?.label ?? m}
                    </span>
                  ))}
                  {p.generatedContent && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: p.generatedContent.source === "groq" ? "#0284c7" : "#64748b",
                        background: p.generatedContent.source === "groq" ? "#e0f2fe" : "#f1f5f9",
                        borderRadius: "6px",
                        padding: "3px 9px",
                        border: p.generatedContent.source === "groq" ? "1px solid #bae6fd" : "1px solid #e2e8f0",
                      }}
                    >
                      {p.generatedContent.source === "groq" ? "AI Content" : "Blueprint"}
                    </span>
                  )}
                  {p.customer_id && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#7c3aed",
                        background: "#f5f3ff",
                        borderRadius: "6px",
                        padding: "3px 9px",
                        border: "1px solid #ddd6fe",
                      }}
                    >
                      Client ↗
                    </span>
                  )}
                </div>

                {/* Generate content button */}
                {(() => {
                  const status = genStatus[p.id] ?? "idle";
                  const err    = genError[p.id];
                  const hasContent = !!p.generatedContent;

                  let label = hasContent ? "Regenerate Content" : "Generate Website Content";
                  let bg    = "#f1f5f9";
                  let color = "#0f172a";
                  let disabled = false;

                  if (status === "generating") {
                    label = "Generating…";
                    bg    = "#e2e8f0";
                    color = "#64748b";
                    disabled = true;
                  } else if (status === "success") {
                    label = hasContent ? "Regenerate Content" : "Generated!";
                    bg    = "#dcfce7";
                    color = "#15803d";
                  } else if (status === "error") {
                    label = "Try Again";
                    bg    = "#fff1f2";
                    color = "#e11d48";
                  }

                  return (
                    <div>
                      <button
                        onClick={() => handleGenerate(p)}
                        disabled={disabled}
                        style={{
                          width: "100%",
                          padding: "8px 0",
                          borderRadius: "10px",
                          background: bg,
                          color,
                          border: "none",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: disabled ? "not-allowed" : "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {label}
                      </button>
                      {status === "error" && err && (
                        <p style={{ fontSize: "11px", color: "#e11d48", margin: "4px 0 0" }}>
                          {err}
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* Generated content timestamp + clear */}
                {p.generatedContent && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                        Generated {new Date(p.generatedContent.generatedAt).toLocaleDateString()}
                      </span>
                      {isStale && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            color: "#92400e",
                            background: "#fef3c7",
                            borderRadius: "5px",
                            padding: "1px 7px",
                            border: "1px solid #fde68a",
                          }}
                        >
                          Content may be outdated
                        </span>
                      )}
                    </div>
                    {clearConfirm[p.id] ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => handleClear(p)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "8px",
                            background: "#e11d48",
                            color: "#ffffff",
                            border: "none",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Confirm clear
                        </button>
                        <button
                          onClick={() => setClearConfirm((prev) => ({ ...prev, [p.id]: false }))}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "8px",
                            background: "#f1f5f9",
                            color: "#475569",
                            border: "none",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setClearConfirm((prev) => ({ ...prev, [p.id]: true }))}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "8px",
                          background: "#f8fafc",
                          color: "#94a3b8",
                          border: "1px solid #e2e8f0",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Reset to blueprint
                      </button>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "4px",
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href={`/website-preview/${p.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      padding: "9px 0",
                      borderRadius: "10px",
                      background: "#0f172a",
                      color: "#ffffff",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    Open Preview ↗
                  </a>
                  <button
                    onClick={() => openEdit(p)}
                    style={{
                      padding: "9px 16px",
                      borderRadius: "10px",
                      background: "#f1f5f9",
                      color: "#0f172a",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  {deleteConfirm[p.id] ? (
                    <>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{
                          padding: "9px 12px",
                          borderRadius: "10px",
                          background: "#e11d48",
                          color: "#ffffff",
                          border: "none",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm((prev) => ({ ...prev, [p.id]: false }))}
                        style={{
                          padding: "9px 10px",
                          borderRadius: "10px",
                          background: "#f1f5f9",
                          color: "#475569",
                          border: "none",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm((prev) => ({ ...prev, [p.id]: true }))}
                      style={{
                        padding: "9px 14px",
                        borderRadius: "10px",
                        background: "#fff1f2",
                        color: "#e11d48",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </div>
  );
}

// ── BusinessEditor ─────────────────────────────────────────────────

interface EditorProps {
  existing: BusinessProfile | null;
  prefill?: Partial<BusinessProfile>;
  onSaved: () => void;
  onCancel: () => void;
}

function BusinessEditor({ existing, prefill, onSaved, onCancel }: EditorProps) {
  const isNew = !existing;
  const [form, setForm] = useState<Omit<BusinessProfile, "id" | "createdAt" | "updatedAt">>(() => {
    if (existing) {
      return {
        customer_id: existing.customer_id,
        businessName: existing.businessName,
        industry: existing.industry,
        phone: existing.phone,
        email: existing.email,
        serviceArea: existing.serviceArea,
        city: existing.city,
        brandColor: existing.brandColor,
        logoUrl: existing.logoUrl,
        services: existing.services,
        businessDescription: existing.businessDescription,
        preferredStylePack: existing.preferredStylePack,
        desiredCustomModules: existing.desiredCustomModules,
        websiteGoals: existing.websiteGoals,
        quoteFormNeeds: existing.quoteFormNeeds,
      };
    }
    if (prefill) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _i, createdAt: _ca, updatedAt: _ua, generatedContent: _gc, ...safe } = prefill;
      return { ...blankProfile(), ...safe };
    }
    return blankProfile();
  });

  const [serviceInput, setServiceInput] = useState("");
  const [errors, setErrors]             = useState<string[]>([]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addService() {
    const svc = serviceInput.trim();
    if (!svc || form.services.includes(svc)) return;
    set("services", [...form.services, svc]);
    setServiceInput("");
  }

  function removeService(svc: string) {
    set("services", form.services.filter((s) => s !== svc));
  }

  function toggleModule(id: CustomModuleId) {
    if (form.desiredCustomModules.includes(id)) {
      set(
        "desiredCustomModules",
        form.desiredCustomModules.filter((m) => m !== id)
      );
    } else {
      set("desiredCustomModules", [...form.desiredCustomModules, id]);
    }
  }

  function validate(): boolean {
    const errs: string[] = [];
    if (!form.businessName.trim()) errs.push("Business name is required.");
    if (!form.industry) errs.push("Industry is required.");
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const now = new Date().toISOString();
    const profile: BusinessProfile = {
      ...form,
      id: existing?.id ?? createId(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      // preserve generated content through profile edits — the editor doesn't touch it
      ...(existing?.generatedContent !== undefined
        ? { generatedContent: existing.generatedContent }
        : {}),
    };
    saveProfile(profile);
    onSaved();
  }

  return (
    <div className="w-full h-full overflow-y-auto">
    <div style={{ padding: "32px 16px 80px", maxWidth: "680px" }}>
      <style>{`
        @media (max-width: 540px) {
          .bs-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            color: "#64748b",
            fontSize: "14px",
            cursor: "pointer",
            padding: "0",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ← Back to list
        </button>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
          }}
        >
          {isNew ? "New Business Profile" : `Edit — ${existing!.businessName}`}
        </h2>
      </div>

      {errors.length > 0 && (
        <div
          style={{
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: "12px",
            padding: "14px 18px",
            marginBottom: "20px",
            fontSize: "14px",
            color: "#be123c",
          }}
        >
          {errors.map((e) => (
            <div key={e}>⚠ {e}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ── Business basics ────────────────────────────── */}
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#94a3b8",
              margin: "0 0 18px",
            }}
          >
            Business Info
          </p>

          <Field label="Business Name *">
            <input
              style={inputStyle}
              value={form.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              placeholder="e.g. Sparkling Clean Co."
            />
          </Field>

          <div className="bs-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Industry *">
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={form.industry}
                onChange={(e) => {
                  const newIndustry = e.target.value;
                  if (newIndustry && !form.industry) {
                    // First selection — auto-suggest the blueprint's recommended style pack
                    const bp = getBlueprint(newIndustry);
                    setForm((prev) => ({ ...prev, industry: newIndustry, preferredStylePack: bp.recommendedStylePacks[0] }));
                  } else {
                    set("industry", newIndustry);
                  }
                }}
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </Field>
            <Field label="City">
              <input
                style={inputStyle}
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="e.g. Austin"
              />
            </Field>
          </div>

          <Field label="Service Area">
            <input
              style={inputStyle}
              value={form.serviceArea}
              onChange={(e) => set("serviceArea", e.target.value)}
              placeholder="e.g. Austin + surrounding suburbs"
            />
          </Field>

          <div className="bs-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <Field label="Phone">
              <input
                style={inputStyle}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="(555) 123-4567"
                type="tel"
              />
            </Field>
            <Field label="Email">
              <input
                style={inputStyle}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="hello@example.com"
                type="email"
              />
            </Field>
          </div>

          <Field label="Tagline or Quick Description">
            <textarea
              style={{ ...inputStyle, minHeight: "76px", resize: "vertical" }}
              value={form.businessDescription}
              onChange={(e) => set("businessDescription", e.target.value)}
              placeholder="A short tagline or what you do best — used in the hero section"
            />
          </Field>

          <Field label="Brand Color">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="color"
                value={form.brandColor}
                onChange={(e) => set("brandColor", e.target.value)}
                style={{
                  width: "44px",
                  height: "36px",
                  padding: "2px 3px",
                  borderRadius: "8px",
                  border: "1.5px solid #e2e8f0",
                  cursor: "pointer",
                  background: "#ffffff",
                }}
              />
              <span style={{ fontSize: "13px", color: "#475569", fontFamily: "monospace" }}>
                {form.brandColor}
              </span>
            </div>
          </Field>
        </div>

        {/* ── Services ──────────────────────────────────── */}
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#94a3b8",
              margin: "0 0 18px",
            }}
          >
            Services Offered
          </p>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addService(); } }}
              placeholder="e.g. House Washing, Roof Cleaning…"
            />
            <button
              type="button"
              onClick={addService}
              style={{
                padding: "9px 18px",
                borderRadius: "10px",
                background: "#f1f5f9",
                color: "#0f172a",
                border: "none",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Add
            </button>
          </div>
          {form.services.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {form.services.map((svc) => (
                <span
                  key={svc}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#f1f5f9",
                    borderRadius: "8px",
                    padding: "5px 10px",
                    fontSize: "13px",
                    color: "#334155",
                    fontWeight: 500,
                  }}
                >
                  {svc}
                  <button
                    type="button"
                    onClick={() => removeService(svc)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: "0",
                      fontSize: "14px",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Website design ────────────────────────────── */}
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#94a3b8",
              margin: "0 0 18px",
            }}
          >
            Website Design
          </p>

          <Field label="Logo URL">
            <input
              style={inputStyle}
              value={form.logoUrl}
              onChange={(e) => set("logoUrl", e.target.value)}
              placeholder="https://example.com/logo.png"
              type="url"
            />
          </Field>

          <Field label="Style Pack">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "10px",
              }}
            >
              {STYLE_PACKS.map((sp) => {
                const active = form.preferredStylePack === sp.id;
                return (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => set("preferredStylePack", sp.id)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: `2px solid ${active ? sp.color : "#e2e8f0"}`,
                      background: active ? `${sp.color}10` : "#f8fafc",
                      color: active ? sp.color : "#475569",
                      fontSize: "13px",
                      fontWeight: active ? 700 : 500,
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: sp.color,
                        flexShrink: 0,
                      }}
                    />
                    {sp.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Add-on Sections">
            {(() => {
              const visibleModules = CUSTOM_MODULES.filter(
                (mod) => !mod.industries || mod.industries.includes(form.industry)
              );
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {visibleModules.length === 0 ? (
                    <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                      No add-on sections available for this industry.
                    </p>
                  ) : (
                    visibleModules.map((mod) => {
                      const active = form.desiredCustomModules.includes(mod.id);
                      return (
                        <label
                          key={mod.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            padding: "14px 16px",
                            borderRadius: "12px",
                            border: `1.5px solid ${active ? "#0f172a" : "#e2e8f0"}`,
                            background: active ? "#f8fafc" : "#ffffff",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleModule(mod.id)}
                            style={{ marginTop: "2px", accentColor: "#0f172a" }}
                          />
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
                              {mod.label}
                            </div>
                            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                              {mod.description}
                            </div>
                          </div>
                        </label>
                      );
                    })
                  )}
                  <div
                    style={{
                      marginTop: "4px",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>
                      Always included
                    </p>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>
                      Hero · Services · Why Us · Stats · Reviews · FAQ · Contact CTA · Footer
                    </p>
                  </div>
                </div>
              );
            })()}
          </Field>
        </div>

        {/* ── Goals & notes ─────────────────────────────── */}
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "28px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#94a3b8",
              margin: "0 0 18px",
            }}
          >
            Build Notes
          </p>
          <Field label="Website Goals (internal)">
            <textarea
              style={{ ...inputStyle, minHeight: "72px", resize: "vertical" }}
              value={form.websiteGoals}
              onChange={(e) => set("websiteGoals", e.target.value)}
              placeholder="What should the website help the business achieve? e.g. get more quote requests, build trust with residential customers…"
            />
          </Field>
          <Field label="Quote Form Notes (internal)">
            <textarea
              style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
              value={form.quoteFormNeeds}
              onChange={(e) => set("quoteFormNeeds", e.target.value)}
              placeholder="Notes on your quote or contact form needs (optional)"
            />
          </Field>
        </div>

        {/* ── Actions ───────────────────────────────────── */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "13px 0",
              borderRadius: "14px",
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {isNew ? "Create Business Profile" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "13px 24px",
              borderRadius: "14px",
              background: "#f1f5f9",
              color: "#0f172a",
              border: "none",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

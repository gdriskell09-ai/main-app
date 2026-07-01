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
  migrateLocalStorageProfiles,
} from "@/lib/business/storage";
import { getBlueprint } from "@/lib/business/blueprints/index";
import {
  peekWebsiteProfileDraft,
  consumeWebsiteProfileDraft,
  consumeWebsiteProfilePendingEdit,
  createWebsiteProfileDraft,
  createWebsiteProfileEditDraft,
  peekWebsiteProfileEditDraft,
  consumeWebsiteProfileEditDraft,
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

// ── Phone helpers ─────────────────────────────────────────────────

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function formatPhone(value: string | null | undefined): string {
  if (!value) return value ?? "";
  const d = digitsOnly(value);
  if (d.length !== 10) return value;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function formatPhoneInput(value: string): string {
  const d = digitsOnly(value).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
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

export default function BusinessSection({ onNavigate, onNavigateToCustomer, customers }: { onNavigate?: (section: string) => void; onNavigateToCustomer?: (customerId: string) => void; customers?: Array<{ id: string | number; name: string }> } = {}) {
  const [view, setView]         = useState<View>("list");
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [editing, setEditing]   = useState<BusinessProfile | null>(null);
  const [prefillData, setPrefillData] = useState<Partial<BusinessProfile> | null>(null);
  const [editDraftForm, setEditDraftForm] = useState<Partial<BusinessProfile> | null>(null);
  const [genStatus,      setGenStatus]      = useState<Record<string, GenStatus>>({});
  const [genError,       setGenError]       = useState<Record<string, string>>({});
  const [deleteConfirm,  setDeleteConfirm]  = useState<Record<string, boolean>>({});
  const [clearConfirm,   setClearConfirm]   = useState<Record<string, boolean>>({});
  const [search,            setSearch]            = useState("");
  const [activeFilter,      setActiveFilter]      = useState<"all" | "has-client" | "no-client" | "generated" | "stale">("all");
  const [sort,              setSort]              = useState<"newest" | "updated" | "name" | "industry">("newest");
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const profiles = await getAllProfiles();
    setProfiles(profiles);
  }, []);

  useEffect(() => {
    void (async () => {
      await migrateLocalStorageProfiles();
      void load();

      // A. New-profile creation draft — highest priority, unchanged behavior.
      const draft = peekWebsiteProfileDraft();
      if (draft) {
        setPrefillData(draft);
        setEditing(null);
        setView("create");
        return;
      }

      // B. One-shot pending-edit signal (from Customer detail "Edit" button or preview page).
      const pendingId = consumeWebsiteProfilePendingEdit();
      if (pendingId) {
        const editDraft = peekWebsiteProfileEditDraft();
        if (editDraft && editDraft.id !== pendingId) {
          consumeWebsiteProfileEditDraft();
        }
        (async () => {
          const profiles = await getAllProfiles();
          const target = profiles.find((p) => p.id === pendingId);
          if (target) {
            setEditing(target);
            setEditDraftForm(editDraft?.id === pendingId ? editDraft : null);
            setView("edit");
          }
        })();
        return;
      }

      // C. Reload recovery — reopen in-progress edit from sessionStorage draft.
      const editDraft = peekWebsiteProfileEditDraft();
      if (editDraft) {
        (async () => {
          const profiles = await getAllProfiles();
          const target = profiles.find((p) => p.id === editDraft.id);
          if (target) {
            setEditing(target);
            setEditDraftForm(editDraft);
            setView("edit");
          } else {
            consumeWebsiteProfileEditDraft();
          }
        })();
      }
    })();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setPrefillData(null);
    setView("create");
  }

  function openEdit(p: BusinessProfile) {
    setEditing(p);
    setEditDraftForm(null);
    setView("edit");
  }

  function handleSaved() {
    consumeWebsiteProfileDraft();
    consumeWebsiteProfileEditDraft();
    const returnCustomerId =
      (!editing && prefillData?.customer_id)
        ? prefillData.customer_id
        : (editing?.customer_id ?? null);
    load();
    setView("list");
    setEditing(null);
    setPrefillData(null);
    setEditDraftForm(null);
    if (returnCustomerId) {
      if (onNavigateToCustomer) {
        onNavigateToCustomer(returnCustomerId);
      } else {
        onNavigate?.("customers");
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProfile(id);
    } catch {
      // profile remains in list if delete fails
    }
    setDeleteConfirm((prev) => { const n = { ...prev }; delete n[id]; return n; });
    if (id === selectedProfileId) setSelectedProfileId(null);
    void load();
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
      const updated = await saveProfile({ ...p, generatedContent: data });
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

  async function handleClear(p: BusinessProfile) {
    try {
      const updated = await saveProfile({ ...p, generatedContent: undefined });
      setProfiles((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch {
      // badge remains if clear fails
    }
    setGenStatus((prev) => ({ ...prev, [p.id]: "idle" }));
    setGenError((prev) => ({ ...prev, [p.id]: "" }));
    setClearConfirm((prev) => { const n = { ...prev }; delete n[p.id]; return n; });
  }

  const displayed = profiles
    .filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.businessName.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        (p.city ?? "").toLowerCase().includes(q)
      );
    })
    .filter((p) => {
      const isStaleCheck = !!(p.updatedAt && p.generatedContent?.generatedAt && new Date(p.updatedAt) > new Date(p.generatedContent.generatedAt));
      if (activeFilter === "has-client")  return !!p.customer_id;
      if (activeFilter === "no-client")   return !p.customer_id;
      if (activeFilter === "generated")   return !!p.generatedContent;
      if (activeFilter === "stale")       return isStaleCheck;
      return true;
    })
    .sort((a, b) => {
      if (sort === "updated")  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sort === "name")     return a.businessName.localeCompare(b.businessName, undefined, { sensitivity: "base" });
      if (sort === "industry") return a.industry.localeCompare(b.industry, undefined, { sensitivity: "base" });
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const isFiltered = search.trim() !== "" || activeFilter !== "all";

  if (view === "create" || view === "edit") {
    return (
      <BusinessEditor
        existing={editing}
        prefill={prefillData ?? undefined}
        onSaved={handleSaved}
        onCancel={() => {
          consumeWebsiteProfileDraft();
          consumeWebsiteProfileEditDraft();
          setView("list");
          setEditing(null);
          setPrefillData(null);
          setEditDraftForm(null);
        }}
        onFormChange={
          editing
            ? (f) => createWebsiteProfileEditDraft(editing.id, f)
            : prefillData !== null
            ? (f) => createWebsiteProfileDraft(f)
            : undefined
        }
        editDraftForm={editDraftForm}
      />
    );
  }

  // ── List view (two-panel master/detail) ──────────────────────────
  const selectedProfile = profiles.find((p) => p.id === selectedProfileId) ?? null;

  return (
    <div className="w-full h-full bs-two-panel">
      <style>{`
        .bs-two-panel { display: flex; flex-direction: row; overflow: hidden; }
        .bs-left-panel { width: 272px; flex-shrink: 0; border-right: 1px solid #e8edf2; height: 100%; display: flex; flex-direction: column; background: #ffffff; }
        .bs-right-panel { flex: 1; height: 100%; overflow-y: auto; }
        @media (max-width: 640px) {
          .bs-two-panel { flex-direction: column; }
          .bs-left-panel { width: 100%; height: auto; max-height: 300px; border-right: none; border-bottom: 1px solid #e8edf2; }
          .bs-right-panel { flex: 1; min-height: 0; }
        }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div className="bs-left-panel">
        {/* Header */}
        <div style={{ padding: "18px 14px 12px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Website Profiles</h2>
            <button
              onClick={openCreate}
              style={{ padding: "5px 12px", borderRadius: "8px", background: "#0f172a", color: "#ffffff", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              + New
            </button>
          </div>
          <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
            {profiles.length === 0
              ? "No profiles yet"
              : isFiltered
              ? `${displayed.length} of ${profiles.length} profile${profiles.length === 1 ? "" : "s"}`
              : `${profiles.length} profile${profiles.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {/* Search + sort + filter — only when profiles exist */}
        {profiles.length > 0 && (
          <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: "7px" }}>
            <input
              type="search"
              placeholder="Search name, industry, city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "12px", color: "#0f172a", background: "#ffffff", outline: "none", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0 }}>Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                style={{ flex: 1, padding: "5px 7px", borderRadius: "7px", border: "1.5px solid #e2e8f0", fontSize: "12px", color: "#0f172a", background: "#ffffff", cursor: "pointer" }}
              >
                <option value="newest">Newest</option>
                <option value="updated">Recently Updated</option>
                <option value="name">Name A→Z</option>
                <option value="industry">Industry</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {(["all", "has-client", "no-client", "generated", "stale"] as const).map((f) => {
                const labels: Record<typeof f, string> = { all: "All", "has-client": "Has Client", "no-client": "No Client", generated: "Generated", stale: "Stale" };
                const active = activeFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{ padding: "3px 9px", borderRadius: "999px", border: active ? "1.5px solid #0f172a" : "1.5px solid #e2e8f0", background: active ? "#0f172a" : "#ffffff", color: active ? "#ffffff" : "#64748b", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
                  >
                    {labels[f]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Profile list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Empty state — no profiles at all */}
          {profiles.length === 0 && (
            <div style={{ textAlign: "center", padding: "36px 16px" }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>🏢</div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>No profiles yet</p>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 14px" }}>Create your first profile.</p>
              <button onClick={openCreate} style={{ padding: "7px 16px", borderRadius: "8px", background: "#0f172a", color: "#ffffff", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                Create First
              </button>
            </div>
          )}

          {/* No-results state — profiles exist but none match filters */}
          {profiles.length > 0 && displayed.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>🔍</div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>No profiles match</p>
              <button
                onClick={() => { setSearch(""); setActiveFilter("all"); }}
                style={{ marginTop: "8px", padding: "6px 14px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#ffffff", color: "#0f172a", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Profile rows */}
          {displayed.map((p) => {
            const isSelected = p.id === selectedProfileId;
            const packColor = STYLE_PACKS.find((s) => s.id === p.preferredStylePack)?.color ?? "#0ea5e9";
            const hasContent = !!p.generatedContent;
            const isStaleRow = !!(p.updatedAt && p.generatedContent?.generatedAt && new Date(p.updatedAt) > new Date(p.generatedContent.generatedAt));
            const linkedName = p.customer_id && customers ? (customers.find((c) => String(c.id) === p.customer_id)?.name ?? null) : null;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProfileId(isSelected ? null : p.id)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 14px", border: "none", borderBottom: "1px solid #f1f5f9", background: isSelected ? "#f8fafc" : "transparent", cursor: "pointer" }}
              >
                <div style={{ width: "100%", height: "2px", borderRadius: "1px", background: isSelected ? packColor : `${packColor}40`, marginBottom: "5px" }} />
                <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.businessName}
                </p>
                <p style={{ margin: "0 0 5px", fontSize: "11px", color: "#64748b" }}>
                  {[p.industry, p.city].filter(Boolean).join(" · ") || "No details"}
                </p>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {hasContent && !isStaleRow && (
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#15803d", background: "#dcfce7", borderRadius: "4px", padding: "1px 5px" }}>Generated</span>
                  )}
                  {isStaleRow && (
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#92400e", background: "#fef3c7", borderRadius: "4px", padding: "1px 5px" }}>Stale</span>
                  )}
                  {linkedName && (
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#7c3aed", background: "#f5f3ff", borderRadius: "4px", padding: "1px 5px" }}>{linkedName}</span>
                  )}
                  {p.customer_id && !linkedName && (
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#7c3aed", background: "#f5f3ff", borderRadius: "4px", padding: "1px 5px" }}>Client</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="bs-right-panel">
        {!selectedProfile ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.4 }}>←</div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: "0 0 6px" }}>Select a profile</p>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Choose a profile from the list to view and manage it.</p>
          </div>
        ) : (
          (() => {
            const p = selectedProfile;
            const packColor = STYLE_PACKS.find((s) => s.id === p.preferredStylePack)?.color ?? "#0ea5e9";
            const linkedCustomerName = p.customer_id && customers
              ? (customers.find((c) => String(c.id) === p.customer_id)?.name ?? null)
              : null;
            const isStale = !!(p.updatedAt && p.generatedContent?.generatedAt && new Date(p.updatedAt) > new Date(p.generatedContent.generatedAt));
            const genSt   = genStatus[p.id] ?? "idle";
            const genErr  = genError[p.id];
            const hasContent = !!p.generatedContent;

            let genLabel = hasContent ? "Regenerate Content" : "Generate Website Content";
            let genBg    = "#ffffff";
            let genCol   = "#374151";
            let genBorder = "1px solid #e8edf2";
            let genDisabled = false;
            if (genSt === "generating") { genLabel = "Generating…"; genBg = "#f8fafc"; genCol = "#94a3b8"; genBorder = "1px solid #e8edf2"; genDisabled = true; }
            else if (genSt === "success") { genLabel = hasContent ? "Regenerate Content" : "Generated!"; genBg = "#f0fdf4"; genCol = "#15803d"; genBorder = "1px solid #bbf7d0"; }
            else if (genSt === "error")   { genLabel = "Try Again";   genBg = "#fff1f2"; genCol = "#e11d48"; genBorder = "1px solid #fecdd3"; }

            return (
              <div style={{ padding: "28px 28px 64px", maxWidth: "680px" }}>
                {/* Color accent bar */}
                <div style={{ height: "5px", borderRadius: "3px", background: `linear-gradient(90deg, ${packColor}, ${packColor}50)`, marginBottom: "20px" }} />

                {/* Name + meta */}
                <div style={{ marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>{p.businessName}</h2>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    {p.industry && <span style={{ fontSize: "12px", color: "#64748b", background: "#f1f5f9", borderRadius: "6px", padding: "2px 9px" }}>{p.industry}</span>}
                    {p.city    && <span style={{ fontSize: "12px", color: "#64748b" }}>📍 {p.city}</span>}
                    {p.phone   && <span style={{ fontSize: "12px", color: "#64748b" }}>📞 {formatPhone(p.phone)}</span>}
                  </div>
                </div>

                {/* Services */}
                {p.services.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>Services</p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {p.services.map((s) => <span key={s} style={{ fontSize: "12px", color: "#475569", background: "#f1f5f9", borderRadius: "6px", padding: "3px 9px" }}>{s}</span>)}
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: packColor, background: `${packColor}15`, borderRadius: "6px", padding: "3px 9px", border: `1px solid ${packColor}30` }}>
                    {STYLE_PACKS.find((s) => s.id === p.preferredStylePack)?.label}
                  </span>
                  {p.desiredCustomModules.map((m) => (
                    <span key={m} style={{ fontSize: "11px", color: "#475569", background: "#f1f5f9", borderRadius: "6px", padding: "3px 9px" }}>
                      {CUSTOM_MODULES.find((c) => c.id === m)?.label ?? m}
                    </span>
                  ))}
                  {p.generatedContent && (
                    <span style={{ fontSize: "11px", fontWeight: 600, color: p.generatedContent.source === "groq" ? "#0284c7" : "#64748b", background: p.generatedContent.source === "groq" ? "#e0f2fe" : "#f1f5f9", borderRadius: "6px", padding: "3px 9px", border: p.generatedContent.source === "groq" ? "1px solid #bae6fd" : "1px solid #e2e8f0" }}>
                      {p.generatedContent.source === "groq" ? "AI Content" : "Blueprint"}
                    </span>
                  )}
                </div>

                {/* Linked customer */}
                {p.customer_id && (
                  <div style={{ marginBottom: "20px", padding: "11px 14px 11px 16px", background: "#ffffff", borderRadius: "10px", border: "1px solid #e8edf2", borderLeft: "3px solid #7c3aed", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151", margin: 0 }}>
                      {linkedCustomerName ? `Linked to ${linkedCustomerName}` : "Linked to a customer"}
                    </p>
                    <button
                      onClick={() => onNavigateToCustomer?.(p.customer_id!)}
                      style={{ padding: "6px 14px", borderRadius: "8px", background: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      {linkedCustomerName ? `${linkedCustomerName} ↗` : "View Client ↗"}
                    </button>
                  </div>
                )}

                {/* Primary actions */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                  <a
                    href={`/website-preview/${p.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ flex: 1, minWidth: "140px", padding: "11px 0", borderRadius: "10px", background: "#0f172a", color: "#ffffff", fontSize: "14px", fontWeight: 600, textDecoration: "none", textAlign: "center" }}
                  >
                    Open Preview ↗
                  </a>
                  <button
                    onClick={() => openEdit(p)}
                    style={{ flex: 1, minWidth: "110px", padding: "11px 16px", borderRadius: "10px", background: "#ffffff", color: "#374151", border: "1px solid #e8edf2", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Generate content */}
                <div style={{ marginBottom: "16px" }}>
                  <button
                    onClick={() => handleGenerate(p)}
                    disabled={genDisabled}
                    style={{ width: "100%", padding: "11px 0", borderRadius: "10px", background: genBg, color: genCol, border: genBorder, fontSize: "13px", fontWeight: 600, cursor: genDisabled ? "not-allowed" : "pointer", transition: "all 0.15s ease" }}
                  >
                    {genLabel}
                  </button>
                  {genSt === "error" && genErr && (
                    <p style={{ fontSize: "11px", color: "#e11d48", margin: "4px 0 0" }}>{genErr}</p>
                  )}
                </div>

                {/* Generated content timestamp + clear */}
                {p.generatedContent && (
                  <div style={{ padding: "10px 0", borderTop: "1px solid #f1f5f9", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                          Generated {new Date(p.generatedContent.generatedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                        </span>
                        {isStale && (
                          <span style={{ fontSize: "11px", fontWeight: 500, color: "#92400e", background: "#fef3c7", borderRadius: "5px", padding: "1px 7px", border: "1px solid #fde68a" }}>
                            Content may be outdated
                          </span>
                        )}
                      </div>
                      {clearConfirm[p.id] ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => handleClear(p)} style={{ padding: "5px 12px", borderRadius: "8px", background: "#e11d48", color: "#ffffff", border: "none", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>
                            Confirm clear
                          </button>
                          <button onClick={() => setClearConfirm((prev) => ({ ...prev, [p.id]: false }))} style={{ padding: "5px 12px", borderRadius: "8px", background: "#ffffff", color: "#64748b", border: "1px solid #e8edf2", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setClearConfirm((prev) => ({ ...prev, [p.id]: true }))} style={{ padding: "5px 12px", borderRadius: "8px", background: "#ffffff", color: "#94a3b8", border: "1px solid #e8edf2", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
                          Reset to blueprint
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Delete */}
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
                  {deleteConfirm[p.id] ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleDelete(p.id)} style={{ padding: "10px 20px", borderRadius: "10px", background: "#e11d48", color: "#ffffff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                        Confirm delete
                      </button>
                      <button onClick={() => setDeleteConfirm((prev) => ({ ...prev, [p.id]: false }))} style={{ padding: "10px 20px", borderRadius: "10px", background: "#ffffff", color: "#64748b", border: "1px solid #e8edf2", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm((prev) => ({ ...prev, [p.id]: true }))} style={{ padding: "10px 20px", borderRadius: "10px", background: "#ffffff", color: "#e11d48", border: "1px solid #fecdd3", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                      Delete Profile
                    </button>
                  )}
                </div>
              </div>
            );
          })()
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
  onFormChange?: (form: Partial<BusinessProfile>) => void;
  editDraftForm?: Partial<BusinessProfile> | null;
}

function BusinessEditor({ existing, prefill, onSaved, onCancel, onFormChange, editDraftForm }: EditorProps) {
  const isNew = !existing;
  const [form, setForm] = useState<Omit<BusinessProfile, "id" | "createdAt" | "updatedAt">>(() => {
    if (existing) {
      const base = {
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
      if (editDraftForm) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _i, createdAt: _ca, updatedAt: _ua, generatedContent: _gc, ...safe } = editDraftForm;
        return { ...base, ...safe };
      }
      return base;
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

  useEffect(() => {
    onFormChange?.(form);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

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
    if (form.phone.trim() && digitsOnly(form.phone).length !== 10)
      errs.push("Phone number must be 10 digits (US format).");
    setErrors(errs);
    return errs.length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
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
    try {
      await saveProfile(profile);
    } catch {
      setErrors(["Failed to save profile. Please try again."]);
      return;
    }
    onSaved();
  }

  return (
    <form className="w-full h-full flex flex-col" onSubmit={handleSubmit}>
      <style>{`
        @media (max-width: 540px) {
          .bs-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ padding: "32px 16px 24px", maxWidth: "680px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <button
            type="button"
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
                onChange={(e) => set("phone", formatPhoneInput(e.target.value))}
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

      </div>
      </div>

      {/* ── Sticky footer action bar ── */}
      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid #e8edf2",
          background: "#ffffff",
          padding: "14px 20px",
          display: "flex",
          gap: "12px",
        }}
      >
        <button
          type="submit"
          style={{
            flex: 1,
            maxWidth: "320px",
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
            background: "#ffffff",
            color: "#374151",
            border: "1px solid #e8edf2",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

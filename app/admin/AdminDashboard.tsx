"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "not_interested";

type Lead = {
  id: number;
  name: string;
  business: string | null;
  type: string | null;
  need: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const statusConfig: Record<LeadStatus, { label: string; dot: string; bg: string }> = {
  new: { label: "New", dot: "bg-emerald-400", bg: "bg-emerald-50 text-emerald-800" },
  contacted: { label: "Contacted", dot: "bg-sky-400", bg: "bg-sky-50 text-sky-800" },
  qualified: { label: "Qualified", dot: "bg-violet-400", bg: "bg-violet-50 text-violet-800" },
  converted: { label: "Converted", dot: "bg-amber-400", bg: "bg-amber-50 text-amber-800" },
  not_interested: { label: "Not interested", dot: "bg-slate-300", bg: "bg-slate-100 text-slate-600" },
};

const allStatuses = Object.keys(statusConfig) as LeadStatus[];

function formatPhone(value: string | null | undefined): string {
  if (!value) return value ?? "";
  const d = value.replace(/\D/g, "");
  if (d.length !== 10) return value;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type LeadDetailProps = {
  lead: Lead;
  notesValue: string;
  saving: boolean;
  onClose: () => void;
  onStatusChange: (s: LeadStatus) => void;
  onNotesChange: (v: string) => void;
  onNotesSave: () => void;
};

function LeadDetail({ lead, notesValue, saving, onClose, onStatusChange, onNotesChange, onNotesSave }: LeadDetailProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{lead.name}</h2>
          {lead.business && <p className="mt-0.5 text-sm text-slate-500">{lead.business}</p>}
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-black/10 px-3 py-1 text-xs text-slate-500 transition hover:border-slate-400"
        >
          Close
        </button>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Status</p>
        <div className="flex flex-wrap gap-2">
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                lead.status === s
                  ? statusConfig[s].bg + " ring-2 ring-offset-1 ring-slate-950/10"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-black/5 bg-[#f7f5ef] p-5 text-sm sm:grid-cols-2">
        {[
          { label: "Email", value: lead.email },
          { label: "Phone", value: formatPhone(lead.phone) },
          { label: "Business type", value: lead.type },
          { label: "Needs", value: lead.need },
          { label: "Submitted", value: formatDate(lead.created_at) },
        ].map(
          ({ label, value }) =>
            value && (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="mt-1 text-slate-800">{value}</p>
              </div>
            )
        )}
      </div>

      {lead.message && (
        <div className="mt-5 rounded-[1.5rem] border border-black/5 bg-[#f7f5ef] p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Message</p>
          <p className="text-sm leading-6 text-slate-700">{lead.message}</p>
        </div>
      )}

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Notes</p>
        <textarea
          value={notesValue}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={5}
          placeholder="Add notes about this lead…"
          className="w-full resize-none rounded-[1.5rem] border border-black/10 bg-[#f7f5ef] px-5 py-4 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
        />
        <button
          onClick={onNotesSave}
          disabled={saving}
          className="mt-2 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save notes"}
        </button>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [saving, setSaving] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads((data as Lead[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function updateStatus(lead: Lead, status: LeadStatus) {
    await supabase.from("leads").update({ status }).eq("id", lead.id);
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    if (selected?.id === lead.id) setSelected({ ...lead, status });
  }

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    await supabase.from("leads").update({ notes: notesValue }).eq("id", selected.id);
    setLeads((prev) =>
      prev.map((l) => (l.id === selected.id ? { ...l, notes: notesValue } : l))
    );
    setSelected({ ...selected, notes: notesValue });
    setSaving(false);
  }

  function openLead(lead: Lead) {
    setSelected(lead);
    setNotesValue(lead.notes ?? "");
  }

  const displayed = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    converted: leads.filter((l) => l.status === "converted").length,
    not_interested: leads.filter((l) => l.status === "not_interested").length,
  };

  return (
    <div className="flex min-h-screen bg-[#f7f5ef]">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-black/5 bg-white px-4 py-6 lg:flex">
        <a href="/" className="px-2 text-base font-semibold tracking-tight text-slate-950">
          Main App
        </a>
        <nav className="mt-8 flex flex-col gap-1 text-sm">
          <span className="px-2 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            CRM
          </span>
          <button className="rounded-xl bg-slate-950 px-3 py-2 text-left font-medium text-white">
            Leads
          </button>
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-black/5 bg-white px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-950">Leads</h1>
            <p className="text-sm text-slate-500">{counts.all} total</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-black/10 bg-[#f7f5ef] px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 lg:hidden"
          >
            Sign out
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Lead list */}
          <div className="flex w-full flex-col overflow-hidden lg:max-w-xl xl:max-w-2xl">
            {/* Filter tabs */}
            <div className="flex gap-1 overflow-x-auto border-b border-black/5 bg-white px-4 py-3">
              <button
                onClick={() => setFilter("all")}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === "all" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                All ({counts.all})
              </button>
              {allStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === s ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  {statusConfig[s].label} ({counts[s]})
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex h-40 items-center justify-center text-sm text-slate-400">
                  Loading…
                </div>
              ) : displayed.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-slate-400">
                  No leads yet.
                </div>
              ) : (
                displayed.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => openLead(lead)}
                    className={`w-full border-b border-black/5 px-5 py-4 text-left transition hover:bg-white ${selected?.id === lead.id ? "bg-white" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">{lead.name}</p>
                        {lead.business && (
                          <p className="truncate text-xs text-slate-500">{lead.business}</p>
                        )}
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig[lead.status].bg}`}
                      >
                        {statusConfig[lead.status].label}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                      <span>{lead.email}</span>
                      <span>·</span>
                      <span>{formatDate(lead.created_at)}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Desktop detail panel */}
          {selected ? (
            <div className="hidden flex-1 overflow-y-auto border-l border-black/5 bg-white p-7 lg:block">
              <LeadDetail
                lead={selected}
                notesValue={notesValue}
                saving={saving}
                onClose={() => setSelected(null)}
                onStatusChange={(s) => updateStatus(selected, s)}
                onNotesChange={setNotesValue}
                onNotesSave={saveNotes}
              />
            </div>
          ) : (
            <div className="hidden flex-1 items-center justify-center border-l border-black/5 text-sm text-slate-400 lg:flex">
              Select a lead to view details
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {selected && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
            <LeadDetail
              lead={selected}
              notesValue={notesValue}
              saving={saving}
              onClose={() => setSelected(null)}
              onStatusChange={(s) => updateStatus(selected, s)}
              onNotesChange={setNotesValue}
              onNotesSave={saveNotes}
            />
          </div>
        </div>
      )}
    </div>
  );
}

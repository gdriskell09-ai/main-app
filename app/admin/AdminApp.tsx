"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import BusinessSection from "@/app/components/admin/BusinessSection";
import type { BusinessProfile } from "@/lib/business/types";
import { getAllProfiles } from "@/lib/business/storage";
import {
  createWebsiteProfileDraft,
  createWebsiteProfilePendingEdit,
  consumeNavTarget,
} from "@/lib/business/draftProfile";

const LeadMapComponent   = dynamic(() => import("./LeadMap"),    { ssr: false });
const CanvassMapComponent = dynamic(() => import("./CanvassMap"), { ssr: false });

// ─── Phone helpers ────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────

type Section = "dashboard" | "leads" | "customers" | "invoices" | "map" | "canvass" | "maphub" | "contracts" | "ai_generator" | "websites" | "settings";
type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "not_interested";
type JobStatus = "scheduled" | "in_progress" | "complete" | "cancelled";
type QuoteStatus = "draft" | "sent" | "accepted" | "declined";
type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

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
  city: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
};

type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  business: string | null;
  address: string | null;
  notes: string | null;
  lead_id: number | null;
  created_at: string;
};

type LineItem = { description: string; qty: number; price: number };

type Quote = {
  id: string;
  customer_id: string;
  title: string;
  line_items: LineItem[];
  total: number;
  status: QuoteStatus;
  notes: string | null;
  created_at: string;
};

type Job = {
  id: number;
  customer_id: string;
  quote_id: string | null;
  title: string;
  status: JobStatus;
  scheduled_date: string | null;
  notes: string | null;
  created_at: string;
};

type Invoice = {
  id: string;
  customer_id: string;
  quote_id: string | null;
  invoice_number: string;
  title: string;
  line_items: LineItem[];
  total: number;
  status: InvoiceStatus;
  due_date: string | null;
  notes: string | null;
  created_at: string;
};

// ─── Config ───────────────────────────────────────────────────

const LEAD_STATUS: Record<LeadStatus, { label: string; pill: string }> = {
  new:            { label: "New",            pill: "bg-emerald-100 text-emerald-800" },
  contacted:      { label: "Contacted",      pill: "bg-sky-100 text-sky-800"         },
  qualified:      { label: "Qualified",      pill: "bg-violet-100 text-violet-800"   },
  converted:      { label: "Converted",      pill: "bg-amber-100 text-amber-800"     },
  not_interested: { label: "Not interested", pill: "bg-slate-100 text-slate-600"     },
};

const JOB_STATUS: Record<JobStatus, { label: string; pill: string }> = {
  scheduled:   { label: "Scheduled",   pill: "bg-sky-100 text-sky-800"        },
  in_progress: { label: "In Progress", pill: "bg-violet-100 text-violet-800"  },
  complete:    { label: "Complete",    pill: "bg-emerald-100 text-emerald-800" },
  cancelled:   { label: "Cancelled",   pill: "bg-slate-100 text-slate-600"    },
};

const QUOTE_STATUS: Record<QuoteStatus, { label: string; pill: string }> = {
  draft:    { label: "Draft",    pill: "bg-slate-100 text-slate-600"     },
  sent:     { label: "Sent",     pill: "bg-sky-100 text-sky-800"         },
  accepted: { label: "Accepted", pill: "bg-emerald-100 text-emerald-800" },
  declined: { label: "Declined", pill: "bg-rose-100 text-rose-700"       },
};

const INVOICE_STATUS: Record<InvoiceStatus, { label: string; pill: string }> = {
  draft:   { label: "Draft",   pill: "bg-slate-100 text-slate-600"     },
  sent:    { label: "Sent",    pill: "bg-sky-100 text-sky-800"         },
  paid:    { label: "Paid",    pill: "bg-emerald-100 text-emerald-800" },
  overdue: { label: "Overdue", pill: "bg-rose-100 text-rose-700"       },
};

const ALL_LEAD_STATUSES    = Object.keys(LEAD_STATUS)    as LeadStatus[];
const ALL_JOB_STATUSES     = Object.keys(JOB_STATUS)     as JobStatus[];
const ALL_QUOTE_STATUSES   = Object.keys(QUOTE_STATUS)   as QuoteStatus[];
const ALL_INVOICE_STATUSES = Object.keys(INVOICE_STATUS) as InvoiceStatus[];

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function usd(n: number) { return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }

// ─── Stat card ────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────

function DashboardSection({
  leads, customers, jobs, invoices, onGoToLeads, onGoToCustomers, onGoToInvoices,
}: {
  leads: Lead[]; customers: Customer[]; jobs: Job[]; invoices: Invoice[];
  onGoToLeads: () => void; onGoToCustomers: () => void; onGoToInvoices: () => void;
}) {
  const converted     = leads.filter((l) => l.status === "converted").length;
  const newLeads      = leads.filter((l) => l.status === "new").length;
  const convRate      = leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0;
  const activeJobs    = jobs.filter((j) => j.status === "in_progress").length;
  const scheduledJobs = jobs.filter((j) => j.status === "scheduled").length;
  const overdueCount  = invoices.filter((i) => i.status === "overdue").length;
  const recent        = leads.slice(0, 6);

  const paidRevenue = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const outstanding = invoices.filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + i.total, 0);

  const activeJobList = jobs.filter((j) => j.status !== "cancelled" && j.status !== "complete").slice(0, 6);

  return (
    <div className="w-full h-full overflow-y-auto">
      {/* Page header */}
      <div className="border-b border-black/5 bg-white px-6 py-5 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-950">Overview</h1>
            <p className="mt-0.5 text-sm text-slate-400">Your business at a glance</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button onClick={onGoToLeads}
              className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
              View leads
            </button>
            <button onClick={onGoToCustomers}
              className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800">
              Customers
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {/* Business flow pipeline */}
        <div className="mb-5 overflow-x-auto">
          <div className="flex min-w-max items-center gap-1 rounded-[1.5rem] border border-black/5 bg-white px-5 py-3.5">
            {[
              { step: "Lead",     sub: "Contact form",       active: leads.length > 0,     icon: "📥" },
              { step: "Customer", sub: "Convert & track",    active: customers.length > 0, icon: "👤" },
              { step: "Quote",    sub: "Price the job",      active: customers.length > 0, icon: "📋" },
              { step: "Job",      sub: "Schedule & track",   active: jobs.length > 0,      icon: "🔧" },
              { step: "Invoice",  sub: "Close it out",       active: invoices.length > 0,  icon: "🧾" },
            ].map((s, i, arr) => (
              <div key={s.step} className="flex items-center gap-1">
                <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${s.active ? "bg-slate-950 text-white" : "bg-[#f7f5ef] text-slate-400"}`}>
                  <span className="text-sm">{s.icon}</span>
                  <div>
                    <p className={`text-xs font-semibold ${s.active ? "text-white" : "text-slate-500"}`}>{s.step}</p>
                    <p className={`text-[10px] leading-none ${s.active ? "text-slate-400" : "text-slate-400"}`}>{s.sub}</p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <span className="px-0.5 text-xs text-slate-300">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Revenue spotlight */}
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Paid Revenue</p>
            <p className="mt-2 text-4xl font-bold tracking-tight">{usd(paidRevenue)}</p>
            <p className="mt-1.5 text-sm text-slate-400">
              {invoices.filter((i) => i.status === "paid").length} paid invoice{invoices.filter((i) => i.status === "paid").length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className={`rounded-[1.5rem] border p-6 ${outstanding > 0 ? "border-amber-200 bg-amber-50" : "border-black/5 bg-white"}`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Outstanding</p>
            <p className={`mt-2 text-4xl font-bold tracking-tight ${outstanding > 0 ? "text-amber-700" : "text-slate-950"}`}>
              {usd(outstanding)}
            </p>
            <p className="mt-1.5 text-sm text-slate-500">
              {overdueCount > 0
                ? <button onClick={onGoToInvoices} className="font-semibold text-rose-600 underline underline-offset-2">{overdueCount} overdue — follow up now</button>
                : "No overdue invoices"}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total leads" value={leads.length} sub={newLeads > 0 ? `${newLeads} new, awaiting contact` : "No new leads"} />
          <StatCard label="Customers" value={customers.length} sub={activeJobs > 0 ? `${activeJobs} job${activeJobs !== 1 ? "s" : ""} in progress` : "No active jobs"} />
          <StatCard label="Conversion" value={`${convRate}%`} sub={`${converted} of ${leads.length} leads won`} />
          <StatCard label="Scheduled" value={scheduledJobs + activeJobs} sub={`${scheduledJobs} upcoming · ${activeJobs} in progress`} />
        </div>

        {/* Recent activity */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Recent leads */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-950">Recent leads</h2>
              <button onClick={onGoToLeads} className="text-xs text-slate-400 transition hover:text-slate-950">View all →</button>
            </div>
            {recent.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-black/10 p-8 text-center text-sm text-slate-400">
                No leads yet. Share your{" "}
                <a href="/contact" className="underline underline-offset-2 hover:text-slate-950">contact page</a>{" "}to start.
              </div>
            ) : (
              <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white">
                {recent.map((lead, i) => (
                  <div key={lead.id} className={`flex items-center justify-between px-5 py-3.5 ${i < recent.length - 1 ? "border-b border-black/5" : ""}`}>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-950">{lead.name}</p>
                      <p className="truncate text-xs text-slate-400">{lead.business ?? lead.email}</p>
                    </div>
                    <span className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${LEAD_STATUS[lead.status].pill}`}>
                      {LEAD_STATUS[lead.status].label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active jobs */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-950">Active &amp; scheduled jobs</h2>
              <button onClick={onGoToCustomers} className="text-xs text-slate-400 transition hover:text-slate-950">View customers →</button>
            </div>
            {activeJobList.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-black/10 p-8 text-center text-sm text-slate-400">
                No active jobs yet.{" "}
                <button onClick={onGoToCustomers} className="underline underline-offset-2 hover:text-slate-950">Add a customer →</button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white">
                {activeJobList.map((job, i) => (
                  <div key={job.id} className={`flex items-center justify-between px-5 py-3.5 ${i < activeJobList.length - 1 ? "border-b border-black/5" : ""}`}>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-950">{job.title}</p>
                      <p className="text-xs text-slate-400">{job.scheduled_date ? fmtDate(job.scheduled_date) : "No date set"}</p>
                    </div>
                    <span className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${JOB_STATUS[job.status].pill}`}>
                      {JOB_STATUS[job.status].label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lead detail ──────────────────────────────────────────────

function LeadDetail({
  lead, notes, saving, hasCustomer, creatingCustomer,
  onClose, onStatusChange, onNotesChange, onNotesSave, onDelete, onCreateCustomer, onViewCustomer,
}: {
  lead: Lead; notes: string; saving: boolean; hasCustomer: boolean; creatingCustomer: boolean;
  onClose: () => void; onStatusChange: (s: LeadStatus) => void;
  onNotesChange: (v: string) => void; onNotesSave: () => void;
  onDelete: () => void; onCreateCustomer: () => void; onViewCustomer?: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-slate-950">{lead.name}</h2>
          {lead.business && <p className="mt-0.5 text-sm text-slate-500">{lead.business}</p>}
          <p className="mt-0.5 text-xs text-slate-400">Lead #{lead.id}</p>
        </div>
        <button onClick={onClose} className="shrink-0 rounded-full border border-black/10 px-3 py-1 text-xs text-slate-500 transition hover:border-slate-400">Close</button>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Status</p>
        <div className="flex flex-wrap gap-2">
          {ALL_LEAD_STATUSES.map((s) => (
            <button key={s} onClick={() => onStatusChange(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${lead.status === s ? LEAD_STATUS[s].pill + " ring-2 ring-offset-1 ring-slate-950/10" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {LEAD_STATUS[s].label}
            </button>
          ))}
        </div>
      </div>

      {hasCustomer ? (
        <div className="mt-4 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-emerald-800">✓ Customer record linked.</p>
            {onViewCustomer && (
              <button onClick={onViewCustomer}
                className="shrink-0 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">
                View customer ↗
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-[1.5rem] border border-black/5 bg-[#f7f5ef] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600">No customer record yet.</p>
            <button onClick={onCreateCustomer} disabled={creatingCustomer}
              className="shrink-0 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
              {creatingCustomer ? "Creating…" : "Create customer from lead"}
            </button>
          </div>
        </div>
      )}
      <div className="mt-4 grid gap-3 rounded-[1.5rem] border border-black/5 bg-[#f7f5ef] p-5 text-sm sm:grid-cols-2">
        {[
          { label: "Email", value: lead.email },
          { label: "Phone", value: formatPhone(lead.phone) },
          { label: "Business type", value: lead.type },
          { label: "Needs", value: lead.need },
          { label: "Submitted", value: fmt(lead.created_at) },
        ].map(({ label, value }) => value && (
          <div key={label}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
            <p className="mt-1 text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      {lead.message && (
        <div className="mt-4 rounded-[1.5rem] border border-black/5 bg-[#f7f5ef] p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Message</p>
          <p className="text-sm leading-6 text-slate-700">{lead.message}</p>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Notes</p>
        <textarea value={notes} onChange={(e) => onNotesChange(e.target.value)} rows={4} placeholder="Add notes about this lead…"
          className="w-full resize-none rounded-[1.5rem] border border-black/10 bg-[#f7f5ef] px-5 py-4 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5" />
        <button onClick={onNotesSave} disabled={saving}
          className="mt-2 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
          {saving ? "Saving…" : "Save notes"}
        </button>
      </div>

      <div className="mt-6 border-t border-black/5 pt-5">
        {confirmDelete ? (
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-600">Delete permanently?</p>
            <button onClick={onDelete} className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700">Delete</button>
            <button onClick={() => setConfirmDelete(false)} className="rounded-full border border-black/10 px-4 py-1.5 text-xs text-slate-600 transition hover:border-slate-400">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="text-xs text-rose-500 transition hover:text-rose-700">Delete lead</button>
        )}
      </div>
    </>
  );
}

// ─── Leads section ────────────────────────────────────────────

function LeadsSection({
  leads, loading, customers, onUpdateStatus, onSaveNotes, onDelete, onCreateCustomer,
  selectedLeadId, onSelectLead, onNavigateToCustomer,
}: {
  leads: Lead[]; loading: boolean; customers: Customer[];
  onUpdateStatus: (id: number, status: LeadStatus) => void;
  onSaveNotes: (id: number, notes: string) => Promise<void>;
  onDelete: (id: number) => void;
  onCreateCustomer: (lead: Lead) => Promise<void>;
  selectedLeadId: number | null;
  onSelectLead: (id: number | null) => void;
  onNavigateToCustomer?: (id: string) => void;
}) {
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);

  const selected = leads.find((l) => l.id === selectedLeadId) ?? null;

  const leadIdSet = new Set(customers.map((c) => c.lead_id).filter(Boolean));
  const linkedCustomer = selected ? (customers.find((c) => c.lead_id === selected.id) ?? null) : null;

  function openLead(lead: Lead) { onSelectLead(lead.id); }

  // Sync notes textarea when the selected lead changes
  useEffect(() => {
    setNotes(selected?.notes ?? "");
  }, [selectedLeadId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSaveNotes() {
    if (!selected) return;
    setSaving(true);
    await onSaveNotes(selected.id, notes);
    setSaving(false);
  }
  function handleStatusChange(status: LeadStatus) {
    if (!selected) return;
    onUpdateStatus(selected.id, status);
  }
  async function handleCreateCustomer() {
    if (!selected || creatingCustomer) return;
    setCreatingCustomer(true);
    try {
      await onCreateCustomer(selected);
    } finally {
      setCreatingCustomer(false);
    }
  }

  const counts: Record<string, number> = {
    all: leads.length,
    ...Object.fromEntries(ALL_LEAD_STATUSES.map((s) => [s, leads.filter((l) => l.status === s).length])),
  };
  const displayed = leads
    .filter((l) => filter === "all" || l.status === filter)
    .filter((l) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || (l.business ?? "").toLowerCase().includes(q);
    });

  const detailProps = selected ? {
    lead: selected, notes, saving, creatingCustomer,
    hasCustomer: leadIdSet.has(selected.id),
    onClose: () => onSelectLead(null),
    onStatusChange: handleStatusChange,
    onNotesChange: setNotes,
    onNotesSave: handleSaveNotes,
    onDelete: () => { onDelete(selected.id); onSelectLead(null); },
    onCreateCustomer: handleCreateCustomer,
    onViewCustomer: linkedCustomer && onNavigateToCustomer
      ? () => onNavigateToCustomer(String(linkedCustomer.id))
      : undefined,
  } : null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex w-full flex-col overflow-hidden lg:max-w-md xl:max-w-lg">
        <div className="space-y-3 border-b border-black/5 bg-white px-4 py-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or business…"
            className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-2.5 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400" />
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            <button onClick={() => setFilter("all")}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === "all" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              All ({counts.all})
            </button>
            {ALL_LEAD_STATUSES.map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === s ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                {LEAD_STATUS[s].label} ({counts[s]})
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-40 items-center justify-center text-sm text-slate-400">Loading…</div>
          ) : displayed.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-slate-400">{search ? "No results." : "No leads yet."}</div>
          ) : displayed.map((lead) => (
            <button key={lead.id} onClick={() => openLead(lead)}
              className={`w-full border-b border-black/5 px-5 py-4 text-left transition hover:bg-white ${selected?.id === lead.id ? "bg-white" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{lead.name}</p>
                  {lead.business && <p className="truncate text-xs text-slate-500">{lead.business}</p>}
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${LEAD_STATUS[lead.status].pill}`}>
                  {LEAD_STATUS[lead.status].label}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                {lead.type && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    {lead.type}
                  </span>
                )}
                {lead.need && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                    {lead.need}
                  </span>
                )}
                {leadIdSet.has(lead.id) && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Customer ✓
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <span className="truncate">{lead.email}</span>
                <span>·</span>
                <span className="shrink-0">{fmt(lead.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {detailProps ? (
        <div className="hidden flex-1 overflow-y-auto border-l border-black/5 bg-white p-7 lg:block">
          <LeadDetail {...detailProps} />
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center border-l border-black/5 text-sm text-slate-400 lg:flex">
          Select a lead to view details
        </div>
      )}

      {detailProps && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => onSelectLead(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-[2rem] bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />
            <LeadDetail {...detailProps} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Customer detail ──────────────────────────────────────────

function CustomerDetail({
  customer, jobs, quotes, invoices, leads, onNavigate,
  onClose, onUpdateNotes, onUpdatePhone, onAddJob, onUpdateJobStatus, onAddQuote, onUpdateQuoteStatus,
  onAddInvoice, onUpdateInvoiceStatus, onConvertQuoteToInvoice, onDeleteCustomer, onNavigateToLead,
}: {
  customer: Customer; jobs: Job[]; quotes: Quote[]; invoices: Invoice[]; leads: Lead[];
  onClose: () => void;
  onNavigate: (s: Section) => void;
  onUpdateNotes: (id: string, notes: string) => Promise<void>;
  onAddJob: (cid: string, title: string, date: string, notes: string) => Promise<void>;
  onUpdateJobStatus: (id: number, status: JobStatus) => void;
  onAddQuote: (cid: string, title: string, items: LineItem[]) => Promise<void>;
  onUpdateQuoteStatus: (id: string, status: QuoteStatus) => void;
  onAddInvoice: (cid: string, title: string, items: LineItem[], dueDate: string, quoteId?: string) => Promise<void>;
  onUpdateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  onConvertQuoteToInvoice: (quote: Quote) => Promise<void>;
  onDeleteCustomer: (id: string) => void;
  onUpdatePhone: (id: string, phone: string | null) => Promise<void>;
  onNavigateToLead?: (id: number) => void;
}) {
  const [notes, setNotes]               = useState(customer.notes ?? "");
  const [saving, setSaving]             = useState(false);
  const [showJobForm, setShowJobForm]   = useState(false);
  const [showQuoteForm, setShowQuoteForm]     = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [jobTitle, setJobTitle]   = useState("");
  const [jobDate, setJobDate]     = useState("");
  const [jobNotes, setJobNotes]   = useState("");
  const [quoteTitle, setQuoteTitle]   = useState("");
  const [quoteType, setQuoteType]     = useState<"website" | "service">("service");
  const [lineItems, setLineItems]     = useState<LineItem[]>([{ description: "", qty: 1, price: 0 }]);
  const [invTitle, setInvTitle]       = useState("");
  const [invDueDate, setInvDueDate]   = useState("");
  const [invDateError, setInvDateError] = useState("");
  const [invLineItems, setInvLineItems] = useState<LineItem[]>([{ description: "", qty: 1, price: 0 }]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [profiles, setProfiles]           = useState<BusinessProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [editPhone, setEditPhone]         = useState(customer.phone ?? "");
  const [phoneError, setPhoneError]       = useState("");
  const [savingPhone, setSavingPhone]     = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await getAllProfiles();
      setProfiles(loaded);
      setProfilesLoading(false);
    })();
  }, []);

  useEffect(() => {
    setEditPhone(customer.phone ?? "");
    setPhoneError("");
  }, [customer.id]);

  const today          = new Date().toISOString().split("T")[0];
  const defaultDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Originating lead context
  const linkedLead  = leads.find((l) => l.id === customer.lead_id) ?? null;
  const bizType     = linkedLead?.type ?? null;

  // Linked business profile (soft-link via localStorage)
  const linkedProfile = profiles.find((p) => p.customer_id === String(customer.id)) ?? null;

  // Customer type signals (derived, no extra DB column needed)
  const isWebsiteClient   = !!linkedProfile || (linkedLead?.need?.toLowerCase().includes("website") ?? false);
  const isServiceCustomer = !isWebsiteClient || jobs.some((j) => j.customer_id === customer.id);

  const custJobs     = jobs.filter((j) => j.customer_id === customer.id);
  const custQuotes   = quotes.filter((q) => q.customer_id === customer.id);
  const custInvoices = invoices.filter((inv) => inv.customer_id === customer.id);
  const quoteTotal   = lineItems.reduce((sum, li) => sum + li.qty * li.price, 0);
  const invTotal     = invLineItems.reduce((sum, li) => sum + li.qty * li.price, 0);

  // Smart suggestions (rule-based, no API)
  const suggestions: string[] = [];
  if (!linkedProfile && isWebsiteClient)
    suggestions.push("No website profile yet — create one to generate a site preview.");
  if (custQuotes.length === 0)
    suggestions.push("No quotes yet. Add a quote to start the proposal flow.");
  const acceptedNoJob = custQuotes.find((q) => q.status === "accepted" && custJobs.length === 0);
  if (acceptedNoJob)
    suggestions.push(`Quote "${acceptedNoJob.title}" accepted — create a job to track the work.`);
  if (custJobs.some((j) => j.status === "complete") && custInvoices.length === 0)
    suggestions.push("Job complete but no invoice yet — create an invoice to close it out.");
  if (custInvoices.some((i) => i.status === "overdue"))
    suggestions.push("An invoice is overdue. Follow up with the client.");
  if (custInvoices.some((i) => i.total === 0))
    suggestions.push("Invoice with $0 total — confirm pricing was entered.");

  // Quote pre-fill templates
  const defaultQuoteTitle = bizType
    ? `${customer.business || customer.name} — ${bizType} Quote`
    : `${customer.business || customer.name} — Quote`;

  const websiteLineItems: LineItem[] = [
    { description: "Website setup & build",          qty: 1, price: 0 },
    { description: "Business profile configuration", qty: 1, price: 0 },
    { description: "Demo / customization package",   qty: 1, price: 0 },
    { description: "Monthly support (placeholder)",  qty: 1, price: 0 },
  ];
  const serviceLineItems: LineItem[] = [
    { description: bizType ? `${bizType} service` : "Service", qty: 1, price: 0 },
    { description: "Labor",              qty: 1, price: 0 },
    { description: "Materials / supplies", qty: 1, price: 0 },
  ];

  // ── Handlers ───────────────────────────────────────────────

  async function handleSaveNotes() {
    setSaving(true);
    await onUpdateNotes(customer.id, notes);
    setSaving(false);
  }

  async function handleSavePhone() {
    const digits = digitsOnly(editPhone.trim());
    if (editPhone.trim() && digits.length !== 10) {
      setPhoneError("Please enter a full 10-digit US phone number, or leave blank.");
      return;
    }
    setPhoneError("");
    setSavingPhone(true);
    await onUpdatePhone(customer.id, editPhone.trim() || null);
    setSavingPhone(false);
  }

  function openJobForm(fromQuote?: Quote) {
    setJobTitle(fromQuote ? fromQuote.title : `${customer.business || customer.name} — Service`);
    setJobNotes(fromQuote ? `From quote: ${fromQuote.title}` : "");
    setJobDate("");
    setShowJobForm(true);
    setShowQuoteForm(false);
    setShowInvoiceForm(false);
  }

  function openQuoteForm() {
    const defaultType = isWebsiteClient ? "website" : "service";
    setQuoteType(defaultType);
    setQuoteTitle(defaultQuoteTitle);
    setLineItems(defaultType === "website" ? [...websiteLineItems] : [...serviceLineItems]);
    setShowQuoteForm(true);
    setShowJobForm(false);
    setShowInvoiceForm(false);
  }

  function openInvoiceForm() {
    setInvTitle(`Invoice — ${customer.business || customer.name}`);
    setInvDueDate(defaultDueDate);
    const lastAccepted = custQuotes.find((q) => q.status === "accepted");
    setInvLineItems(lastAccepted ? [...lastAccepted.line_items] : [{ description: "", qty: 1, price: 0 }]);
    setShowInvoiceForm(true);
    setShowJobForm(false);
    setShowQuoteForm(false);
  }

  async function handleAddJob() {
    if (!jobTitle.trim()) return;
    setSubmitting(true);
    await onAddJob(customer.id, jobTitle.trim(), jobDate, jobNotes.trim());
    setJobTitle(""); setJobDate(""); setJobNotes(""); setShowJobForm(false);
    setSubmitting(false);
  }

  async function handleAddQuote() {
    if (!quoteTitle.trim() || lineItems.every((li) => !li.description.trim())) return;
    setSubmitting(true);
    await onAddQuote(customer.id, quoteTitle.trim(), lineItems.filter((li) => li.description.trim()));
    setQuoteTitle(""); setLineItems([{ description: "", qty: 1, price: 0 }]); setShowQuoteForm(false);
    setSubmitting(false);
  }

  async function handleAddInvoice() {
    if (!invTitle.trim() || invLineItems.every((li) => !li.description.trim())) return;
    if (invDueDate && invDueDate < today) { setInvDateError("Due date cannot be in the past."); return; }
    setInvDateError("");
    setSubmitting(true);
    await onAddInvoice(customer.id, invTitle.trim(), invLineItems.filter((li) => li.description.trim()), invDueDate);
    setInvTitle(""); setInvDueDate(""); setInvLineItems([{ description: "", qty: 1, price: 0 }]); setShowInvoiceForm(false);
    setSubmitting(false);
  }

  function handleCreateWebsiteProfile() {
    createWebsiteProfileDraft({
      customer_id: customer.id,
      businessName: customer.business || customer.name,
      industry: bizType || "",
      phone: customer.phone || "",
      email: customer.email || "",
      city: "",
      businessDescription: linkedLead?.message || "",
      websiteGoals: linkedLead?.need || "",
    });
    onNavigate("websites");
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-slate-950">{customer.name}</h2>
          {customer.business && <p className="mt-0.5 text-sm text-slate-500">{customer.business}</p>}
          <p className="mt-0.5 text-xs text-slate-400">Customer #{customer.id}</p>
        </div>
        <button onClick={onClose} className="shrink-0 rounded-full border border-black/10 px-3 py-1 text-xs text-slate-500 transition hover:border-slate-400">Close</button>
      </div>

      {/* Type badges */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {isWebsiteClient   && <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">Website Client</span>}
        {isServiceCustomer && <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">Service Customer</span>}
        {bizType           && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{bizType}</span>}
        {linkedLead?.need  && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{linkedLead.need}</span>}
      </div>

      {/* Source lead link */}
      {linkedLead && onNavigateToLead && (
        <div className="mt-2">
          <button onClick={() => onNavigateToLead(linkedLead.id)}
            className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-950">
            Source lead: {linkedLead.name} ↗
          </button>
        </div>
      )}

      {/* Contact info */}
      <div className="mt-4 grid gap-3 rounded-[1.5rem] border border-black/5 bg-[#f7f5ef] p-5 text-sm sm:grid-cols-2">
        {[
          { label: "Email",          value: customer.email },
          { label: "Address",        value: customer.address },
          { label: "Customer since", value: fmt(customer.created_at) },
        ].map(({ label, value }) => value && (
          <div key={label}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
            <p className="mt-1 text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Phone — editable contact phone */}
      <div className="mt-3 rounded-[1.5rem] border border-black/5 bg-[#f7f5ef] px-5 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Phone (contact)</p>
        <div className="flex gap-2">
          <input
            type="tel"
            value={editPhone}
            onChange={(e) => { setEditPhone(formatPhoneInput(e.target.value)); setPhoneError(""); }}
            placeholder="(555) 123-4567"
            className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400"
          />
          <button onClick={handleSavePhone} disabled={savingPhone}
            className="shrink-0 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
            {savingPhone ? "Saving…" : "Save"}
          </button>
        </div>
        {phoneError && <p className="mt-1.5 text-xs text-red-600">{phoneError}</p>}
      </div>

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-4 rounded-[1.5rem] border border-amber-100 bg-amber-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-700">Next steps</p>
          <ul className="space-y-1.5">
            {suggestions.map((s) => (
              <li key={s} className="flex items-start gap-2 text-xs text-amber-900">
                <span className="mt-0.5 shrink-0 text-amber-500">→</span>{s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Website Profile */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Website Profile</p>
          {!linkedProfile && (
            <button onClick={handleCreateWebsiteProfile}
              className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700">
              + Create Website Profile
            </button>
          )}
        </div>
        {linkedProfile ? (
          <div className="rounded-xl border border-black/5 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-950">{linkedProfile.businessName}</p>
                {linkedProfile.industry && <p className="text-xs text-slate-500">{linkedProfile.industry}</p>}
              </div>
              <div className="flex shrink-0 gap-1.5">
                <a href={`/website-preview/${linkedProfile.id}`} target="_blank" rel="noopener noreferrer"
                  className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800">
                  Preview ↗
                </a>
                <button onClick={() => { createWebsiteProfilePendingEdit(linkedProfile.id); onNavigate("websites"); }}
                  className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ) : profilesLoading ? (
          <p className="rounded-xl border border-dashed border-black/10 p-3 text-center text-xs text-slate-400">
            Loading…
          </p>
        ) : (
          <p className="rounded-xl border border-dashed border-black/10 p-3 text-center text-xs text-slate-400">
            No website profile yet.{bizType ? ` Will pre-fill: ${bizType}.` : ""}
          </p>
        )}
      </div>

      {/* Quotes */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Quotes ({custQuotes.length})</p>
          <button onClick={() => showQuoteForm ? setShowQuoteForm(false) : openQuoteForm()}
            className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400">
            {showQuoteForm ? "Cancel" : "+ New quote"}
          </button>
        </div>

        {showQuoteForm && (
          <div className="mb-4 space-y-3 rounded-[1.5rem] border border-black/10 bg-[#f7f5ef] p-4">
            <div className="flex gap-2">
              {(["website", "service"] as const).map((t) => (
                <button key={t} type="button"
                  onClick={() => { setQuoteType(t); setLineItems(t === "website" ? [...websiteLineItems] : [...serviceLineItems]); }}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${
                    quoteType === t ? "bg-slate-950 text-white" : "border border-black/10 bg-white text-slate-500 hover:border-slate-400"
                  }`}>
                  {t === "website" ? "Website Build" : "Service Quote"}
                </button>
              ))}
            </div>
            <input id="quote-title" name="quote-title" value={quoteTitle} onChange={(e) => setQuoteTitle(e.target.value)} placeholder="Quote title *"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400" />
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Line items</p>
              {lineItems.map((li, i) => (
                <div key={i} className="flex gap-2">
                  <input value={li.description} placeholder="Description" name={`li-desc-${i}`}
                    onChange={(e) => setLineItems((prev) => prev.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
                    className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" />
                  <input type="number" value={li.qty} min={1} name={`li-qty-${i}`}
                    onChange={(e) => setLineItems((prev) => prev.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))}
                    className="w-14 rounded-xl border border-black/10 bg-white px-2 py-2 text-center text-sm outline-none focus:border-slate-400" />
                  <input type="number" value={li.price} min={0} step={0.01} placeholder="$" name={`li-price-${i}`}
                    onChange={(e) => setLineItems((prev) => prev.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x))}
                    className="w-24 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" />
                  {lineItems.length > 1 && (
                    <button onClick={() => setLineItems((prev) => prev.filter((_, j) => j !== i))}
                      className="px-1 text-slate-400 hover:text-rose-500">×</button>
                  )}
                </div>
              ))}
              <button onClick={() => setLineItems((prev) => [...prev, { description: "", qty: 1, price: 0 }])}
                className="text-xs font-medium text-slate-500 hover:text-slate-950">+ Add line</button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-2.5">
              <span className="text-sm font-semibold text-slate-950">Total</span>
              <span className="text-sm font-bold text-slate-950">{usd(quoteTotal)}</span>
            </div>
            <p className="text-[10px] text-slate-400">Prices start at $0 — enter actual amounts before sending.</p>
            <button onClick={handleAddQuote} disabled={submitting || !quoteTitle.trim()}
              className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">
              {submitting ? "Saving…" : "Save quote"}
            </button>
          </div>
        )}

        {custQuotes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/10 p-4 text-center text-xs text-slate-400">No quotes yet.</p>
        ) : (
          <div className="space-y-2">
            {custQuotes.map((q) => (
              <div key={q.id} className="rounded-xl border border-black/5 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-950">{q.title}</p>
                    <p className="text-xs text-slate-400">{q.line_items.length} item{q.line_items.length !== 1 ? "s" : ""} · {usd(q.total)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={q.status} onChange={(e) => onUpdateQuoteStatus(q.id, e.target.value as QuoteStatus)}
                      className={`shrink-0 cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${QUOTE_STATUS[q.status].pill}`}>
                      {ALL_QUOTE_STATUSES.map((s) => <option key={s} value={s}>{QUOTE_STATUS[s].label}</option>)}
                    </select>
                    {q.status === "accepted" && (
                      <>
                        <button onClick={() => onConvertQuoteToInvoice(q)}
                          className="rounded-full border border-black/10 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                          title="Convert to invoice">
                          → Invoice
                        </button>
                        <button onClick={() => openJobForm(q)}
                          className="rounded-full border border-black/10 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700"
                          title="Create job from this quote">
                          → Job
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Jobs */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Jobs ({custJobs.length})</p>
          <button onClick={() => showJobForm ? setShowJobForm(false) : openJobForm()}
            className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400">
            {showJobForm ? "Cancel" : "+ New job"}
          </button>
        </div>

        {showJobForm && (
          <div className="mb-4 space-y-3 rounded-[1.5rem] border border-black/10 bg-[#f7f5ef] p-4">
            <input id="job-title" name="job-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Job title *"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400" />
            <input id="job-date" name="job-date" type="date" value={jobDate} onChange={(e) => setJobDate(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400" />
            <textarea id="job-notes" name="job-notes" value={jobNotes} onChange={(e) => setJobNotes(e.target.value)} rows={2} placeholder="Notes…"
              className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm placeholder-slate-400 outline-none focus:border-slate-400" />
            <button onClick={handleAddJob} disabled={submitting || !jobTitle.trim()}
              className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">
              {submitting ? "Adding…" : "Add job"}
            </button>
          </div>
        )}

        {custJobs.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/10 p-4 text-center text-xs text-slate-400">No jobs yet.</p>
        ) : (
          <div className="space-y-2">
            {custJobs.map((job) => (
              <div key={job.id} className="rounded-xl border border-black/5 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-950">{job.title}</p>
                    {job.scheduled_date && <p className="text-xs text-slate-400">{fmtDate(job.scheduled_date)}</p>}
                    {job.notes && <p className="mt-1 text-xs text-slate-500">{job.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={job.status} onChange={(e) => onUpdateJobStatus(job.id, e.target.value as JobStatus)}
                      className={`shrink-0 cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${JOB_STATUS[job.status].pill}`}>
                      {ALL_JOB_STATUSES.map((s) => <option key={s} value={s}>{JOB_STATUS[s].label}</option>)}
                    </select>
                    {job.status === "complete" && customer.email && (
                      <a href={`mailto:${customer.email}?subject=${encodeURIComponent("Quick favor — can you leave us a review?")}&body=${encodeURIComponent(`Hi ${customer.name},\n\nThank you for trusting us with "${job.title}" — it was a pleasure working with you.\n\nIf you had a great experience, a quick Google review would mean a lot to us. It only takes 30 seconds and helps other local families find us:\n\n[Paste your Google review link here]\n\nThank you!\nMain App`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="shrink-0 rounded-full border border-black/10 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                        title="Send review request email">
                        ★ Review
                      </a>
                    )}
                    {job.status === "complete" && (
                      <button onClick={openInvoiceForm}
                        className="shrink-0 rounded-full border border-black/10 px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                        title="Create invoice from this job">
                        → Invoice
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="mt-6 border-t border-black/5 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-950">Invoices</p>
          <button onClick={() => showInvoiceForm ? setShowInvoiceForm(false) : openInvoiceForm()}
            className="rounded-full bg-slate-950 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800">
            {showInvoiceForm ? "Cancel" : "+ New"}
          </button>
        </div>

        {showInvoiceForm && (
          <div className="mb-4 space-y-3 rounded-[1.5rem] border border-black/10 bg-[#f7f5ef] p-4">
            <input id="inv-title" name="inv-title" value={invTitle} onChange={(e) => setInvTitle(e.target.value)} placeholder="Invoice title *"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400" />
            <div>
              <label htmlFor="inv-due-date" className="mb-1 block text-xs font-medium text-slate-500">Due date (default: 7 days)</label>
              <input id="inv-due-date" name="inv-due-date" type="date" value={invDueDate} min={today}
                onChange={(e) => { setInvDueDate(e.target.value); setInvDateError(""); }}
                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400 ${invDateError ? "border-rose-300" : "border-black/10"}`} />
              {invDateError && <p className="mt-1 text-xs text-rose-600">{invDateError}</p>}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Line items</p>
              {invLineItems.map((li, i) => (
                <div key={i} className="flex gap-2">
                  <input value={li.description} placeholder="Description" name={`inv-desc-${i}`}
                    onChange={(e) => setInvLineItems((prev) => prev.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
                    className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" />
                  <input type="number" value={li.qty} min={1} name={`inv-qty-${i}`}
                    onChange={(e) => setInvLineItems((prev) => prev.map((x, j) => j === i ? { ...x, qty: Number(e.target.value) } : x))}
                    className="w-14 rounded-xl border border-black/10 bg-white px-2 py-2 text-center text-sm outline-none focus:border-slate-400" />
                  <input type="number" value={li.price} min={0} step={0.01} placeholder="$" name={`inv-price-${i}`}
                    onChange={(e) => setInvLineItems((prev) => prev.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x))}
                    className="w-24 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" />
                  {invLineItems.length > 1 && (
                    <button onClick={() => setInvLineItems((prev) => prev.filter((_, j) => j !== i))}
                      className="px-1 text-slate-400 hover:text-rose-500">×</button>
                  )}
                </div>
              ))}
              <button onClick={() => setInvLineItems((prev) => [...prev, { description: "", qty: 1, price: 0 }])}
                className="text-xs font-medium text-slate-500 hover:text-slate-950">+ Add line</button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-2.5">
              <span className="text-sm font-semibold text-slate-950">Total</span>
              <span className="text-sm font-bold text-slate-950">{usd(invTotal)}</span>
            </div>
            <button onClick={handleAddInvoice} disabled={submitting || !invTitle.trim()}
              className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">
              {submitting ? "Saving…" : "Save invoice"}
            </button>
          </div>
        )}

        {custInvoices.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/10 p-4 text-center text-xs text-slate-400">No invoices yet. Create one or convert an accepted quote.</p>
        ) : (
          <div className="space-y-2">
            {custInvoices.map((inv) => (
              <div key={inv.id} className="rounded-xl border border-black/5 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-950">{inv.invoice_number} · {inv.title}</p>
                    <p className="text-xs text-slate-400">
                      {inv.line_items.length} item{inv.line_items.length !== 1 ? "s" : ""} · {usd(inv.total)}
                      {inv.due_date && ` · Due ${fmtDate(inv.due_date)}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <select value={inv.status} onChange={(e) => onUpdateInvoiceStatus(inv.id, e.target.value as InvoiceStatus)}
                      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${INVOICE_STATUS[inv.status].pill}`}>
                      {ALL_INVOICE_STATUSES.map((s) => <option key={s} value={s}>{INVOICE_STATUS[s].label}</option>)}
                    </select>
                    <a href={`/admin/invoice/${inv.id}`} target="_blank" rel="noopener noreferrer"
                      className="rounded-full border border-black/10 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-slate-400">
                      View ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes — above delete */}
      <div className="mt-6 border-t border-black/5 pt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Notes</p>
        <textarea id="customer-notes" name="customer-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Customer notes…"
          className="w-full resize-none rounded-[1.5rem] border border-black/10 bg-[#f7f5ef] px-5 py-4 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400" />
        <button onClick={handleSaveNotes} disabled={saving}
          className="mt-2 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
          {saving ? "Saving…" : "Save notes"}
        </button>
      </div>

      {/* Delete — always last */}
      <div className="mt-6 border-t border-black/5 pt-5">
        {confirmDelete ? (
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-600">Delete customer and all their jobs/quotes?</p>
            <button onClick={() => onDeleteCustomer(customer.id)}
              className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700">Delete</button>
            <button onClick={() => setConfirmDelete(false)}
              className="rounded-full border border-black/10 px-4 py-1.5 text-xs text-slate-600 transition hover:border-slate-400">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="text-xs text-rose-500 transition hover:text-rose-700">Delete customer</button>
        )}
      </div>
    </>
  );
}

// ─── Customers section ────────────────────────────────────────

function CustomersSection({
  customers, jobs, quotes, invoices, leads, loading,
  onUpdateNotes, onUpdatePhone, onAddJob, onUpdateJobStatus, onAddQuote, onUpdateQuoteStatus,
  onAddInvoice, onUpdateInvoiceStatus, onConvertQuoteToInvoice, onDeleteCustomer,
  onAddDirectCustomer, onNavigate, selectedCustomerId, onSelectCustomer, onNavigateToLead,
}: {
  customers: Customer[]; jobs: Job[]; quotes: Quote[]; invoices: Invoice[]; leads: Lead[]; loading: boolean;
  onUpdateNotes: (id: string, notes: string) => Promise<void>;
  onAddJob: (cid: string, title: string, date: string, notes: string) => Promise<void>;
  onUpdateJobStatus: (id: number, status: JobStatus) => void;
  onAddQuote: (cid: string, title: string, items: LineItem[]) => Promise<void>;
  onUpdateQuoteStatus: (id: string, status: QuoteStatus) => void;
  onAddInvoice: (cid: string, title: string, items: LineItem[], dueDate: string, quoteId?: string) => Promise<void>;
  onUpdateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  onConvertQuoteToInvoice: (quote: Quote) => Promise<void>;
  onDeleteCustomer: (id: string) => void;
  onUpdatePhone: (id: string, phone: string | null) => Promise<void>;
  onAddDirectCustomer: (name: string, email: string, phone: string, business: string) => Promise<Customer | null>;
  onNavigate: (s: Section) => void;
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string | null) => void;
  onNavigateToLead?: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const selected = customers.find((c) => String(c.id) === String(selectedCustomerId ?? "")) ?? null;
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addBusiness, setAddBusiness] = useState("");
  const [addSaving, setAddSaving] = useState(false);

  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!addName.trim()) return;
    setAddSaving(true);
    const c = await onAddDirectCustomer(addName.trim(), addEmail.trim(), addPhone.trim(), addBusiness.trim());
    setAddSaving(false);
    if (c) {
      onSelectCustomer(c.id);
      setShowAdd(false);
      setAddName(""); setAddEmail(""); setAddPhone(""); setAddBusiness("");
    }
  }

  const displayed = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.email ?? "").toLowerCase().includes(q) || (c.business ?? "").toLowerCase().includes(q);
  });

  const detailProps = selected ? {
    customer: selected, jobs, quotes, invoices, leads,
    onClose: () => onSelectCustomer(null),
    onNavigate,
    onUpdateNotes, onUpdatePhone, onAddJob, onUpdateJobStatus, onAddQuote, onUpdateQuoteStatus,
    onAddInvoice, onUpdateInvoiceStatus, onConvertQuoteToInvoice,
    onDeleteCustomer: (id: string) => { onDeleteCustomer(id); onSelectCustomer(null); },
    onNavigateToLead,
  } : null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex w-full flex-col overflow-hidden lg:max-w-md xl:max-w-lg">
        <div className="space-y-2 border-b border-black/5 bg-white px-4 py-3">
          <div className="flex gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers…"
              className="min-w-0 flex-1 rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-2.5 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400" />
            <button onClick={() => setShowAdd((v) => !v)}
              className="shrink-0 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              + New
            </button>
          </div>
          {showAdd && (
            <form onSubmit={handleAddSubmit} className="rounded-xl border border-black/5 bg-[#f7f5ef] p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">New customer</p>
              <input required value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="Full name *"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" />
              <input value={addEmail} onChange={(e) => setAddEmail(e.target.value)} placeholder="Email"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" />
              <input value={addPhone} onChange={(e) => setAddPhone(formatPhoneInput(e.target.value))} placeholder="(555) 123-4567" type="tel"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" />
              <input value={addBusiness} onChange={(e) => setAddBusiness(e.target.value)} placeholder="Business (optional)"
                className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400" />
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={addSaving || !addName.trim()}
                  className="flex-1 rounded-full bg-slate-950 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50">
                  {addSaving ? "Saving…" : "Create customer"}
                </button>
                <button type="button" onClick={() => setShowAdd(false)}
                  className="rounded-full border border-black/10 px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-white">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-40 items-center justify-center text-sm text-slate-400">Loading…</div>
          ) : displayed.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 px-6 text-center text-sm text-slate-400">
              {search ? "No results." : <><span>No customers yet.</span><button onClick={() => setShowAdd(true)} className="text-slate-950 font-semibold underline underline-offset-2">Add your first customer →</button></>}
            </div>
          ) : displayed.map((c) => {
            const activeJobs = jobs.filter((j) => j.customer_id === c.id && (j.status === "in_progress" || j.status === "scheduled")).length;
            return (
              <button key={c.id} onClick={() => onSelectCustomer(c.id)}
                className={`w-full border-b border-black/5 px-5 py-4 text-left transition hover:bg-white ${selected?.id === c.id ? "bg-white" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{c.name}</p>
                    {c.business && <p className="truncate text-xs text-slate-500">{c.business}</p>}
                  </div>
                  {activeJobs > 0 && (
                    <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800">
                      {activeJobs} job{activeJobs !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-slate-400">{c.email ?? (c.phone ? formatPhone(c.phone) : null) ?? "No contact info"}</p>
              </button>
            );
          })}
        </div>
      </div>

      {detailProps ? (
        <div className="hidden flex-1 overflow-y-auto border-l border-black/5 bg-white p-7 lg:block">
          <CustomerDetail {...detailProps} />
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center border-l border-black/5 text-sm text-slate-400 lg:flex">
          Select a customer to view details
        </div>
      )}

      {detailProps && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => onSelectCustomer(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-0 left-0 right-0 max-h-[92vh] overflow-y-auto rounded-t-[2rem] bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />
            <CustomerDetail {...detailProps} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Canvass ──────────────────────────────────────────────────

function CanvassSection() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-black/5 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-950">Door Knocking</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Click anywhere on the map to drop a canvassing pin. Track every door in real time.
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <CanvassMapComponent />
      </div>
    </div>
  );
}

// ─── Map Hub ──────────────────────────────────────────────────

type MapMode = "leads" | "canvass";

const MAP_MODES: { id: MapMode; label: string; desc: string }[] = [
  { id: "leads",   label: "Lead Map",   desc: "Where your leads are coming from" },
  { id: "canvass", label: "Canvassing", desc: "Door-knocking pins and tracking"  },
];

const MAP_FUTURE = [
  { label: "Job Map",       desc: "Active job locations and crew positions" },
  { label: "Service Area",  desc: "Define and visualize your service territory" },
  { label: "Lead Scout",    desc: "Find businesses that need help in your area" },
];

function MapHubSection({ leads }: { leads: Lead[] }) {
  const [mode, setMode] = useState<MapMode>("leads");

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Hub header */}
      <div className="shrink-0 border-b border-black/5 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-950">Map Hub</h1>
        <p className="mt-0.5 text-sm text-slate-500">Spatial tools for leads, canvassing, and field operations.</p>

        {/* Mode tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {MAP_MODES.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                mode === m.id
                  ? "bg-slate-950 text-white"
                  : "border border-black/10 bg-[#f7f5ef] text-slate-600 hover:border-slate-400"
              }`}>
              {m.label}
            </button>
          ))}
          {MAP_FUTURE.map((m) => (
            <span key={m.label}
              className="rounded-full border border-dashed border-black/10 px-4 py-2 text-xs font-medium text-slate-300"
              title={m.desc}>
              {m.label} <span className="text-[10px]">· soon</span>
            </span>
          ))}
        </div>
      </div>

      {/* Active mode */}
      <div className="flex-1 overflow-hidden">
        {mode === "leads"   && <MapSection leads={leads} />}
        {mode === "canvass" && <CanvassSection />}
      </div>
    </div>
  );
}

// ─── Map ──────────────────────────────────────────────────────

function MapSection({ leads }: { leads: Lead[] }) {
  const mapped = leads.filter((l) => l.lat != null && l.lng != null);
  const total  = leads.length;

  const cityCounts = mapped.reduce<Record<string, number>>((acc, l) => {
    const key = l.city ?? "Unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const topCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-black/5 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-950">Lead Map</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          {mapped.length} of {total} lead{total !== 1 ? "s" : ""} with location data
        </p>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Map panel */}
        <div className="flex-1 overflow-hidden">
          {mapped.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 border border-dashed border-black/10 text-center">
              <p className="text-2xl">📍</p>
              <p className="text-sm font-medium text-slate-600">No location data yet</p>
              <p className="max-w-xs text-xs text-slate-400">
                When leads submit the contact form with a city, pins will appear here. Ask leads to fill in their city to see geographic distribution.
              </p>
            </div>
          ) : (
            <div className="h-full overflow-hidden">
              <LeadMapComponent leads={leads} />
            </div>
          )}
        </div>

        {/* Sidebar stats */}
        <div className="hidden w-64 shrink-0 flex-col gap-4 overflow-y-auto border-l border-black/5 p-4 lg:flex">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">With location</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{mapped.length}</p>
            <p className="mt-0.5 text-xs text-slate-500">of {total} total leads</p>
          </div>
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Cities</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{Object.keys(cityCounts).length}</p>
          </div>
          {topCities.length > 0 && (
            <div className="rounded-[1.5rem] border border-black/5 bg-white p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Top areas</p>
              <div className="space-y-2">
                {topCities.map(([city, count]) => (
                  <div key={city} className="flex items-center justify-between">
                    <span className="text-xs text-slate-700">{city}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-[1.5rem] border border-dashed border-black/10 p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-600">Coming soon</p>
            <p className="mt-1">Territory heat maps, ZIP-level density, and competitor cluster detection for door-knocking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────

function SettingsSection({ email }: { email: string }) {
  const supabase = createClient();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handlePasswordReset() {
    if (!email) return;
    setSending(true);
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/admin` });
    setSent(true);
    setSending(false);
  }

  return (
    <div className="w-full h-full overflow-y-auto p-6 lg:p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-950">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account</p>
      </div>
      <div className="max-w-lg space-y-5">
        <div className="rounded-[1.5rem] border border-black/5 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-950">Account</h2>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Email address</p>
            <p className="mt-1 text-sm text-slate-800">{email || "—"}</p>
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-black/5 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-950">Password</h2>
          <p className="mt-2 text-sm text-slate-500">We&apos;ll send a reset link to your email address.</p>
          {sent ? (
            <p className="mt-4 text-sm font-medium text-emerald-700">Reset link sent — check your inbox.</p>
          ) : (
            <button onClick={handlePasswordReset} disabled={sending || !email}
              className="mt-4 rounded-full border border-black/10 bg-[#f7f5ef] px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-400 disabled:opacity-60">
              {sending ? "Sending…" : "Send reset link"}
            </button>
          )}
        </div>
        <div className="rounded-[1.5rem] border border-black/5 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-950">Public site</h2>
          <p className="mt-2 text-sm text-slate-500">View the public-facing sales site.</p>
          <a href="/" target="_blank"
            className="mt-4 inline-block rounded-full border border-black/10 bg-[#f7f5ef] px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-400">
            Open site →
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Invoices section ─────────────────────────────────────────

function InvoicesSection({
  invoices, customers, loading,
  onUpdateStatus,
}: {
  invoices: Invoice[]; customers: Customer[]; loading: boolean;
  onUpdateStatus: (id: string, status: InvoiceStatus) => void;
}) {
  const [filter, setFilter] = useState<InvoiceStatus | "all">("all");
  const [search, setSearch] = useState("");

  const customerMap = Object.fromEntries(customers.map((c) => [c.id, c]));

  const displayed = invoices
    .filter((inv) => filter === "all" || inv.status === filter)
    .filter((inv) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const cust = customerMap[inv.customer_id];
      return (
        inv.invoice_number.toLowerCase().includes(q) ||
        inv.title.toLowerCase().includes(q) ||
        (cust?.name ?? "").toLowerCase().includes(q)
      );
    });

  const counts: Record<string, number> = {
    all: invoices.length,
    ...Object.fromEntries(ALL_INVOICE_STATUSES.map((s) => [s, invoices.filter((i) => i.status === s).length])),
  };

  const paidTotal    = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const outstanding  = invoices.filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + i.total, 0);
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-black/5 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-950">Invoices</h1>
        <p className="mt-0.5 text-sm text-slate-500">{invoices.length} total · {usd(paidTotal)} collected · {usd(outstanding)} outstanding</p>
      </div>

      {overdueCount > 0 && (
        <div className="border-b border-rose-200 bg-rose-50 px-6 py-3">
          <p className="text-sm font-semibold text-rose-700">
            {overdueCount} overdue invoice{overdueCount !== 1 ? "s" : ""} — follow up soon to collect {usd(outstanding)}.
          </p>
        </div>
      )}

      <div className="space-y-2 border-b border-black/5 bg-white px-4 py-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by invoice #, title, or customer…"
          className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-2.5 text-sm text-slate-950 placeholder-slate-400 outline-none transition focus:border-slate-400" />
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          <button onClick={() => setFilter("all")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === "all" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            All ({counts.all})
          </button>
          {ALL_INVOICE_STATUSES.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === s ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              {INVOICE_STATUS[s].label} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-40 items-center justify-center text-sm text-slate-400">Loading…</div>
        ) : displayed.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-slate-400">{search ? "No results." : "No invoices yet."}</div>
        ) : (
          <div className="divide-y divide-black/5">
            {displayed.map((inv) => {
              const cust = customerMap[inv.customer_id];
              return (
                <div key={inv.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-white">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-950">{inv.invoice_number}</p>
                      <p className="truncate text-sm text-slate-600">{inv.title}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {cust?.name ?? "Unknown customer"}
                      {inv.due_date ? ` · Due ${fmtDate(inv.due_date)}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-slate-950">{usd(inv.total)}</span>
                    <select value={inv.status} onChange={(e) => onUpdateStatus(inv.id, e.target.value as InvoiceStatus)}
                      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${INVOICE_STATUS[inv.status].pill}`}>
                      {ALL_INVOICE_STATUSES.map((s) => <option key={s} value={s}>{INVOICE_STATUS[s].label}</option>)}
                    </select>
                    <a href={`/admin/invoice/${inv.id}`} target="_blank" rel="noopener noreferrer"
                      className="rounded-full border border-black/10 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400">
                      View ↗
                    </a>
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

// ─── ContractVault section ────────────────────────────────────

function ContractVaultSection() {
  const features = [
    { icon: "✍️", title: "Send & sign agreements", desc: "Service agreements, quote approvals, and change orders sent digitally — signed and returned without paper." },
    { icon: "🗄️", title: "Signed document storage", desc: "Every signed agreement stored in one place, organized by customer and job. Access it from anywhere." },
    { icon: "📄", title: "Template library", desc: "Pre-built templates for service agreements, NDAs, subcontractor agreements, and more. Customize per client." },
    { icon: "🔔", title: "Renewal reminders", desc: "Automatic alerts before contracts expire so nothing lapses without your knowledge." },
    { icon: "⬇️", title: "PDF downloads", desc: "Download or print signed agreements any time. Printable, shareable, legally organized." },
    { icon: "🔗", title: "Quote-to-contract flow", desc: "Turn an accepted quote into a signed agreement in one step — no duplicate data entry." },
  ];

  return (
    <div className="w-full h-full overflow-y-auto p-6 lg:p-8">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
        Coming soon · Advanced module
      </div>
      <h1 className="mt-3 text-2xl font-semibold text-slate-950">ContractVault</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
        Send, sign, store, and manage agreements — all from your dashboard. Stop chasing paper and emailing PDFs back and forth.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
            <div className="mb-3 text-2xl">{f.icon}</div>
            <h3 className="text-sm font-semibold text-slate-950">{f.title}</h3>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-violet-200 bg-violet-50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">What&apos;s on the roadmap</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-violet-800">
          {[
            "Service agreements and scope-of-work documents",
            "Quote-to-agreement conversion with one click",
            "NDAs for subcontractors and partners",
            "Change orders attached to active jobs",
            "Signed document archive with search and filtering",
            "Renewal tracking and automatic expiration alerts",
            "PDF generation and download for any document",
            "E-signature flow via email link — no account needed for signers",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 text-violet-400">·</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-xs leading-5 text-amber-800">
        <strong>Legal notice:</strong> ContractVault provides document templates for operational convenience only.
        Templates are not legal advice. Review all agreements with your own attorney before using them with customers or subcontractors.
      </div>

      <div className="mt-6 flex gap-3">
        <a href="/contact" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
          Request early access
        </a>
        <a href="/" className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400">
          Back to site
        </a>
      </div>
    </div>
  );
}

// ─── AI generator section ──────────────────────────────────────

type GeneratedCopy = {
  tagline: string;
  hero: { eyebrow: string; title: string; copy: string; primaryCtaLabel: string };
  servicesHeadline: string;
  servicesCopy: string;
  services: { title: string; copy: string; examples: string[]; detail: string }[];
  storyHeadline: string;
  storyCopy: string;
  processHeadline: string;
  processSteps: { title: string; copy: string }[];
  trustSignals: { title: string; copy: string }[];
  reviewsHeadline: string;
  reviews: { name: string; quote: string }[];
};

const AI_BIZ_TYPES = [
  "Pressure Washing", "Landscaping & Lawn Care", "Painting", "Roofing", "Home Cleaning",
  "HVAC", "Plumbing", "Electrical", "Window Cleaning", "Junk Removal", "Tree Service",
  "Pest Control", "Pool Service", "Handyman", "Concrete & Flatwork", "Fencing",
  "Gutter Services", "Solar Installation", "Barbershop", "Hair Salon", "Personal Training",
  "Massage Therapy", "Tattoo Studio", "Dog Grooming", "Photography", "Catering",
];

function AiGeneratorSection({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const [bizName, setBizName]       = useState("");
  const [bizType, setBizType]       = useState("Pressure Washing");
  const [city, setCity]             = useState("");
  const [tagline, setTagline]       = useState("");
  const [generated, setGenerated]   = useState<GeneratedCopy | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [copied, setCopied]         = useState(false);

  async function handleGenerate() {
    if (!bizName.trim()) return;
    setLoading(true);
    setGenerated(null);
    setError("");

    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType: bizType, businessName: bizName.trim(), city: city.trim() || undefined, direction: tagline.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Generation failed");
      setGenerated(data.copy as GeneratedCopy);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!generated) return;
    const text = [
      `# ${bizName} — AI Website Copy`,
      `Type: ${bizType}${city ? ` · ${city}` : ""}`,
      "",
      `## Tagline\n${generated.tagline}`,
      `## Hero\nEyebrow: ${generated.hero.eyebrow}\nTitle: ${generated.hero.title}\nCopy: ${generated.hero.copy}\nCTA: ${generated.hero.primaryCtaLabel}`,
      `## Services Headline\n${generated.servicesHeadline}\n${generated.servicesCopy}`,
      `## Services\n${generated.services.map((s) => `- ${s.title}: ${s.copy}\n  Examples: ${s.examples.join(", ")}\n  Detail: ${s.detail}`).join("\n")}`,
      `## Story\n${generated.storyHeadline}\n${generated.storyCopy}`,
      `## Process\n${generated.processHeadline}\n${generated.processSteps.map((p) => `- ${p.title}: ${p.copy}`).join("\n")}`,
      `## Trust Signals\n${generated.trustSignals.map((t) => `- ${t.title}: ${t.copy}`).join("\n")}`,
      `## Reviews\n${generated.reviewsHeadline}\n${generated.reviews.map((r) => `- "${r.quote}" — ${r.name}`).join("\n")}`,
    ].join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full h-full overflow-y-auto p-6 lg:p-8">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        Live · Powered by Groq (Llama 3.3 70B)
      </div>
      <h1 className="mt-3 text-2xl font-semibold text-slate-950">Copy Kit</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
        Generate a full website copy kit — hero, services, about, process, trust signals, and reviews —
        structured to drop directly into your site template.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Input panel */}
        <div className="space-y-4 rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm self-start">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Business name *</label>
            <input value={bizName} onChange={(e) => setBizName(e.target.value)}
              placeholder="e.g. Pro Wash Solutions"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-2.5 text-sm outline-none transition focus:border-slate-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Business type</label>
            <select value={bizType} onChange={(e) => setBizType(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-2.5 text-sm outline-none transition focus:border-slate-400">
              {AI_BIZ_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">City / service area</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Atlanta, GA"
              className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-2.5 text-sm outline-none transition focus:border-slate-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">Brand direction <span className="normal-case font-normal">(optional)</span></label>
            <input value={tagline} onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. premium, eco-friendly, fast & affordable"
              className="w-full rounded-xl border border-black/10 bg-[#f7f5ef] px-4 py-2.5 text-sm outline-none transition focus:border-slate-400" />
          </div>
          <button onClick={handleGenerate} disabled={loading || !bizName.trim()}
            className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">
            {loading ? "Generating…" : "Generate website copy ✨"}
          </button>
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</div>
          )}
        </div>

        {/* Output panel */}
        <div>
          {generated ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                  {bizName} · {bizType}{city ? ` · ${city}` : ""}
                </p>
                <div className="flex gap-2">
                  <button onClick={handleCopy}
                    className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400">
                    {copied ? "Copied ✓" : "Copy all"}
                  </button>
                  <button onClick={() => setGenerated(null)}
                    className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400">
                    Reset
                  </button>
                </div>
              </div>

              {/* Hero section */}
              <div className="rounded-[1.5rem] border border-black/5 bg-slate-950 p-6 text-white">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Hero</p>
                <p className="text-xs text-slate-400 mb-1">{generated.hero.eyebrow}</p>
                <p className="text-2xl font-bold leading-tight">{generated.hero.title}</p>
                <p className="mt-2 text-sm text-slate-300 leading-6">{generated.hero.copy}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                    {generated.hero.primaryCtaLabel}
                  </div>
                  <span className="text-xs text-slate-500 italic">&ldquo;{generated.tagline}&rdquo;</span>
                </div>
              </div>

              {/* Services */}
              <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Services</p>
                <p className="mb-1 text-sm font-semibold text-slate-950">{generated.servicesHeadline}</p>
                <p className="mb-4 text-xs text-slate-500">{generated.servicesCopy}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {generated.services.map((s) => (
                    <div key={s.title} className="rounded-xl bg-[#f7f5ef] p-4">
                      <p className="text-sm font-semibold text-slate-950">{s.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{s.copy}</p>
                      <p className="mt-2 text-xs text-slate-400 italic">{s.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Story + Process */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">About / Story</p>
                  <p className="mb-1 text-sm font-semibold text-slate-950">{generated.storyHeadline}</p>
                  <p className="text-xs leading-6 text-slate-600">{generated.storyCopy}</p>
                </div>
                <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">How it works</p>
                  <p className="mb-3 text-sm font-semibold text-slate-950">{generated.processHeadline}</p>
                  <ol className="space-y-2">
                    {generated.processSteps.map((p, i) => (
                      <li key={p.title} className="flex gap-3 text-xs">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[10px] font-bold text-white">{i + 1}</span>
                        <span><strong className="text-slate-950">{p.title}</strong> — {p.copy}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Trust signals + Reviews */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Trust signals</p>
                  <ul className="space-y-3">
                    {generated.trustSignals.map((t) => (
                      <li key={t.title}>
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-950">
                          <span className="text-emerald-500">✓</span>{t.title}
                        </p>
                        <p className="ml-5 mt-0.5 text-xs leading-5 text-slate-500">{t.copy}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Reviews</p>
                  <p className="mb-3 text-sm font-semibold text-slate-950">{generated.reviewsHeadline}</p>
                  <ul className="space-y-3">
                    {generated.reviews.map((r) => (
                      <li key={r.name} className="rounded-xl bg-[#f7f5ef] p-3">
                        <p className="text-xs leading-5 text-slate-600 italic">&ldquo;{r.quote}&rdquo;</p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">— {r.name}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    createWebsiteProfileDraft({
                      businessName: bizName,
                      industry: bizType,
                      city,
                      services: generated.services.map((s) => s.title),
                      businessDescription: generated.tagline,
                    });
                    onNavigate("websites");
                  }}
                  className="rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Start Website Profile →
                </button>
                <span className="text-xs text-slate-400">Opens prefilled editor — review and save</span>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-black/10 text-center p-8">
              <p className="text-3xl">✨</p>
              <p className="mt-3 text-sm font-semibold text-slate-700">Full website content kit</p>
              <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
                Fill in your business details and hit generate. Hero, services, about, process, trust signals,
                and reviews — structured for the platform template.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────

export default function AdminApp() {
  const router = useRouter();
  const supabase = createClient();

  const [section, setSection] = useState<Section>(() => {
    const nav = consumeNavTarget();
    if (nav === "websites") return "websites";
    return (sessionStorage.getItem("admin_active_section") as Section | null) ?? "dashboard";
  });

  useEffect(() => {
    sessionStorage.setItem("admin_active_section", section);
  }, [section]);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    () => sessionStorage.getItem("admin_selected_customer") ?? null
  );

  useEffect(() => {
    if (selectedCustomerId) {
      sessionStorage.setItem("admin_selected_customer", selectedCustomerId);
    } else {
      sessionStorage.removeItem("admin_selected_customer");
    }
  }, [selectedCustomerId]);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(() => {
    const v = sessionStorage.getItem("admin_selected_lead");
    return v ? Number(v) : null;
  });

  useEffect(() => {
    if (selectedLeadId != null) {
      sessionStorage.setItem("admin_selected_lead", String(selectedLeadId));
    } else {
      sessionStorage.removeItem("admin_selected_lead");
    }
  }, [selectedLeadId]);

  const loadLeads = useCallback(async () => {
    setLeadsLoading(true);
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads((data as Lead[]) ?? []);
    setLeadsLoading(false);
  }, [supabase]);

  const loadCustomers = useCallback(async () => {
    setCustomersLoading(true);
    const [{ data: cust }, { data: j }, { data: q }, { data: inv }] = await Promise.all([
      supabase.from("customers").select("*").order("created_at", { ascending: false }),
      supabase.from("jobs").select("*").order("created_at", { ascending: false }),
      supabase.from("quotes").select("*").order("created_at", { ascending: false }),
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
    ]);
    setCustomers((cust as Customer[]) ?? []);
    setJobs((j as Job[]) ?? []);
    setQuotes((q as Quote[]) ?? []);
    setInvoices((inv as Invoice[]) ?? []);
    setCustomersLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadLeads();
    loadCustomers();
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? ""));
  }, [loadLeads, loadCustomers, supabase.auth]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  // Lead mutations
  async function handleUpdateStatus(id: number, status: LeadStatus) {
    await supabase.from("leads").update({ status }).eq("id", id);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }
  async function handleSaveNotes(id: number, notes: string): Promise<void> {
    await supabase.from("leads").update({ notes }).eq("id", id);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)));
  }
  async function handleDeleteLead(id: number) {
    await supabase.from("leads").delete().eq("id", id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }
  async function handleCreateCustomer(lead: Lead) {
    const { data } = await supabase.from("customers").insert({
      name: lead.name, email: lead.email, phone: lead.phone,
      business: lead.business, notes: lead.notes, lead_id: lead.id,
    }).select().single();
    if (data) {
      const c = data as Customer;
      setCustomers((prev) => [c, ...prev]);
      setSelectedCustomerId(c.id);
      setSection("customers");
    }
  }

  async function handleAddDirectCustomer(name: string, email: string, phone: string, business: string): Promise<Customer | null> {
    const { data } = await supabase.from("customers").insert({
      name, email: email || null, phone: phone || null, business: business || null,
    }).select().single();
    if (data) {
      const c = data as Customer;
      setCustomers((prev) => [c, ...prev]);
      return c;
    }
    return null;
  }

  // Customer mutations
  async function handleUpdateCustomerNotes(id: string, notes: string): Promise<void> {
    await supabase.from("customers").update({ notes }).eq("id", id);
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, notes } : c)));
  }
  async function handleUpdateCustomerPhone(id: string, phone: string | null): Promise<void> {
    await supabase.from("customers").update({ phone }).eq("id", id);
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, phone } : c)));
  }
  async function handleAddJob(customerId: string, title: string, scheduled_date: string, notes: string): Promise<void> {
    const { data } = await supabase.from("jobs").insert({
      customer_id: customerId, title, scheduled_date: scheduled_date || null, notes: notes || null,
    }).select().single();
    if (data) setJobs((prev) => [data as Job, ...prev]);
  }
  async function handleUpdateJobStatus(id: number, status: JobStatus) {
    await supabase.from("jobs").update({ status }).eq("id", id);
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  }
  async function handleAddQuote(customerId: string, title: string, items: LineItem[]): Promise<void> {
    const total = items.reduce((s, li) => s + li.qty * li.price, 0);
    const { data } = await supabase.from("quotes").insert({
      customer_id: customerId, title, line_items: items, total,
    }).select().single();
    if (data) setQuotes((prev) => [data as Quote, ...prev]);
  }
  async function handleUpdateQuoteStatus(id: string, status: QuoteStatus) {
    await supabase.from("quotes").update({ status }).eq("id", id);
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  }
  async function handleDeleteCustomer(id: string) {
    await supabase.from("customers").delete().eq("id", id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setJobs((prev) => prev.filter((j) => j.customer_id !== id));
    setQuotes((prev) => prev.filter((q) => q.customer_id !== id));
    setInvoices((prev) => prev.filter((inv) => inv.customer_id !== id));
  }
  async function handleAddInvoice(customerId: string, title: string, items: LineItem[], dueDate: string, quoteId?: string): Promise<void> {
    const num = `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(4, "0")}`;
    const total = items.reduce((s, li) => s + li.qty * li.price, 0);
    const { data } = await supabase.from("invoices").insert({
      customer_id: customerId, title, line_items: items, total,
      invoice_number: num, due_date: dueDate || null, quote_id: quoteId ?? null,
    }).select().single();
    if (data) setInvoices((prev) => [data as Invoice, ...prev]);
  }
  async function handleUpdateInvoiceStatus(id: string, status: InvoiceStatus) {
    await supabase.from("invoices").update({ status }).eq("id", id);
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
  }
  async function handleConvertQuoteToInvoice(quote: Quote): Promise<void> {
    await handleAddInvoice(quote.customer_id, quote.title, quote.line_items, "", quote.id);
  }

  const newLeadsCount  = leads.filter((l) => l.status === "new").length;
  const overdueCount   = invoices.filter((i) => i.status === "overdue").length;

  type NavGroup = { label: string; items: { id: Section; label: string; badge?: number }[] };
  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        { id: "dashboard", label: "Overview" },
      ],
    },
    {
      label: "Website Builder",
      items: [
        { id: "websites",     label: "Website Profiles"     },
        { id: "ai_generator", label: "Copy Kit"             },
        { id: "contracts",    label: "ContractVault (Soon)" },
      ],
    },
    {
      label: "Clients",
      items: [
        { id: "leads",     label: "Leads",     badge: newLeadsCount },
        { id: "customers", label: "Customers" },
        { id: "invoices",  label: "Invoices",  badge: overdueCount  },
      ],
    },
    {
      label: "Field Tools",
      items: [
        { id: "maphub", label: "Map Hub" },
      ],
    },
    {
      label: "Account",
      items: [
        { id: "settings", label: "Settings" },
      ],
    },
  ];
  function nav(id: Section) {
    setSection(id);
    setMobileNavOpen(false);
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#f7f5ef]">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-black/5 bg-white px-4 py-6 lg:flex">
        <a href="/" className="px-2 text-base font-semibold tracking-tight text-slate-950 transition hover:text-slate-700">
          Main App
        </a>
        <nav className="mt-6 flex flex-col gap-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {group.label}
              </p>
              {group.items.map((item) => (
                <button key={item.id} onClick={() => nav(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    section === item.id ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}>
                  <span>{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      section === item.id
                        ? "bg-white/20 text-white"
                        : item.id === "invoices"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="mt-auto space-y-1">
          <div className="rounded-xl border border-black/5 bg-[#f7f5ef] px-3 py-2.5">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-700">{userEmail}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-950">
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 lg:hidden">
          <a href="/" className="text-base font-semibold tracking-tight text-slate-950">Main App</a>
          <button onClick={() => setMobileNavOpen((o) => !o)} aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10">
            {mobileNavOpen ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M1 1l13 13M14 1L1 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M1 3.5h13M1 7.5h13M1 11.5h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </header>

        {mobileNavOpen && (
          <div className="max-h-[70vh] overflow-y-auto border-b border-black/5 bg-white px-4 pb-4 pt-1 lg:hidden">
            {navGroups.map((group) => (
              <div key={group.label} className="mt-3">
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{group.label}</p>
                {group.items.map((item) => (
                  <button key={item.id} onClick={() => nav(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      section === item.id ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}>
                    <span>{item.label}</span>
                    {item.badge != null && item.badge > 0 && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">{item.badge}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
            <div className="mt-3 border-t border-black/5 pt-2">
              <p className="px-3 py-1 text-xs text-slate-400">{userEmail}</p>
              <button onClick={handleLogout} className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-50">Sign out</button>
            </div>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {section === "dashboard" && (
            <DashboardSection
              leads={leads} customers={customers} jobs={jobs} invoices={invoices}
              onGoToLeads={() => nav("leads")} onGoToCustomers={() => nav("customers")} onGoToInvoices={() => nav("invoices")}
            />
          )}
          {section === "leads" && (
            <LeadsSection
              leads={leads} loading={leadsLoading} customers={customers}
              onUpdateStatus={handleUpdateStatus} onSaveNotes={handleSaveNotes}
              onDelete={handleDeleteLead} onCreateCustomer={handleCreateCustomer}
              selectedLeadId={selectedLeadId} onSelectLead={setSelectedLeadId}
              onNavigateToCustomer={(id) => { setSelectedCustomerId(id); setSection("customers"); }}
            />
          )}
          {section === "customers" && (
            <CustomersSection
              customers={customers} jobs={jobs} quotes={quotes} invoices={invoices} leads={leads} loading={customersLoading}
              onUpdateNotes={handleUpdateCustomerNotes} onUpdatePhone={handleUpdateCustomerPhone}
              onAddJob={handleAddJob}
              onUpdateJobStatus={handleUpdateJobStatus} onAddQuote={handleAddQuote}
              onUpdateQuoteStatus={handleUpdateQuoteStatus}
              onAddInvoice={handleAddInvoice} onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
              onConvertQuoteToInvoice={handleConvertQuoteToInvoice}
              onDeleteCustomer={handleDeleteCustomer}
              onAddDirectCustomer={handleAddDirectCustomer}
              onNavigate={nav}
              selectedCustomerId={selectedCustomerId} onSelectCustomer={setSelectedCustomerId}
              onNavigateToLead={(id) => { setSelectedLeadId(id); setSection("leads"); }}
            />
          )}
          {section === "invoices" && (
            <InvoicesSection
              invoices={invoices} customers={customers} loading={customersLoading}
              onUpdateStatus={handleUpdateInvoiceStatus}
            />
          )}
          {section === "maphub"       && <MapHubSection leads={leads} />}
          {section === "map"          && <MapSection leads={leads} />}
          {section === "canvass"      && <CanvassSection />}
          {section === "contracts"    && <ContractVaultSection />}
          {section === "ai_generator" && <AiGeneratorSection onNavigate={setSection} />}
          {section === "websites"     && (
            <BusinessSection
              onNavigate={(s) => setSection(s as Section)}
              onNavigateToCustomer={(id) => { setSelectedCustomerId(id); setSection("customers"); }}
              customers={customers.map((c) => ({ id: c.id, name: c.name, phone: c.phone }))}
            />
          )}
          {section === "settings"     && <SettingsSection email={userEmail} />}
        </div>
      </div>
    </div>
  );
}

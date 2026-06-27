"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type LineItem = { description: string; qty: number; price: number };

type Invoice = {
  id: number;
  customer_id: number;
  quote_id: number | null;
  invoice_number: string;
  title: string;
  line_items: LineItem[];
  total: number;
  status: "draft" | "sent" | "paid" | "overdue";
  due_date: string | null;
  notes: string | null;
  created_at: string;
};

type Customer = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  business: string | null;
  address: string | null;
};

function usd(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function fmtIso(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const STATUS_STAMP: Record<Invoice["status"], { label: string; color: string } | null> = {
  draft:    null,
  sent:     null,
  paid:     { label: "PAID",    color: "#10b981" },
  overdue:  { label: "OVERDUE", color: "#ef4444" },
};

export default function InvoicePrint({ id }: { id: string }) {
  const [invoice, setInvoice]   = useState<Invoice | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: inv, error: ie } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", id)
        .single();
      if (ie || !inv) { setError("Invoice not found."); setLoading(false); return; }
      setInvoice(inv as Invoice);

      const { data: cust } = await supabase
        .from("customers")
        .select("*")
        .eq("id", (inv as Invoice).customer_id)
        .single();
      if (cust) setCustomer(cust as Customer);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#64748b" }}>Loading invoice…</div>;
  if (error || !invoice) return <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#ef4444" }}>{error || "Invoice not found."}</div>;

  const stamp = STATUS_STAMP[invoice.status];

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .invoice-page { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
        }
        body { background: #f7f5ef; margin: 0; font-family: -apple-system, sans-serif; }
      `}</style>

      {/* Print / Back bar */}
      <div className="no-print" style={{ background: "#0f172a", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/admin" style={{ color: "#94a3b8", fontSize: "13px", textDecoration: "none" }}>← Back to Admin</a>
        <button onClick={() => window.print()} style={{
          background: "white", color: "#0f172a", border: "none", borderRadius: "9999px",
          padding: "8px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
        }}>
          Print / Save PDF
        </button>
      </div>

      {/* Invoice */}
      <div style={{ maxWidth: "720px", margin: "32px auto 64px", padding: "0 16px" }}>
        <div className="invoice-page" style={{
          background: "white", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          overflow: "hidden", position: "relative",
        }}>
          {/* Status stamp watermark */}
          {stamp && (
            <div style={{
              position: "absolute", top: "60px", right: "48px",
              border: `3px solid ${stamp.color}`, color: stamp.color,
              borderRadius: "8px", padding: "6px 18px",
              fontSize: "28px", fontWeight: 800, letterSpacing: "4px",
              opacity: 0.25, transform: "rotate(-12deg)", pointerEvents: "none",
              userSelect: "none",
            }}>{stamp.label}</div>
          )}

          {/* Header */}
          <div style={{ background: "#0f172a", padding: "40px 48px", color: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "22px", margin: 0, letterSpacing: "-0.3px" }}>Main App</p>
                <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>hello@mainapp.co</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "32px", fontWeight: 800, margin: 0, letterSpacing: "-1px", color: "white" }}>INVOICE</p>
                <p style={{ color: "#64748b", fontSize: "13px", margin: "4px 0 0" }}>{invoice.invoice_number}</p>
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "20px 48px", display: "flex", gap: "48px" }}>
            {[
              { label: "Issue Date", value: fmtIso(invoice.created_at) },
              { label: "Due Date",   value: invoice.due_date ? fmtDate(invoice.due_date) : "Upon receipt" },
              { label: "Status",     value: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", margin: 0 }}>{label}</p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", margin: "4px 0 0" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Bill to */}
          <div style={{ padding: "32px 48px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", margin: "0 0 8px" }}>Bill To</p>
              <p style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a", margin: "0 0 2px" }}>{customer?.name ?? "—"}</p>
              {customer?.business && <p style={{ fontSize: "13px", color: "#475569", margin: "2px 0" }}>{customer.business}</p>}
              {customer?.email   && <p style={{ fontSize: "13px", color: "#475569", margin: "2px 0" }}>{customer.email}</p>}
              {customer?.phone   && <p style={{ fontSize: "13px", color: "#475569", margin: "2px 0" }}>{customer.phone}</p>}
              {customer?.address && <p style={{ fontSize: "13px", color: "#475569", margin: "2px 0" }}>{customer.address}</p>}
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", margin: "0 0 8px" }}>For</p>
              <p style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a", margin: 0 }}>{invoice.title}</p>
            </div>
          </div>

          {/* Line items */}
          <div style={{ padding: "32px 48px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                  {["Description", "Qty", "Unit Price", "Total"].map((h, i) => (
                    <th key={h} style={{
                      padding: "0 0 10px", textAlign: i === 0 ? "left" : "right",
                      fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
                      letterSpacing: "0.1em", color: "#94a3b8",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoice.line_items.map((li, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "14px 0", fontSize: "14px", color: "#334155" }}>{li.description}</td>
                    <td style={{ padding: "14px 0", fontSize: "14px", color: "#64748b", textAlign: "right" }}>{li.qty}</td>
                    <td style={{ padding: "14px 0", fontSize: "14px", color: "#64748b", textAlign: "right" }}>{usd(li.price)}</td>
                    <td style={{ padding: "14px 0", fontSize: "14px", fontWeight: 600, color: "#0f172a", textAlign: "right" }}>{usd(li.qty * li.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div style={{ marginTop: "16px", borderTop: "2px solid #0f172a", paddingTop: "16px", display: "flex", justifyContent: "flex-end" }}>
              <div style={{ minWidth: "200px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>Subtotal</span>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>{usd(invoice.total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Total</span>
                  <span style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{usd(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div style={{ padding: "0 48px 32px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", margin: "0 0 6px" }}>Notes</p>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6", margin: 0, background: "#f8fafc", borderRadius: "8px", padding: "12px 14px" }}>{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Thank you for your business.</p>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Main App · hello@mainapp.co</p>
          </div>
        </div>
      </div>
    </>
  );
}

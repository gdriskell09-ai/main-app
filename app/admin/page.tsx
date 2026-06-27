"use client";

import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("./AdminApp"), { ssr: false });

export default function AdminPage() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <AdminApp />
    </div>
  );
}

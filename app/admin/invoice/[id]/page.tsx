"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const InvoicePrint = dynamic(() => import("./InvoicePrint"), { ssr: false });

export default function InvoicePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);
  return <InvoicePrint id={id} />;
}

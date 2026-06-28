import { createClient } from "@/lib/supabase/client";
import type { BusinessProfile } from "./types";

// ── Column mapping ─────────────────────────────────────────────

type DbRow = {
  id: string;
  owner_id: string | null;
  customer_id: string | null;
  business_name: string;
  industry: string;
  phone: string;
  email: string;
  service_area: string;
  city: string;
  brand_color: string;
  logo_url: string;
  services: string[];
  business_description: string;
  preferred_style_pack: string;
  desired_custom_modules: string[];
  website_goals: string;
  quote_form_needs: string;
  generated_content: unknown | null;
  created_at: string;
  updated_at: string;
};

function toRow(profile: BusinessProfile): Omit<DbRow, "owner_id"> {
  const now = new Date().toISOString();
  return {
    id: profile.id,
    customer_id: profile.customer_id ?? null,
    business_name: profile.businessName,
    industry: profile.industry,
    phone: profile.phone,
    email: profile.email,
    service_area: profile.serviceArea,
    city: profile.city,
    brand_color: profile.brandColor,
    logo_url: profile.logoUrl,
    services: profile.services,
    business_description: profile.businessDescription,
    preferred_style_pack: profile.preferredStylePack,
    desired_custom_modules: profile.desiredCustomModules,
    website_goals: profile.websiteGoals,
    quote_form_needs: profile.quoteFormNeeds,
    generated_content: profile.generatedContent ?? null,
    created_at: profile.createdAt || now,
    updated_at: now,
  };
}

function toProfile(row: DbRow): BusinessProfile {
  return {
    id: row.id,
    ...(row.customer_id != null ? { customer_id: row.customer_id } : {}),
    businessName: row.business_name,
    industry: row.industry,
    phone: row.phone,
    email: row.email,
    serviceArea: row.service_area,
    city: row.city,
    brandColor: row.brand_color,
    logoUrl: row.logo_url,
    services: (row.services as string[]) ?? [],
    businessDescription: row.business_description,
    preferredStylePack: row.preferred_style_pack as BusinessProfile["preferredStylePack"],
    desiredCustomModules:
      (row.desired_custom_modules as BusinessProfile["desiredCustomModules"]) ?? [],
    websiteGoals: row.website_goals,
    quoteFormNeeds: row.quote_form_needs,
    ...(row.generated_content != null
      ? { generatedContent: row.generated_content as BusinessProfile["generatedContent"] }
      : {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── Public API ─────────────────────────────────────────────────

export async function getAllProfiles(): Promise<BusinessProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as DbRow[]).map(toProfile);
}

export async function getProfile(id: string): Promise<BusinessProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return toProfile(data as DbRow);
}

export async function saveProfile(profile: BusinessProfile): Promise<BusinessProfile> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("business_profiles")
    .upsert(toRow(profile), { onConflict: "id" })
    .select()
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to save profile");
  return toProfile(data as DbRow);
}

export async function deleteProfile(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("business_profiles")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export function createId(): string {
  return `bp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

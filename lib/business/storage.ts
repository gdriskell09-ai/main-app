import type { BusinessProfile } from "./types";

const KEY = "main_app_business_profiles";

function read(): BusinessProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BusinessProfile[]) : [];
  } catch {
    return [];
  }
}

function write(profiles: BusinessProfile[]): void {
  localStorage.setItem(KEY, JSON.stringify(profiles));
}

export function getAllProfiles(): BusinessProfile[] {
  return read();
}

export function getProfile(id: string): BusinessProfile | null {
  return read().find((p) => p.id === id) ?? null;
}

export function saveProfile(profile: BusinessProfile): BusinessProfile {
  const profiles = read();
  const now = new Date().toISOString();
  const idx = profiles.findIndex((p) => p.id === profile.id);
  const saved: BusinessProfile = {
    ...profile,
    updatedAt: now,
    createdAt: profile.createdAt || now,
  };
  if (idx >= 0) {
    profiles[idx] = saved;
  } else {
    profiles.push(saved);
  }
  write(profiles);
  return saved;
}

export function deleteProfile(id: string): void {
  write(read().filter((p) => p.id !== id));
}

export function createId(): string {
  return `bp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

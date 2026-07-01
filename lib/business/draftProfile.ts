import type { BusinessProfile } from "./types";
import { getBlueprint } from "./blueprints/index";

const DRAFT_KEY      = "wp_draft";
const EDIT_KEY       = "wp_pending_edit";
const EDIT_DRAFT_KEY = "wp_edit_draft";
const NAV_KEY        = "wp_nav_to";
const TTL_MS         = 10 * 60 * 1000; // 10 minutes

interface Timed<T> {
  data: T;
  createdAt: number;
}

function store<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify({ data: value, createdAt: Date.now() }));
}

function consume<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  sessionStorage.removeItem(key);
  try {
    const entry = JSON.parse(raw) as Timed<T>;
    if (Date.now() - entry.createdAt > TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function peek<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    const entry = JSON.parse(raw) as Timed<T>;
    if (Date.now() - entry.createdAt > TTL_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
}

// ── Website Profile draft (new-profile prefill via sessionStorage) ──

export function createWebsiteProfileDraft(prefill: Partial<BusinessProfile>): void {
  const merged = { ...prefill };
  if (merged.industry && !merged.preferredStylePack) {
    merged.preferredStylePack = getBlueprint(merged.industry).recommendedStylePacks[0];
  }
  store(DRAFT_KEY, merged);
}

export function consumeWebsiteProfileDraft(): Partial<BusinessProfile> | null {
  return consume<Partial<BusinessProfile>>(DRAFT_KEY);
}

export function peekWebsiteProfileDraft(): Partial<BusinessProfile> | null {
  return peek<Partial<BusinessProfile>>(DRAFT_KEY);
}

// ── Pending edit (open a specific existing profile's editor on mount) ─

export function createWebsiteProfilePendingEdit(profileId: string): void {
  store(EDIT_KEY, profileId);
}

export function consumeWebsiteProfilePendingEdit(): string | null {
  return consume<string>(EDIT_KEY);
}

// ── Existing profile edit draft (persist in-progress edits across reload) ──

export function createWebsiteProfileEditDraft(profileId: string, form: Partial<BusinessProfile>): void {
  store(EDIT_DRAFT_KEY, { ...form, id: profileId });
}

export function peekWebsiteProfileEditDraft(): (Partial<BusinessProfile> & { id: string }) | null {
  return peek<Partial<BusinessProfile> & { id: string }>(EDIT_DRAFT_KEY);
}

export function consumeWebsiteProfileEditDraft(): void {
  consume(EDIT_DRAFT_KEY);
}

// ── Nav target (used by preview page to land on a specific section) ──

export function setNavTarget(target: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(NAV_KEY, target);
}

export function consumeNavTarget(): string | null {
  if (typeof window === "undefined") return null;
  const val = sessionStorage.getItem(NAV_KEY);
  if (val) sessionStorage.removeItem(NAV_KEY);
  return val ?? null;
}

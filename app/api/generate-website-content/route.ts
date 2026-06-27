import { NextRequest, NextResponse } from "next/server";
import type { BusinessProfile, GeneratedWebsiteContent } from "@/lib/business/types";
import { generateFallbackContent } from "@/lib/business/contentGenerator";
import { getBlueprint } from "@/lib/business/blueprints/index";

// ── JSON validation ───────────────────────────────────────────────

type MaybeAIContent = {
  heroHeadline?: unknown;
  heroSubheadline?: unknown;
  heroCtaText?: unknown;
  services?: unknown;
  whyChooseUs?: unknown;
  stats?: unknown;
  faqs?: unknown;
  reviews?: unknown;
  finalCtaHeadline?: unknown;
  finalCtaText?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isObjectArray(v: unknown): v is Record<string, unknown>[] {
  return Array.isArray(v) && v.length > 0 && typeof v[0] === "object";
}

function validateAIResponse(obj: unknown): obj is MaybeAIContent {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as MaybeAIContent;
  return (
    isNonEmptyString(o.heroHeadline) &&
    isNonEmptyString(o.heroSubheadline) &&
    isNonEmptyString(o.heroCtaText) &&
    isObjectArray(o.services) &&
    isObjectArray(o.whyChooseUs) &&
    isObjectArray(o.stats) &&
    Array.isArray(o.faqs) &&
    Array.isArray(o.reviews) &&
    isNonEmptyString(o.finalCtaHeadline) &&
    isNonEmptyString(o.finalCtaText) &&
    isNonEmptyString(o.seoTitle) &&
    isNonEmptyString(o.seoDescription)
  );
}

// ── Prompt builder ────────────────────────────────────────────────

function buildPrompt(profile: BusinessProfile): string {
  const blueprint = getBlueprint(profile.industry);
  const city = profile.city || "the local area";
  const area = profile.serviceArea || city;
  const serviceList = profile.services.length > 0
    ? profile.services.map((s, i) => `  ${i + 1}. ${s}`).join("\n")
    : "  (no specific services listed — use industry defaults)";

  return `You are a professional website copywriter specializing in local service businesses. Write compelling, specific copy for this business.

Business Name: ${profile.businessName}
Industry: ${profile.industry}
City: ${city}
Service Area: ${area}
Services offered:
${serviceList}
${profile.businessDescription ? `\nBusiness Description: ${profile.businessDescription}` : ""}

Blueprint guidance:
- CTA Strategy: ${blueprint.ctaStrategy}
- Content notes: ${blueprint.aiPromptNotes}

Rules:
- Hero headline: punchy, 5-8 words, NO business name in it — the subheadline introduces the business
- Hero subheadline: 1-2 sentences, mention the business name and city
- Write descriptions for EVERY service listed above (match titles exactly)
- All copy should sound genuine and local, not generic
- Return ONLY valid JSON — no markdown fences, no explanation

JSON structure:
{
  "heroHeadline": "short punchy headline 5-8 words",
  "heroSubheadline": "1-2 sentences mentioning business name and city",
  "heroCtaText": "CTA button text 3-5 words",
  "services": [
    {"icon": "single emoji", "title": "exact service name from list", "description": "2 sentences, specific and benefit-focused"}
  ],
  "whyChooseUs": [
    {"icon": "single emoji", "title": "reason title", "description": "1-2 sentences why customers choose this business"}
  ],
  "stats": [
    {"value": "number or short text", "label": "what it measures"}
  ],
  "faqs": [
    {"question": "FAQ question?", "answer": "clear, specific answer"}
  ],
  "reviews": [
    {"name": "FirstName L.", "rating": 5, "text": "genuine-sounding review", "location": "${city}"}
  ],
  "finalCtaHeadline": "closing section headline",
  "finalCtaText": "CTA button text 3-5 words",
  "seoTitle": "SEO title including business name and city",
  "seoDescription": "SEO meta description 120-160 chars"
}

Include: all services listed, 3 whyChooseUs reasons, 3-4 stats, 4-5 FAQs, 3 reviews.`;
}

// ── Route handler ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let profile: BusinessProfile;
  try {
    const body = await req.json();
    profile = body.profile as BusinessProfile;
    if (!profile?.businessName) {
      return NextResponse.json(
        { error: "Missing profile.businessName" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;

  // No key — return deterministic fallback immediately
  if (!apiKey) {
    const fallback = generateFallbackContent(profile);
    return NextResponse.json(fallback);
  }

  // Attempt AI generation
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a professional copywriter for local service businesses. Always respond with valid JSON only — no markdown, no explanation, no code fences.",
          },
          { role: "user", content: buildPrompt(profile) },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!groqRes.ok) {
      const fallback = generateFallbackContent(profile);
      fallback.fallbackReason = `Groq API returned ${groqRes.status}`;
      return NextResponse.json(fallback);
    }

    const groqData = await groqRes.json();
    const raw: string = groqData.choices?.[0]?.message?.content ?? "";

    // Parse JSON — try direct first, then extract from markdown fence
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.trim());
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) {
        const fallback = generateFallbackContent(profile);
        fallback.fallbackReason = "Groq response was not valid JSON";
        return NextResponse.json(fallback);
      }
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        const fallback = generateFallbackContent(profile);
        fallback.fallbackReason = "Groq JSON extraction failed";
        return NextResponse.json(fallback);
      }
    }

    // Validate shape
    if (!validateAIResponse(parsed)) {
      const fallback = generateFallbackContent(profile);
      fallback.fallbackReason = "Groq response missing required fields";
      return NextResponse.json(fallback);
    }

    // Shape matches — build the final content object
    const blueprint = getBlueprint(profile.industry);
    const ai = parsed as MaybeAIContent;

    const result: GeneratedWebsiteContent = {
      heroHeadline:     ai.heroHeadline    as string,
      heroSubheadline:  ai.heroSubheadline as string,
      heroCtaText:      ai.heroCtaText     as string,
      services:         ai.services        as GeneratedWebsiteContent["services"],
      whyChooseUs:      ai.whyChooseUs     as GeneratedWebsiteContent["whyChooseUs"],
      stats:            ai.stats           as GeneratedWebsiteContent["stats"],
      faqs:             ai.faqs            as GeneratedWebsiteContent["faqs"],
      reviews:          ai.reviews         as GeneratedWebsiteContent["reviews"],
      finalCtaHeadline: ai.finalCtaHeadline as string,
      finalCtaText:     ai.finalCtaText     as string,
      seoTitle:         ai.seoTitle         as string,
      seoDescription:   ai.seoDescription   as string,
      recommendedStylePack:    blueprint.recommendedStylePacks[0],
      recommendedCustomModules: blueprint.recommendedCustomModules,
      source:      "groq",
      generatedAt: new Date().toISOString(),
      provider:    "groq/llama-3.3-70b-versatile",
    };

    return NextResponse.json(result);
  } catch (err) {
    const fallback = generateFallbackContent(profile);
    fallback.fallbackReason = `Unexpected error: ${err instanceof Error ? err.message : String(err)}`;
    return NextResponse.json(fallback);
  }
}

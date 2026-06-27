import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
  }

  const { businessType, businessName, city, direction } = await req.json();
  if (!businessType || typeof businessType !== "string") {
    return NextResponse.json({ error: "businessType is required" }, { status: 400 });
  }

  const context = [
    `Business type: ${businessType}`,
    businessName ? `Business name: ${businessName}` : null,
    city ? `Location / service area: ${city}` : null,
    direction ? `Brand direction: ${direction}` : null,
  ].filter(Boolean).join("\n");

  const prompt = `You are an expert copywriter for local service businesses. Generate website copy for this business:

${context}

Return ONLY valid JSON matching this exact structure (no markdown, no extra text):
{
  "tagline": "Short brand tagline (5-8 words max)",
  "hero": {
    "eyebrow": "Service area / specialty label (e.g. 'Exterior cleaning in [City] and nearby')",
    "title": "Powerful hero headline (max 8 words, present tense action)",
    "copy": "2-sentence hero subtext that describes what they do and why customers choose them",
    "primaryCtaLabel": "CTA button text (3-5 words)"
  },
  "servicesHeadline": "Section headline for services (max 10 words)",
  "servicesCopy": "One sentence describing the service selection",
  "services": [
    {"title": "Service name", "copy": "One sentence benefit-focused description", "examples": ["specific use case", "specific use case", "specific use case"], "detail": "One sentence expanded detail about who this is best for"},
    {"title": "Service name", "copy": "One sentence benefit-focused description", "examples": ["specific use case", "specific use case", "specific use case"], "detail": "One sentence expanded detail about who this is best for"},
    {"title": "Service name", "copy": "One sentence benefit-focused description", "examples": ["specific use case", "specific use case", "specific use case"], "detail": "One sentence expanded detail about who this is best for"},
    {"title": "Service name", "copy": "One sentence benefit-focused description", "examples": ["specific use case", "specific use case", "specific use case"], "detail": "One sentence expanded detail about who this is best for"}
  ],
  "storyHeadline": "About / story section headline (max 10 words)",
  "storyCopy": "2-3 sentence brand story about what makes this business different. Warm, first-person, trust-building.",
  "processHeadline": "How it works section headline (max 10 words)",
  "processSteps": [
    {"title": "Step 1 title", "copy": "One sentence explaining this step"},
    {"title": "Step 2 title", "copy": "One sentence explaining this step"},
    {"title": "Step 3 title", "copy": "One sentence explaining this step"}
  ],
  "trustSignals": [
    {"title": "Trust signal title", "copy": "One sentence elaborating on this trust point"},
    {"title": "Trust signal title", "copy": "One sentence elaborating on this trust point"},
    {"title": "Trust signal title", "copy": "One sentence elaborating on this trust point"}
  ],
  "reviewsHeadline": "Social proof section headline (max 12 words)",
  "reviews": [
    {"name": "Satisfied customer description (e.g. 'Beavercreek homeowner')", "quote": "Authentic-sounding review sentence"},
    {"name": "Satisfied customer description", "quote": "Authentic-sounding review sentence"},
    {"name": "Satisfied customer description", "quote": "Authentic-sounding review sentence"}
  ]
}`;

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a professional copywriter. Always respond with valid JSON only, no other text." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1400,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      return NextResponse.json({ error: `Groq API error: ${err}` }, { status: 502 });
    }

    const groqData = await groqRes.json();
    const raw = groqData.choices?.[0]?.message?.content || "";

    let copy: object;
    try {
      copy = JSON.parse(raw.trim());
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json({ error: "Could not parse Groq response as JSON" }, { status: 502 });
      }
      copy = JSON.parse(jsonMatch[0]);
    }

    return NextResponse.json({ copy });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

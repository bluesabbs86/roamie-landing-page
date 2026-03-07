import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { destination, checkIn, checkOut, nights, adults, children, activitiesRemaining, totalRemaining, budgetPerPerson, currencySymbol, currencyCode } = await req.json();

    const userPrompt = `Destination: ${destination}
Travel dates: ${checkIn} to ${checkOut} (${nights} nights)
Travellers: ${adults} adults, ${children} children
Activities budget remaining: ${currencySymbol}${activitiesRemaining} (${currencyCode})
Total budget remaining: ${currencySymbol}${totalRemaining} (${currencyCode})
Budget per person: ${currencySymbol}${budgetPerPerson}

Generate exactly 18 activity recommendations featuring well-known landmarks, popular attractions, and hidden gems. Return ONLY this JSON array:
[
  {
    "id": "act_001",
    "name": "Activity name",
    "category": "Culture & History",
    "categoryIcon": "🏛️",
    "tier": "free",
    "description": "Two sentence description of this activity and why it is worth doing.",
    "estimatedCostPerPerson": 0,
    "currency": "${currencyCode}",
    "duration": "2-3 hours",
    "bestTime": "Morning",
    "localTip": "One specific insider tip about this activity.",
    "mapsQuery": "activity name destination city"
  }
]
Generate exactly: 8 free (tier: free), 6 budget (tier: budget), 4 splurge (tier: splurge). Prioritise free options including famous landmarks, parks, beaches, walking tours, viewpoints, and cultural sites that are free to visit.
Ensure all costs are realistic for the destination and currency.
Use these categories only: Culture & History 🏛️, Nature & Outdoors 🌿, Food & Dining 🍜, Shopping 🛍️, Entertainment 🎭, Wellness & Relaxation 🧘, Beach & Water 🏖️, Nightlife 🌃
Return nothing else. No markdown. No explanation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are Roamie, a friendly travel budget assistant. Give practical, specific, locally accurate recommendations. Never suggest generic tourist traps. Favour authentic experiences. Return only valid JSON with no markdown or code fences.",
          },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    console.log("Raw AI response:", content);

    content = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (parseErr) {
      // Try progressively trimming from the last complete object boundary
      let salvaged = false;
      // Find all potential object-end positions and try from the last one backwards
      const closingBraces: number[] = [];
      let inString = false;
      let escape = false;
      for (let i = 0; i < content.length; i++) {
        const ch = content[i];
        if (escape) { escape = false; continue; }
        if (ch === '\\') { escape = true; continue; }
        if (ch === '"') { inString = !inString; continue; }
        if (!inString && ch === '}') closingBraces.push(i);
      }
      // Try from last closing brace backwards until we get valid JSON
      for (let j = closingBraces.length - 1; j >= 0; j--) {
        try {
          const candidate = content.substring(0, closingBraces[j] + 1) + "]";
          const result = JSON.parse(candidate);
          if (Array.isArray(result) && result.length > 0) {
            parsed = result;
            salvaged = true;
            console.log(`Salvaged ${result.length} activities from truncated response`);
            break;
          }
        } catch { /* try next */ }
      }
      if (!salvaged) {
        throw new Error("Could not parse AI response as JSON");
      }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("activity-recommendations error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

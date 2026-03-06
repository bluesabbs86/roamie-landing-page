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

    const { destination, departure, checkIn, checkOut, nights, adults, children, nationality, currencyCode } = await req.json();

    const prompt = `Generate a comprehensive travel preparation checklist for this trip:
- Traveller nationality: ${nationality || "Not specified"}
- From: ${departure}
- To: ${destination}
- Dates: ${checkIn} to ${checkOut} (${nights} nights)
- Travellers: ${adults} adults, ${children} children

Return ONLY a JSON array of checklist items. Each item should have:
{
  "id": "unique_id",
  "category": "Documents" | "Health" | "Money" | "Packing" | "Bookings" | "Tech" | "Safety",
  "item": "Short task description",
  "details": "Specific advice with timeline (e.g. 'Apply at least 6 weeks before travel')",
  "priority": "essential" | "recommended" | "optional",
  "dueBeforeTrip": "6 weeks" | "4 weeks" | "2 weeks" | "1 week" | "1 day" | "day of"
}

Include these specific categories:
1. **Documents**: Passport validity (must be valid 6+ months after return, advise renewal timeline based on nationality), visa requirements for ${nationality || "general"} nationals visiting ${destination} (be specific about visa type, cost, processing time), travel insurance
2. **Health**: Required/recommended vaccinations for ${destination}, medications, health precautions
3. **Money**: Currency info for ${destination}, advise on exchange, cards, budget tips
4. **Packing**: Climate-appropriate items for ${destination} during the travel dates
5. **Bookings**: What to book in advance, airport transfers, local SIM cards
6. **Tech**: Plug adapters, offline maps, useful apps for ${destination}
7. **Safety**: Local safety tips, emergency numbers, embassy info

Generate 15-25 items. Be specific to the destination and nationality. No markdown, no code fences.`;

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
            content: "You are Roamie, a travel preparation expert. Give practical, specific, actionable checklist items. Be accurate about visa and passport requirements. Return only valid JSON array.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 6000,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const lastComplete = content.lastIndexOf("}");
      if (lastComplete > 0) {
        parsed = JSON.parse(content.substring(0, lastComplete + 1) + "]");
      } else {
        throw new Error("Could not parse AI response");
      }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("trip-checklist error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

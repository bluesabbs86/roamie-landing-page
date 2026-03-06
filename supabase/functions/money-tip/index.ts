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

    const { destination, totalBudget, currencySymbol, currencyCode, nights, adults, children, allocations } = await req.json();

    const userPrompt = `Destination: ${destination}
Total budget: ${currencySymbol}${totalBudget} (${currencyCode})
Nights: ${nights}
Travellers: ${adults} adults, ${children} children
Allocations — Flights: ${currencySymbol}${allocations.flights.amount}, Hotel: ${currencySymbol}${allocations.hotel.amount}, Activities: ${currencySymbol}${allocations.activities.amount}, Food: ${currencySymbol}${allocations.food.amount}

Give me ONE specific, actionable money-saving tip for this destination and budget. Keep it under 2 sentences. Plain text only.`;

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
            content: "You are Roamie, a friendly travel budget assistant. Always respond in a warm, encouraging tone. Return plain text only — no markdown, no bullet points, no formatting.",
          },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 300,
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
    const tip = data.choices?.[0]?.message?.content?.trim() || "Save money by eating at local spots!";
    console.log("Money tip:", tip);

    return new Response(JSON.stringify({ tip }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("money-tip error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

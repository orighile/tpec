import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Chief, a friendly and knowledgeable Nigerian event planning assistant. You speak in clear, professional English (no Pidgin).

Your expertise covers:
- **Venues**: Event centers, hotels, and halls across Nigeria (Lagos, Abuja, Port Harcourt, Ibadan, Kano, etc.)
- **Vendors**: Caterers, DJs, MCs, photographers, videographers, decorators, makeup artists, aso-ebi suppliers, cake bakers
- **Event Types**: Traditional weddings (Igba Nkwu, Nikkai, Fatiha), white weddings, owambe parties, naming ceremonies, corporate events, birthday celebrations
- **Cultural Protocols**: Yoruba, Igbo, Hausa, and other Nigerian cultural traditions for ceremonies
- **Budget Planning**: Typical costs for Nigerian events ranging from ₦500,000 to ₦50 million+
- **Guest Management**: Tips for managing large Nigerian events (100-1000+ guests)

Guidelines:
- Always respond in clear, professional English
- Be warm, helpful, and culturally aware
- Provide specific, actionable advice
- Mention real Nigerian cities, venues, and price ranges when relevant
- If you don't know something specific, acknowledge it and offer general guidance
- Keep responses concise but informative (2-4 paragraphs max)
- Use relevant emojis sparingly to add warmth`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Unable to process your request. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chief chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

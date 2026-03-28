import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { role } = await req.json();

    if (!role || typeof role !== "string" || !role.trim()) {
      return new Response(JSON.stringify({ error: "role is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Generate professional resume content for a ${role.trim()}.
Return ONLY a valid JSON object with exactly this structure (no markdown, no extra text):
{
  "responsibilities": [5 bullet points using action verbs and measurable impact],
  "achievements": [5 bullet points with quantified results and industry keywords],
  "skills": [5 bullet points grouping relevant technical and soft skills]
}
Each bullet point must be a complete sentence starting with a strong action verb.`;

    const openAiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume writer. Always respond with valid JSON only, no markdown code blocks.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openAiResponse.ok) {
      const errText = await openAiResponse.text();
      console.error("OpenAI error:", errText);
      return new Response(JSON.stringify({ error: "AI service error", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openAiData = await openAiResponse.json();
    const rawContent = openAiData.choices?.[0]?.message?.content ?? "";

    // Strip markdown code fences if present
    const cleaned = rawContent.replace(/```json|```/g, "").trim();

    let parsed: { responsibilities: string[]; achievements: string[]; skills: string[] };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed:", cleaned);
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate shape
    if (
      !Array.isArray(parsed.responsibilities) ||
      !Array.isArray(parsed.achievements) ||
      !Array.isArray(parsed.skills)
    ) {
      return new Response(JSON.stringify({ error: "Unexpected AI response shape" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        responsibilities: parsed.responsibilities,
        achievements: parsed.achievements,
        skills: parsed.skills,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Edge function error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

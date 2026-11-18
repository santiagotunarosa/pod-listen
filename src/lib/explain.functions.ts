import { createServerFn } from "@tanstack/react-start";

export const explainLine = createServerFn({ method: "POST" })
  .inputValidator((d: { line: string; level: number }) => {
    const line = String(d?.line ?? "").trim().slice(0, 1200);
    if (!line) throw new Error("Empty line");
    return { line, level: d?.level === 1 ? 1 : 0 };
  })
  .handler(async ({ data }) => {
    const key = process.env['LOVABLE_API_KEY'];
    if (!key) throw new Error("AI not configured");
    const prompt =
      "You help people with ADHD, dyslexia or other learning difficulties understand podcasts. " +
      (data.level === 1
        ? "Explain the line below EVEN MORE simply, in one short sentence a 12-year-old understands. "
        : "Explain the line below in plain, friendly words (max 2 short sentences, under 35 words). ") +
      "Then give one everyday comparison (under 20 words, no starting word like 'Like'). Also give a key idea of max 7 words. No jargon, no lists. Reply ONLY as JSON: {simple, like, key}.\n\nLine: \"" +
      data.line + "\"";
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-lite",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) throw new Error("AI error " + res.status);
    const j = await res.json();
    const txt: string = j?.choices?.[0]?.message?.content ?? "";
    const m = txt.match(/\{[\s\S]*\}/);
    const o = JSON.parse(m ? m[0] : txt);
    if (!o.simple || !o.like) throw new Error("Bad AI reply");
    return {
      simple: String(o.simple),
      like: String(o.like).replace(/^like\s+/i, ""),
      key: String(o.key || o.simple).slice(0, 80),
    };
  });

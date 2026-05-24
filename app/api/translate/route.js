/**
 * POST /api/translate
 *
 * Accepts an object of { fieldName: "English text" } pairs,
 * sends them to the Gemini API, and returns the Arabic translations.
 *
 * The GEMINI_API_KEY is kept exclusively on the server — it is never
 * exposed to the browser / Sanity Studio frontend.
 *
 * Request body:
 *   { "fields": { "title": "Hello", "description": "Some long text…" } }
 *
 * Response body:
 *   { "translations": { "title": "مرحبا", "description": "…" } }
 */

import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const MODEL = "gemini-2.0-flash";

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { fields } = body ?? {};
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return NextResponse.json(
      { error: "Body must contain a `fields` object." },
      { status: 400 },
    );
  }

  // Build a structured prompt so Gemini returns a valid JSON object.
  const fieldList = Object.entries(fields)
    .map(([key, value]) => `"${key}": ${JSON.stringify(value)}`)
    .join(",\n");

  const prompt = `
You are a professional translator specialised in Arabic software localisation.
Translate each value in the JSON object below from English to Modern Standard Arabic (فصحى).
Return ONLY a valid JSON object using the exact same keys.
Do NOT add explanations, markdown fences, or any text outside the JSON.

Input:
{
${fieldList}
}
`.trim();

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const raw = result.text.trim();

    // Strip accidental markdown fences if the model adds them.
    const jsonStr = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

    let translations;
    try {
      translations = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: "Gemini returned non-JSON output.", raw },
        { status: 502 },
      );
    }

    return NextResponse.json({ translations });
  } catch (err) {
    console.error("[/api/translate]", err);
    return NextResponse.json(
      { error: err.message ?? "Gemini API error." },
      { status: 502 },
    );
  }
}

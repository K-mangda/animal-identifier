import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { image, mimeType } = body;

    if (!image) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `
      You are an expert zoologist and wildlife biologist.
      Analyze the image carefully.

      If NO animal is present: {"is_animal": false, "candidates": []}

      If an animal IS present, identify the TOP 3 most likely species (most confident first).
      Respond ONLY with valid JSON — no markdown, no extra text:
      {
        "is_animal": true,
        "candidates": [
          {
            "common_name_en": "Common English name",
            "common_name_th": "ชื่อสามัญภาษาไทย",
            "scientific_name": "Genus species",
            "animal_class": "e.g. Mammalia, Aves, Reptilia",
            "habitat": "Primary natural habitat",
            "diet": "Diet type and main food sources",
            "confidence_percentage": 95,
            "conservation_status": "IUCN code only: LC, NT, VU, EN, CR, EW, or EX",
            "lifespan": "e.g. 10–15 years in the wild",
            "size_info": "e.g. Length: 1.4–2.8 m, Weight: 100–300 kg",
            "geographic_range": "Primary regions where this species lives",
            "fun_fact": "One fascinating, lesser-known fact about this species"
          },
          { ...second candidate... },
          { ...third candidate... }
        ]
      }
    `;

    const imagePart = {
      inlineData: {
        data: image,
        mimeType: (mimeType as string) || "image/jpeg",
      },
    };

    const geminiResult = await model.generateContent([prompt, imagePart]);
    const responseText = geminiResult.response.text();
    const clean = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(clean);
      return NextResponse.json(parsed);
    } catch {
      console.error("Failed to parse AI response:", responseText);
      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in identify route:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

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

      If an animal IS present, identify the single most likely species.
      Respond ONLY with valid JSON — no markdown, no extra text:
      {
        "is_animal": true,
        "candidates": [
          {
            "common_name_en": "Common English name",
            "common_name_th": "ชื่อสามัญภาษาไทย",
            "scientific_name": "Genus species",
            "animal_class": "e.g. Mammalia, Aves, Reptilia",
            "habitat_en": "Primary natural habitat",
            "habitat_th": "แหล่งที่อยู่อาศัยตามธรรมชาติ",
            "diet_en": "Diet type and main food sources",
            "diet_th": "ประเภทอาหารและแหล่งอาหารหลัก",
            "confidence_percentage": 95,
            "conservation_status": "IUCN code only: LC, NT, VU, EN, CR, EW, or EX",
            "conservation_details_en": "Why it has this status and primary threats",
            "conservation_details_th": "สาเหตุและภัยคุกคามหลัก",
            "lifespan_en": "e.g. 10–15 years in the wild",
            "lifespan_th": "เช่น 10-15 ปีในป่า",
            "geographic_range_en": "Primary regions where this species lives",
            "geographic_range_th": "ภูมิภาคหลักที่พบสายพันธุ์นี้",
            "physical_characteristics_en": "Detailed description of appearance, size, weight, and unique physical traits",
            "physical_characteristics_th": "ลักษณะรูปร่าง ขนาด น้ำหนัก และจุดเด่นทางกายภาพ",
            "behavior_en": "Social structure, hunting/foraging habits, and notable behaviors",
            "behavior_th": "โครงสร้างทางสังคม พฤติกรรมการหากิน และพฤติกรรมที่โดดเด่น",
            "ecological_role_en": "Importance of this species to its ecosystem",
            "ecological_role_th": "ความสำคัญของสายพันธุ์นี้ต่อระบบนิเวศ",
            "fun_fact_en": "One fascinating, lesser-known fact about this species",
            "fun_fact_th": "เกร็ดความรู้ที่น่าสนใจเกี่ยวกับสายพันธุ์นี้"
          }
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

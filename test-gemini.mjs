import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const envPath = path.resolve(".env.local");
let apiKey = "";
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf-8");
  const match = envFile.match(/GEMINI_API_KEY=(.*)/);
  if (match) {
    apiKey = match[1].trim();
  }
}

if (!apiKey) {
  console.error("No API key found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const modelsToTest = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro",
  "gemini-1.0-pro-vision-latest",
  "gemini-pro-vision",
  "gemini-1.0-pro"
];

async function testModels() {
  console.log("Testing Gemini Models...");
  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = "Hello";
      const result = await model.generateContent(prompt);
      console.log(`✅ [${modelName}]: Success`);
    } catch (e) {
      console.error(`❌ [${modelName}]: Failed - ${e.message}`);
    }
  }
}

testModels();

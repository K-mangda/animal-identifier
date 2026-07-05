import fs from "fs";
import path from "path";
import https from "https";

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
  console.error("No API key found");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.models) {
        console.log("Available models:");
        parsed.models.forEach(m => console.log(m.name));
      } else {
        console.log("Response:", parsed);
      }
    } catch(e) {
      console.log("Failed to parse:", data);
    }
  });
}).on("error", (err) => {
  console.error("Request error:", err.message);
});

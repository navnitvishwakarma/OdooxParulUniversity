import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Checking GEMINI_API_KEY...");

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

console.log("Key found, testing connection to gemini-1.5-flash...");

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Hello, say 'API is working' if you receive this.");
    const response = await result.response;
    console.log("Response from Gemini:", response.text());
    console.log("\nSuccess! Your Gemini API key is valid.");
  } catch (error: any) {
    console.error("\nFailed to connect to Gemini API:");
    console.error("Error Code:", error.code || "N/A");
    console.error("Message:", error.message);
    console.error("\nPlease check if your API key is correct and has access to the 'gemini-1.5-flash' model.");
  }
}

testGemini();

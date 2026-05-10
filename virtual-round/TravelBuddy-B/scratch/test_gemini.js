const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

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
    
    console.log("Listing models...");
    // const listResult = await genAI.listModels(); // This might not be available in all SDK versions
    // console.log("Models:", listResult);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log("Response from Gemini:", response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testGemini();

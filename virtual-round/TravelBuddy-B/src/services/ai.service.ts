import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
if (!process.env.GEMINI_API_KEY) {
  console.warn("[AI] Warning: GEMINI_API_KEY is not defined in .env");
} else {
  console.log("[AI] Gemini API Key loaded successfully");
}
console.log("[AI] Using model: gemini-1.5-flash");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getTripSuggestions = async (destination: string, days: number, preferences: string = "") => {
  const prompt = `
    Generate a detailed ${days}-day travel itinerary for ${destination}.
    Preferences: ${preferences}
    
    Please provide the response in a clean JSON format with the following structure:
    {
      "itinerary": [
        {
          "day": 1,
          "activities": [
            {
              "time": "morning/afternoon/evening",
              "name": "Activity Name",
              "description": "Short description",
              "type": "SIGHTSEEING/FOOD/ADVENTURE/CULTURE/NIGHTLIFE"
            }
          ]
        }
      ],
      "tips": ["Travel tip 1", "Travel tip 2"]
    }
    
    Only return the JSON object, nothing else.
  `;

  try {
    console.log(`[AI] Generating itinerary for ${destination} (${days} days)`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log(`[AI] Raw response from Gemini:`, text);
    
    // Extract JSON from the text (in case Gemini adds markdown backticks or extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("[AI] JSON Parse Error on matched content:", parseError);
        throw new Error("Failed to parse AI response");
      }
    }
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini AI Error:", error.message || error);
    let userMessage = "AI generation failed";
    
    if (error.message?.includes('404')) {
      userMessage = "AI Model not found. Please verify your GEMINI_API_KEY has access to 'gemini-1.5-flash' in Google AI Studio.";
    } else if (error.message?.includes('403')) {
      userMessage = "AI Access denied. Please check if your Gemini API key is valid and has billing enabled if required.";
    }
    
    throw new Error(userMessage);
  }
};

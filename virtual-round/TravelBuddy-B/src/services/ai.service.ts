import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
if (!process.env.GEMINI_API_KEY) {
  console.warn("[AI] Warning: GEMINI_API_KEY is not defined in .env");
} else {
  console.log("[AI] Gemini API Key loaded successfully");
}
const MODEL_NAME = "gemini-2.0-flash";
console.log(`[AI] Using model: ${MODEL_NAME}`);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

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

    if (error.message?.includes('429') || error.message?.includes('404')) {
      try {
        console.log('[AI] Retrying with fallback model: gemini-1.5-flash');
        const fallback = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result2 = await fallback.generateContent(prompt);
        const text2 = result2.response.text();
        const jsonMatch2 = text2.match(/\{[\s\S]*\}/);
        if (jsonMatch2) return JSON.parse(jsonMatch2[0]);
        return JSON.parse(text2);
      } catch (fallbackErr: any) {
        console.error('[AI] Fallback gemini-1.5-flash failed:', fallbackErr.message);
        
        try {
          console.log('[AI] Retrying with second fallback model: gemini-pro');
          const fallback2 = genAI.getGenerativeModel({ model: 'gemini-pro' });
          const result3 = await fallback2.generateContent(prompt);
          const text3 = result3.response.text();
          const jsonMatch3 = text3.match(/\{[\s\S]*\}/);
          if (jsonMatch3) return JSON.parse(jsonMatch3[0]);
          return JSON.parse(text3);
        } catch (fallbackErr2: any) {
           console.error('[AI] Second fallback gemini-pro failed:', fallbackErr2.message);
           userMessage = error.message?.includes('429') ? "AI quota exceeded. Please use a different API key." : `AI model unavailable. Error: ${fallbackErr2.message}`;
        }
      }
    } else if (error.message?.includes('403')) {
      userMessage = "AI Access denied. Please check if your Gemini API key is valid.";
    }

    throw new Error(userMessage);
  }
};

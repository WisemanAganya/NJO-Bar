import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getCocktailRecommendation(query: string) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return "The NJO Bar AI Consultant is currently offline. Please contact our human mixologists for expert advice.";
  }

  const prompt = `You are a world-class premium mixologist at NJO Bar. 
  A customer is asking for a drink recommendation. 
  Customer Query: "${query}"
  
  Provide a sophisticated, concise recommendation that includes:
  1. A name for a custom premium cocktail.
  2. The primary spirits and flavor profile.
  3. Why it fits their mood/event.
  
  Keep the tone elegant and professional. Limit to 3-4 sentences.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "Our mixologist AI is momentarily busy refining a recipe. Try asking about a specific spirit!";
  }
}

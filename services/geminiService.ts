
import { GoogleGenAI, Type } from "@google/genai";

export const getBusinessAdvice = async (data: any) => {
  // Always use a named parameter and direct process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze the following multi-branch business data and provide 3-4 actionable insights in Bengali and English.
    Data: ${JSON.stringify(data)}
    Focus on: Revenue trends, low stock alerts, and branch performance.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class business consultant specialized in retail management systems."
      }
    });
    // Use the .text property directly
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI insights currently unavailable. Please check your network connection.";
  }
};

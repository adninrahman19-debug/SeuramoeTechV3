
import { GoogleGenAI } from "@google/genai";

export const getBusinessInsights = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As a business analyst for SeuramoeTech, analyze this store data and provide 3 short, actionable insights for the Aceh/Sumatra tech market: ${JSON.stringify(data)}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this time.";
  }
};

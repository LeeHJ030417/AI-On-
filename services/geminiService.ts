import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

export const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateGuidance(contents: string, systemInstruction?: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
        topP: 0.95,
        topK: 64,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}

export async function checkForContradiction(text: string): Promise<{ isContradiction: boolean; reason: string }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following phrase for factual or logical contradictions. Phrase: "${text}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isContradiction: {
              type: Type.BOOLEAN,
              description: 'Whether the phrase contains a factual or logical contradiction.',
            },
            reason: {
              type: Type.STRING,
              description: 'A brief explanation if a contradiction is found. Empty string otherwise.',
            },
          },
          required: ['isContradiction', 'reason'],
        },
        temperature: 0.1,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error("Error checking for contradiction:", error);
    // Return a default value to avoid stopping the whole analysis on a single API failure.
    return { isContradiction: false, reason: "API call failed during analysis." };
  }
}

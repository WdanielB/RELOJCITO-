
import { GoogleGenAI, Type } from "@google/genai";
import { SystemStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSystemStatus = async (): Promise<SystemStatus> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a futuristic, cyberpunk 'system status' report. Keep it short (max 10 words). Mention things like neural links, quantum flux, or orbital sync.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            load: { type: Type.NUMBER },
            stability: { type: Type.STRING },
            neuralLink: { type: Type.STRING }
          },
          required: ["message", "load", "stability", "neuralLink"]
        }
      }
    });

    return JSON.parse(response.text.trim()) as SystemStatus;
  } catch (error) {
    console.error("Error fetching system status:", error);
    return {
      message: "SYSTEM ERROR: NEURAL LINK DEGRADED",
      load: 99.9,
      stability: "CRITICAL",
      neuralLink: "OFFLINE"
    };
  }
};

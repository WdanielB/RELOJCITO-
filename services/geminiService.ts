
import { GoogleGenAI, Type } from "@google/genai";
import { SystemStatus } from "../types";

export const getSystemStatus = async (): Promise<SystemStatus> => {
  try {
    // Comprobación de seguridad para evitar fallos si 'process' no está definido en el navegador
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    if (!apiKey) {
      throw new Error("API_KEY_NOT_FOUND");
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Genera un reporte de sistema futurista en rojo. Máximo 10 palabras. Temas: flujo de plasma, núcleo térmico, sincronía orbital.",
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
    console.warn("Estado de sistema en modo local/offline");
    return {
      message: "NÚCLEO TÉRMICO OPERATIVO",
      load: 42.5,
      stability: "ESTABLE",
      neuralLink: "SYNC_OK"
    };
  }
};

import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export const analyzeThreatWithAI = async ({ event, alert }) => {
  try {
    const prompt = `
You are an expert cybersecurity SOC analyst.

Analyze this security incident and return ONLY valid JSON.

Security Event:
- Event Type: ${event.eventType}
- Source IP: ${event.sourceIP}
- Message: ${event.message}
- Timestamp: ${event.timestamp}

Detected Alert:
- Alert Type: ${alert.alertType}
- Severity: ${alert.severity}
- Risk Score: ${alert.riskScore}
- Description: ${alert.description}

Return this exact JSON structure:

{
  "attackType": "string",
  "summary": "string",
  "evidence": ["string"],
  "potentialImpact": "string",
  "recommendedActions": ["string"],
  "confidence": 0
}

Rules:
- confidence must be a number from 0 to 100.
- Only use evidence present in the supplied data.
- Do not invent IP reputation, geolocation, user identity, or other facts.
- Keep the analysis concise and suitable for a SOC dashboard.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text;

    let analysis;

    try {
      analysis = JSON.parse(text);
    } catch {
      analysis = {
        attackType: alert.alertType,
        summary: text,
        evidence: [],
        potentialImpact: "Unable to structure the AI response.",
        recommendedActions: [],
        confidence: 0,
      };
    }

    return {
      success: true,
      analysis,
    };
  } catch (error) {
    console.error("AI threat analysis failed:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};
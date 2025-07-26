import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface CardRecognitionResult {
  name: string;
  set: string;
  cardNumber: string;
  condition: string;
  confidence: number;
  rarity?: string;
  type?: string;
}

export async function recognizeCard(base64Image: string): Promise<CardRecognitionResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert Pokemon card recognition AI. Analyze the provided Pokemon card image and extract the following information:
          - Card name (exact name as printed)
          - Set name (e.g., "Base Set", "Jungle", "Fossil", etc.)
          - Card number (e.g., "25/102")
          - Condition assessment (Mint, Near Mint, Excellent, Good, Fair, Poor)
          - Confidence level (0-1)
          - Rarity (if visible)
          - Type (if visible)
          
          Respond with JSON in this exact format: {
            "name": "card name",
            "set": "set name", 
            "cardNumber": "number/total",
            "condition": "condition",
            "confidence": 0.95,
            "rarity": "rare/uncommon/common",
            "type": "pokemon type"
          }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this Pokemon card and provide the recognition data in JSON format."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      name: result.name || "Unknown Card",
      set: result.set || "Unknown Set",
      cardNumber: result.cardNumber || "0/0",
      condition: result.condition || "Unknown",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      rarity: result.rarity,
      type: result.type
    };
  } catch (error) {
    console.error("Error recognizing card:", error);
    throw new Error("Failed to recognize card: " + (error as Error).message);
  }
}

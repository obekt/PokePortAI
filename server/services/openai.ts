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
          content: `You are an expert Pokemon card recognition AI. Carefully analyze the provided Pokemon card image and extract information ONLY if you can clearly see and read it. Be very strict about accuracy.

IMPORTANT RULES:
- Only identify cards you can clearly see and read the name from
- Set confidence to 0.95+ only if you're absolutely certain
- If any text is blurry, unclear, or you're guessing, set confidence below 0.6
- Focus on the card name printed at the top of the card
- Look for set symbols and numbers at the bottom right
- Assess condition based on visible wear, scratches, or damage

Extract the following information:
- Card name (EXACT name as printed on the card)
- Set name (look for set symbols or copyright text)
- Card number (bottom right corner, format like "25/102")
- Condition assessment (Mint, Near Mint, Excellent, Good, Fair, Poor)
- Confidence level (0.6-1.0, be conservative)
- Rarity symbol (circle=common, diamond=uncommon, star=rare)
- Pokemon type (if visible)

Respond with JSON in this exact format: {
  "name": "exact card name from image",
  "set": "set name or Unknown Set", 
  "cardNumber": "number/total or Unknown",
  "condition": "condition assessment",
  "confidence": 0.85,
  "rarity": "common/uncommon/rare",
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
    
    // Only return results with reasonable confidence
    if (!result.name || result.name.toLowerCase().includes('unknown') || !result.confidence || result.confidence < 0.6) {
      throw new Error("Could not identify the card clearly. Please ensure the card is well-lit, in focus, and the entire card is visible.");
    }
    
    return {
      name: result.name,
      set: result.set || "Unknown Set",
      cardNumber: result.cardNumber || "Unknown",
      condition: result.condition || "Near Mint",
      confidence: Math.max(0, Math.min(1, result.confidence)),
      rarity: result.rarity,
      type: result.type
    };
  } catch (error) {
    console.error("Error recognizing card:", error);
    throw new Error("Failed to recognize card: " + (error as Error).message);
  }
}

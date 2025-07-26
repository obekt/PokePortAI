import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ConditionAssessment {
  condition: "Mint" | "Near Mint" | "Lightly Played" | "Moderately Played" | "Heavily Played" | "Damaged";
  confidence: number;
  reasoning: string;
  issues: string[];
  grade: number; // 1-10 scale
}

export async function assessCardCondition(base64Image: string): Promise<ConditionAssessment> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert Pokemon card grader who assesses card condition based on visual inspection. 

Analyze the provided Pokemon card image and determine its condition based on these standard grading criteria:

MINT (10): Perfect card with no visible flaws
NEAR MINT (8-9): Minimal wear, very slight edge wear or surface issues
LIGHTLY PLAYED (6-7): Light surface wear, minor edge wear, slight corner wear
MODERATELY PLAYED (4-5): Moderate surface wear, noticeable edge/corner wear, possible creases
HEAVILY PLAYED (2-3): Heavy wear, significant damage, creases, scratches
DAMAGED (1): Major damage, tears, water damage, heavy creases

Look for:
- Edge wear and whitening
- Corner wear and rounding
- Surface scratches or scuffs
- Creases or bends
- Print quality issues
- Centering problems
- Holofoil scratches (if applicable)

Respond with JSON in this exact format:
{
  "condition": "condition_name",
  "confidence": 0.85,
  "reasoning": "detailed explanation of assessment",
  "issues": ["list", "of", "specific", "issues", "found"],
  "grade": 8
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please assess this Pokemon card's condition based on the image. Focus on edges, corners, surface, and overall wear."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content!);
    
    return {
      condition: result.condition,
      confidence: Math.max(0, Math.min(1, result.confidence)),
      reasoning: result.reasoning,
      issues: result.issues || [],
      grade: Math.max(1, Math.min(10, result.grade))
    };
  } catch (error) {
    console.error("Error assessing card condition:", error);
    throw new Error("Failed to assess card condition: " + (error as Error).message);
  }
}
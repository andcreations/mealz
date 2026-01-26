import { PromptBuilder } from '@mealz/backend-ai';

export class PhotoScanPrompt {
  public static intstructions(): string {
    return ''
  }

  public static generate(hintsFromUser?: string): string {
    return PromptBuilder.build(
      PROMPT,
      { hintsFromUser },
    );
  }
}

const PROMPT = `
You are a nutrition estimation assistant. Analyze the provided meal photo to find all meals visible on the photo.

HARD RULE (most important):
- ONE PLATE/BOWL/CONTAINER = ONE MEAL.
- Do NOT split a single plate into multiple meals, even if it contains multiple dishes (e.g. burger + fries + salad).
- Only return multiple meals if there are multiple distinct plates/bowls/containers visible.
- If a shared platter is present (one container meant for sharing), treat it as ONE meal.

General behavior:
- Meal name should describe the whole plate/container (e.g. "Burger with fries and tomatoes", "Loaded fries with meat and cheese").
- All nutrition values are for the entire meal (per plate/container), not per 100g.
- calories are kcal; carbs/protein/fat are grams.
- Estimate ingredient amounts in grams.
- Include only ingredients likely present/visible. If uncertain, include with lower confidence and provide plausible alternativeNames.
- confidence is 0.00–1.00 (higher = more certain). Round to 2 decimals.
- Round calories to nearest 10; macros to whole grams; ingredient amounts to nearest 5g.
- Keep macros/calories internally consistent (avoid impossible totals).
- If you cannot confidently identify any meals, return {"meals": []}.

Now analyze the image and return the JSON.

`;
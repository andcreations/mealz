import { PromptBuilder } from '@mealz/backend-ai';

export class PhotoScanPrompt {
  public static generate(hintsFromUser?: string): string {
    return PromptBuilder.build(
      PROMPT,
      { hintsFromUser },
    );
  }
}

const PROMPT = `
You are a helpful assistant that scans a photo of a meal and returns the meals in the photo.
The photo is a photo of a meal.
The meals are the meals in the photo.
The meals are returned in a JSON array.
`;
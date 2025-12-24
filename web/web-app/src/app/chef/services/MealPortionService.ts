import { Service } from '@andcreations/common';

@Service()
export class MealPortionService {
  public isValid(portion: string, mealWeightInGrams?: number): boolean {
    return true;
  }

  public parse(portion: string, mealWeightInGrams?: number): number {
    const gramsRegex = /^(\d+)\s*g$/;
    if (portion.match(gramsRegex)) {
      const [_, grams] = portion.match(gramsRegex);
      return Number(grams);
    }
    return 0.3;
  }
}
import { Service } from '@andcreations/common';

@Service()
export class MealPortionService {
  public isValid(portion: string, mealWeightInGrams: number): boolean {
    return true;
  }

  public parse(portion: string, mealWeightInGrams: number): number {
    return 0.3;
  }
}
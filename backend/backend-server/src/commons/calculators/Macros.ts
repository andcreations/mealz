import { Goal, CaloriesGoalFactor, CalculatedMacros, MacrosGoalFactors } from './types';
import { CaloriesPerMacros } from './CaloriesPerMacros';

export class Macros {
  public static calculate(
    tdee: number, // total daily energy expenditure
    goal: Goal,
  ): CalculatedMacros {
    const calories = tdee * CaloriesGoalFactor[goal];

    const { carbsFactor, proteinFactor } = MacrosGoalFactors[goal];
    const carbsInCalories = calories * carbsFactor;
    const proteinInCalories = calories * proteinFactor;
    const fatInCalories = calories - (carbsInCalories + proteinInCalories);

    const carbsInGrams = CaloriesPerMacros.carbsCaloriesToGrams(
      carbsInCalories,
    );
    const proteinInGrams = CaloriesPerMacros.proteinCaloriesToGrams(
      proteinInCalories,
    );
    const fatInGrams = CaloriesPerMacros.fatCaloriesToGrams(
      fatInCalories,
    );

    return {
      calories,
      carbsInGrams,
      proteinInGrams,
      fatInGrams,
    };
  }
}

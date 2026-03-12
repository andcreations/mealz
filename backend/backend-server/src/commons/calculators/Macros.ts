import { Goal, CaloriesGoalFactor, CalculatedMacros, MacrosGoalFactors } from './types';
import { CaloriesPerMacros } from './CaloriesPerMacros';

export class Macros {
  public static calculateForCalories(
    calories: number,
    goal: Goal,
  ): CalculatedMacros {
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

  public static calculateForTDEE(
    tdee: number, // total daily energy expenditure
    goal: Goal,
  ): CalculatedMacros {
    const calories = tdee * CaloriesGoalFactor[goal];
    return Macros.calculateForCalories(calories, goal);
  }
}

// console.log('------------------------------------------------------------')
// console.log(Macros.calculateForTDEE(1000, Goal.LoseWeight));

// const m1 = Macros.calculateForCalories(400, Goal.LoseWeight);
// const m2 = Macros.calculateForCalories(430, Goal.LoseWeight);
// console.log(m1);
// console.log(m2);
// console.log({
//   carbs: m1.carbsInGrams + m2.carbsInGrams,
//   protein: m1.proteinInGrams + m2.proteinInGrams,
//   fat: m1.fatInGrams + m2.fatInGrams,
// })

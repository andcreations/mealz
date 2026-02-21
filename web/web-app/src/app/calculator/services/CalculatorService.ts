import { Service } from '@andcreations/common';
import { 
  MifflinStJeor, 
  TotalDailyEnergyExpenditure,
  Macros,
} from '@mealz/backend-calculators';

import { CalculatorSettings, CalculatorResult } from '../types';

@Service()
export class CalculatorService {
  public calculate(settings: CalculatorSettings): CalculatorResult {
    const bmr = MifflinStJeor.calculateBMR(
      settings.sex,
      settings.age,
      settings.height,
      settings.weight,
    );
    const tdee = TotalDailyEnergyExpenditure.calculateTDEE(
      bmr,
      settings.activityLevel,
    );
    const macros = Macros.calculate(
      tdee,
      settings.goal,
    );
    return {
      bmr,
      macros: {
        calories: macros.calories,
        carbs: macros.carbsInGrams,
        protein: macros.proteinInGrams,
        fat: macros.fatInGrams,
      },
    };
  }
}
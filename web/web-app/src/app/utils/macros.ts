import { truncateNumber } from '@mealz/backend-shared';
import { CaloriesPerMacros } from '@mealz/backend-calculators';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';

import { MacrosSummaryDetails } from '../components';

export interface MacrosPercents {
  carbs: number;
  protein: number;
  fat: number;
}

export function calculateMacrosPercents(
  macros?: Pick<GWMacros, 'carbs' | 'protein' | 'fat'>
): MacrosPercents {
  const totalGrams = macros.carbs + macros.protein + macros.fat;
  const percent = (grams: number) => {
    return truncateNumber(grams * 100 / totalGrams);
  }

  const carbs = percent(macros.carbs);
  const protein = percent(macros.protein);

  return {
    carbs,
    protein,
    fat: 100 - (carbs + protein),
  }
}

export function macrosToSummaryDetails(
  macros?: Pick<GWMacros, 'carbs' | 'protein' | 'fat'>
): MacrosSummaryDetails {
  if (!macros) {
    return {};
  }

  const percents = calculateMacrosPercents(macros);
  return {
    carbs: `${percents.carbs}%`,
    protein: `${percents.protein}%`,
    fat: `${percents.fat}%`,
  };
}

export function calculateMacrosFromTotalCalories(
  totalCalories: number,
  percents: MacrosPercents,
): Pick<GWMacros, 'carbs' | 'protein' | 'fat'> {
  const calories = (percent: number) => {
    return totalCalories * percent / 100;
  }
  const carbsCalories = calories(percents.carbs);
  const proteinCalories = calories(percents.protein);
  const fatCalories = calories(percents.fat);

  return {
    carbs: truncateNumber(
      CaloriesPerMacros.carbsCaloriesToGrams(carbsCalories),
    ),
    protein: truncateNumber(
      CaloriesPerMacros.proteinCaloriesToGrams(proteinCalories),
    ),
    fat: truncateNumber(
      CaloriesPerMacros.fatCaloriesToGrams(fatCalories),
    ),
  }
}
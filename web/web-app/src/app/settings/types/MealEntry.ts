import { parsePositiveInteger } from '../../utils';

export interface MealGoals<T = number> {
  calories: T;
  caloriesMargin: T;
  carbs: T;
  carbsMargin: T;
  protein: T;
  proteinMargin: T;
  fat: T;
  fatMargin: T;
}

export interface MealEntry<TGoals = number> {
  id: string;
  startHour: number;
  startMinute: number;
  mealName: string;
  goals: MealGoals<TGoals>;
}

export function mealEntryMinute(entry: MealEntry<unknown>): number {
  return entry.startHour * 60 + entry.startMinute;
}

export function cloneMealEntry<T>(entry: MealEntry<T>): MealEntry<T> {
  return {
    id: entry.id,
    startHour: entry.startHour,
    startMinute: entry.startMinute,
    mealName: entry.mealName,
    goals: {
      calories: entry.goals.calories,
      caloriesMargin: entry.goals.caloriesMargin,
      carbs: entry.goals.carbs,
      carbsMargin: entry.goals.carbsMargin,
      protein: entry.goals.protein,
      proteinMargin: entry.goals.proteinMargin,
      fat: entry.goals.fat,
      fatMargin: entry.goals.fatMargin,
    },
  };
}

export function mealEntryToNumbers(entry: MealEntry<string>): MealEntry<number> {
  return {
    id: entry.id,
    startHour: entry.startHour,
    startMinute: entry.startMinute,
    mealName: entry.mealName,
    goals: {
      calories: parsePositiveInteger(entry.goals.calories),
      caloriesMargin: parsePositiveInteger(entry.goals.caloriesMargin),
      carbs: parsePositiveInteger(entry.goals.carbs),
      carbsMargin: parsePositiveInteger(entry.goals.carbsMargin),
      protein: parsePositiveInteger(entry.goals.protein),
      proteinMargin: parsePositiveInteger(entry.goals.proteinMargin),
      fat: parsePositiveInteger(entry.goals.fat),
      fatMargin: parsePositiveInteger(entry.goals.fatMargin),
    },
  };
}
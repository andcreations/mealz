export interface MealGoals {
  calories: number;
  caloriesMargin: number;
  carbs: number;
  carbsMargin: number;
  protein: number;
  proteinMargin: number;
  fat: number;
  fatMargin: number;
}

export interface MealEntry {
  id: string;
  startHour: number;
  startMinute: number;
  mealName: string;
  goals: MealGoals;
}

export function mealEntryMinute(entry: MealEntry): number {
  return entry.startHour * 60 + entry.startMinute;
}

export function cloneMealEntry(entry: MealEntry): MealEntry {
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
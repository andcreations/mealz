export interface GWAdHocIngredient {
  // Ingredient name
  name: string;

  // Calories per 100 grams/milliliters
  caloriesPer100: number;  

  // Carbs per 100 grams/milliliters
  carbsPer100?: number;

  // Fat per 100 grams/milliliters
  fatPer100?: number;

  // Protein per 100 grams/milliliters
  proteinPer100?: number;
}
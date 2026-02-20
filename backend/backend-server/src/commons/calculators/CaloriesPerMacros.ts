export class CaloriesPerMacros {
  // Calories per gram of carbs/protein/fat
  private static readonly Carbs = 4;
  private static readonly Protein = 4;
  private static readonly Fat = 9;

  public static carbsCaloriesToGrams(calories: number): number {
    return calories / CaloriesPerMacros.Carbs;
  }

  public static proteinCaloriesToGrams(calories: number): number {
    return calories / CaloriesPerMacros.Protein;
  }

  public static fatCaloriesToGrams(calories: number): number {
    return calories / CaloriesPerMacros.Fat;
  }
}
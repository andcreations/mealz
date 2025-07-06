export enum FactId {
  Calories = 'calories',
  Carbs = 'carbs',
  Sugars = 'sugars',
  Protein = 'protein',
  TotalFat = 'total_fat',
  SaturatedFat = 'saturated_fat',
  MonounsaturatedFat = 'monounsaturated_fat',
  PolyunsaturatedFat = 'polyunsaturated_fat',
  TransFat = 'trans_fat',
}

export enum FactUnit {
  Kcal = 'kcal',
  Grams = 'g',
}

export class FactPer100 {
  // Fact identifier
  public id: FactId;

  // Unit of the fact
  public unit: FactUnit;

  // Amount of the fact per 100 units
  public amount: number;
}
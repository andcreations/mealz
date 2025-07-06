export enum GWFactId {
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

export enum GWFactUnit {
  Kcal = 'kcal',
  Grams = 'g',
}

export class GWFactPer100 {
  // Fact identifier
  public id: GWFactId;

  // Unit of the fact
  public unit: GWFactUnit;

  // Amount of the fact per 100 units
  public amount: number;
}
import { IsEnum, IsNumber } from 'class-validator';

export enum FactIdV1 {
  Calories = 0,
  Carbs = 1,
  Sugars = 2,
  Protein = 3,
  TotalFat = 4,
  SaturatedFat = 5,
  MonounsaturatedFat = 6,
  PolyunsaturatedFat = 7,
  TransFat = 8,
}

export enum FactUnitV1 {
  Kcal = 0,
  Grams = 1,
}

export class FactPer100V1 {
  // Fact identifier
  @IsEnum(FactIdV1)
  public id: FactIdV1;

  // Unit of the fact
  @IsEnum(FactUnitV1)
  public unit: FactUnitV1;

  // Amount of the fact per 100 units
  @IsNumber()
  public amount: number;
}
// See IngredientDetailsV1Pb.proto

export enum IngredientTypeV1Pb {
  GENERIC = 0,
  PRODUCT = 1,
}

export enum FactIdV1Pb {
  CALORIES = 0,
  CARBS = 1,
  SUGARS = 2,
  PROTEIN = 3,
  TOTAL_FAT = 4,
  SATURATED_FAT = 5,
  MONOUNSATURATED_FAT = 6,
  POLYUNSATURATED_FAT = 7,
  TRANS_FAT = 8,
}

export enum FactUnitV1Pb {
  KCAL = 0,
  GRAMS = 1,
}

export interface FactPer100V1Pb {
  id: FactIdV1Pb;
  unit: FactUnitV1Pb;
  amount: number;
}

export interface ProductV1Pb {
  brand: string;
}

export interface IngredientDetailsV1Pb {
  name: Record<string, string>;
  type: IngredientTypeV1Pb;
  facts: FactPer100V1Pb[];
  product?: ProductV1Pb;
}
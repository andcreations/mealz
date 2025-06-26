import { readUSDAData } from './usda-csv';
import { FoodNutrient } from './usda-types';

// See IngredientDetailsV1.proto
enum FactId {
  Calories = 0,
  Carbs = 1,
  Sugars = 2,
  Protein = 3,
  TotalFat = 4,
  SaturatedFat = 5,
  MonounsaturatedFat = 6,
  PolyunsaturatedFat = 7,
  TransFat = 8
}

enum FactUnit {
  Kcal = 0,
  Grams = 1,
}

interface FactPer100 {
  id: FactId;
  unit: FactUnit;
  amount: number;
}

const NUTRIENTS_TO_FACTS: Record<string, FactPer100> = {
  '1008': {
    id: FactId.Calories,
    unit: FactUnit.Kcal,
    amount: -1,
  },
  '1005': {
    id: FactId.Carbs,
    unit: FactUnit.Grams,
    amount: -1,
  },
  '2000': {
    id: FactId.Sugars,
    unit: FactUnit.Grams,
    amount: -1,
  },
  '1003': {
    id: FactId.Protein,
    unit: FactUnit.Grams,
    amount: -1,
  },
  '1004': {
    id: FactId.TotalFat,
    unit: FactUnit.Grams,
    amount: -1,
  },
  '1258': {
    id: FactId.SaturatedFat,
    unit: FactUnit.Grams,
    amount: -1,
  },
  '1292': {
    id: FactId.MonounsaturatedFat,
    unit: FactUnit.Grams,
    amount: -1,
  },
  '1293': {
    id: FactId.PolyunsaturatedFat,  
    unit: FactUnit.Grams,
    amount: -1,
  },
  '1257': {
    id: FactId.TransFat,
    unit: FactUnit.Grams,
    amount: -1,
  },
};

/*
1008: 'calories_per_100g',
1005: 'carbs_per_100g',
2000: 'sugars_per_100g',
1003: 'protein_per_100g',
1004: 'total_fat_per_100g',
1258: 'saturated_fat_per_100g',
1292: 'monounsaturated_fat_per_100g',
1293: 'polyunsaturated_fat_per_100g',
1257: 'trans_fat_per_100g'
*/

function toDetails(): any {

}

export async function run(): Promise<void> {
  const usda = await readUSDAData(
    './data/FoodData_Central_sr_legacy_food_csv_2018-04'
  );

  const foodNutrientsByFdcId: Record<string, FoodNutrient[]> = {};
  usda.foodNutrients.forEach((foodNutrient) => {
    foodNutrientsByFdcId[foodNutrient.fdc_id] =
      foodNutrientsByFdcId[foodNutrient.fdc_id] || [];
    foodNutrientsByFdcId[foodNutrient.fdc_id].push(foodNutrient);
  });

  const getFacts = (fdc_id: string): FactPer100[] => {
    const nutrients = foodNutrientsByFdcId[fdc_id];
    if (!nutrients) {
      return [];
    }

    return nutrients
      .map((nutrient) => {
        const fact = NUTRIENTS_TO_FACTS[nutrient.nutrient_id];
        if (!fact) {
          return;
        }
        return {
          ...fact,
          amount: parseFloat(nutrient.amount),
        };
      })
      .filter(Boolean);
  };

  const details: any[] = [];
  for (const food of usda.foods) {
    const facts = getFacts(food.fdc_id);
    const foodDetails = {
      name: {
        en: food.description,
      },
      type: 0,
      facts,
    };
    details.push(foodDetails);
  }
  console.log(JSON.stringify(details, null, 2));
}

run().catch(console.error);
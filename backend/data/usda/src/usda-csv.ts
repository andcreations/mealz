import * as path from 'path';
import { readCSV } from './csv';
import { Food, FoodNutrient, Nutrient, USDAData } from './usda-types';

export async function readUSDAData(dir: string): Promise<USDAData> {
  const read = async <T>(filename: string) => {
    const csv = await readCSV<T>(path.join(dir, filename));
    return csv.rows;
  };

  return {
    foods: await read<Food>('food.csv'),
    nutrients: await read<Nutrient>('nutrient.csv'),
    foodNutrients: await read<FoodNutrient>('food_nutrient.csv'),
  };
}
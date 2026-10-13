import * as fs from 'fs';
import { Colors, Log } from './log';

export async function loadIngredients(filename: string): Promise<any> {
  if (!fs.existsSync(filename)) {
    throw new Error(`File ${filename} does not exist`);
  }

  Log.info(`Loading ingredients from ${Colors.cyan(filename)}`);
  const json = fs.readFileSync(filename, 'utf8');
  const ingredients = JSON.parse(json);
  return ingredients;
}

export function getIngredientName(ingredient: any): string {
  if (!ingredient.name) {
    return '?';
  }
  if (ingredient.name.en) {
    return ingredient.name.en;
  }
  return Object.keys(ingredient.name)[0] ?? '?';
}

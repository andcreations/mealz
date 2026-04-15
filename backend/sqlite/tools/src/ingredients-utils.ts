import * as fs from 'fs';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { IngredientDetailsV1 } from './ingredients';
import { TypeValidationError } from './common';
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

function validateIngredient(ingredient: any): TypeValidationError[] {
  if (typeof ingredient !== 'object') {
    return [
      {
        error: 'Ingredient must be an object',
      }
    ];
  }
  if (Array.isArray(ingredient)) {
    return [
      {
        error: 'Ingredient must be an object while it is an array',
      }
    ];
  }

  const errors: TypeValidationError[] = [];
  const ingredientInstance = plainToInstance(IngredientDetailsV1, ingredient);

  const validationErrors = validateSync(ingredientInstance);
  if (validationErrors.length > 0) {
    const typeValidationErrors = TypeValidationError.fromValidationErrors(
      validationErrors,
    );
    errors.push(...typeValidationErrors);
  }

  return errors;
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

export async function validateIngredients(ingredients: any): Promise<void> {
  if (!Array.isArray(ingredients)) {
    throw new Error('Ingredients must be an array');
  }

  const invalidIndexes: number[] = [];
  for (let index = 0; index < ingredients.length; index++) {
    const ingredient = ingredients[index];
    const errors = validateIngredient(ingredient);
    if (errors.length > 0) {
      const name = getIngredientName(ingredient);
      Log.error(
        `Invalid ingredient at index ${Colors.yellow(index.toString())} ` +
        `with name ${Colors.yellow(name) }`,
        TypeValidationError.buildMessage(errors),
      );
      invalidIndexes.push(index);
    }
  }

  if (invalidIndexes.length > 0) {
    throw new Error(`Invalid ingredients`);
  }
}
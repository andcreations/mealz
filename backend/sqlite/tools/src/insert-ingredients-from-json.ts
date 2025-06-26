import * as fs from 'fs';
import * as protobufjs from 'protobufjs';

import { Colors, errorToMessage, Log } from './log';
import { backendSrc, generateId } from './common';
import { listRequiredFields, loadProtobuf } from './protobuf';
import { SQLiteDB } from './sqlite';

interface Error {
  message: string;
}

async function loadIngredients(filename: string): Promise<any> {
  if (!fs.existsSync(filename)) {
    throw new Error(`File ${filename} does not exist`);
  }

  Log.info(`Loading ingredients from ${Colors.cyan(filename)}`);
  const json = fs.readFileSync(filename, 'utf8');
  const ingredients = JSON.parse(json);
  return ingredients;
}

function validateIngredient(
  ingredient: any,
  detailsPb: protobufjs.Type,
): Error[] {
  if (typeof ingredient !== 'object') {
    return [
      {
        message: 'Ingredient must be an object',
      }
    ];
  }
  if (Array.isArray(ingredient)) {
    return [
      {
        message: 'Ingredient must be an object while it is an array',
      }
    ];
  }
  const errors: Error[] = [];

  const requiredFields = listRequiredFields(detailsPb);
  const missingFields: string[] = [];
  for (const field of requiredFields) {
    if (ingredient[field] == null) {
      missingFields.push(field);
    }
  }
  if (missingFields.length > 0) {
    errors.push({
      message: `${missingFields.join(', ')}: missing or null field(s)`,
    });
  }

  const protobufError = detailsPb.verify(ingredient);
  if (protobufError) {
    errors.push({
      message: protobufError,
    });
  }

  return errors;
}

function getIngredientName(ingredient: any): string {
  return ingredient.name ?? '?';
}

async function validateIngredients(
  ingredients: any,
  detailsPb: protobufjs.Type,
): Promise<void> {
  if (!Array.isArray(ingredients)) {
    throw new Error('Ingredients must be an array');
  }

  const invalidIndexes: number[] = [];
  for (let index = 0; index < ingredients.length; index++) {
    const ingredient = ingredients[index];
    const errors = validateIngredient(ingredient, detailsPb);
    if (errors.length > 0) {
      const name = getIngredientName(ingredient);
      Log.error(
        `Invalid ingredient at index ${Colors.yellow(index.toString())} ` +
        `with name ${Colors.yellow(name) }`,
        errors.map(error => `  ${error.message}`).join('\n'),
      );
      invalidIndexes.push(index);
    }
  }

  if (invalidIndexes.length > 0) {
    throw new Error(`Invalid ingredients`);
  }
}

async function insertIngredients(
  db: SQLiteDB,
  ingredients: any,
  detailsPb: protobufjs.Type,
  detailsVersion: number,
  overwrite = false,
): Promise<void> {
  for (const ingredient of ingredients) {
    const existing = await db.select<{ id: number }>(
      'SELECT id FROM Ingredients WHERE name = ?',
      [ingredient.name],
    );
    if (existing.length > 0 && !overwrite) {
      Log.info(`Skipping ingredient ${Colors.yellow(ingredient.name)}`);
      continue;
    }
    const id = generateId();
    const detailsBuffer = detailsPb.encode(ingredient).finish();

    if (existing.length > 0) {
      Log.info(`Deleting existing ingredient ${Colors.yellow(ingredient.name)}`);
      await db.run(
        'DELETE FROM Ingredients WHERE name = ?',
        [ingredient.name],
      );
    }

    Log.info(`Inserting ingredient ${Colors.yellow(ingredient.name)}`);
    await db.run(
      'INSERT INTO Ingredients (id, name, detailsVersion,details) ' +
      'VALUES (?, ?, ?, ?)',
      [id, ingredient.name, detailsVersion, detailsBuffer],
    );
  }
}

async function run(): Promise<void> {
  if (process.argv.length < 3) {
    Log.error('Re-run with arguments [db-file] [json-file]');
    process.exit(1);
  }
  const dbFilename = process.argv[2];
  const jsonFilename = process.argv[3];

  const detailsVersion = 1;
// load protobuf
  const detailsPb = loadProtobuf(
    backendSrc(
      'domains/ingredients/common/protobuf/IngredientDetailsV1.proto'
    ),
    'mealz.ingredients',
    'IngredientDetailsV1',
  );

// load & validate
  const ingredients = await loadIngredients(jsonFilename);
  await validateIngredients(ingredients, detailsPb);

// insert
  const db = await SQLiteDB.open(dbFilename);
  await insertIngredients(db, ingredients, detailsPb, detailsVersion, true);
  await db.close();
}

run().catch(error => {
  const message = errorToMessage(error);
  Log.error('Failed to insert ingredients from JSON', '  ' + message);
});

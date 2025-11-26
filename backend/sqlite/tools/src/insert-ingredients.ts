import 'reflect-metadata';
import * as fs from 'fs';
import { encode, decode } from '@msgpack/msgpack';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { IngredientDetailsV1 } from './ingredients';

import { Colors, Log } from './log';
import { generateId, TypeValidationError } from './common';
import { SQLiteDB } from './sqlite';

interface DBIngredient {
  id: string;
  name: Record<string, string>;
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

function getIngredientName(ingredient: any): string {
  if (!ingredient.name) {
    return '?';
  }
  if (ingredient.name.en) {
    return ingredient.name.en;
  }
  return Object.keys(ingredient.name)[0] ?? '?';
}

async function validateIngredients(ingredients: any): Promise<void> {
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

async function readAllIngredientsFromDB(db: SQLiteDB): Promise<DBIngredient[]> {
  const ingredients: DBIngredient[] = [];
  const limit = 100;

  let lastId: string | undefined = undefined;
  while (true) {
    // read
    let where: string = '';
    if (lastId) {
      where = `WHERE id > '${lastId}'`;
    }
    const query = `SELECT id, details FROM ingredients ${where} LIMIT ${limit}`;
    const rows = await db.select<any>(query, []);

    // keep
    rows.forEach(row => {
      const details = decode(row.details) as IngredientDetailsV1;
      ingredients.push({
        id: row.id,
        name: details.name,
      });
    });

    // go next
    if (rows.length < limit) {
      break;
    }
    lastId = rows[rows.length - 1].id;
  }
  return ingredients;
}

async function insertIngredients(
  db: SQLiteDB,
  ingredients: any,
  detailsVersion: number,
  overwrite = false,
): Promise<void> {
  const dbIngredients = await readAllIngredientsFromDB(db);

  for (const ingredient of ingredients) {
    // find existing
    const existingInDb = dbIngredients.filter(dbIngredient => {
      const dbNames = Object.values(dbIngredient.name);
      const names = Object.values(ingredient.name);
      return dbNames.some(dbName => names.includes(dbName));
    });

    // skip existing
    if (existingInDb.length > 0 && !overwrite) {
      const name = getIngredientName(ingredient);
      Log.info(`Skipping ingredient ${Colors.yellow(name)}`);
      continue;
    }

    // delete existing
    if (existingInDb.length > 0 && overwrite) {
      for (const existing of existingInDb) {
        const name = getIngredientName(existing);
        Log.info(
          `Deleting existing ingredient ${Colors.yellow(name)}` +
          ` ${Colors.gray('(' + existing.id + ')')}`
        );
        await db.run(
          'DELETE FROM ingredients WHERE id = ?',
          [existing.id],
        );
      }
    }

    // insert new
    const id = existingInDb.length > 0 ? existingInDb[0].id : generateId();
    const detailsBuffer = encode(ingredient);
    const name = getIngredientName(ingredient);

    // insert
    Log.info(
      `Inserting ingredient ${Colors.yellow(name)}` +
      ` ${Colors.gray('(' + id + ')')}`
    );
    await db.run(
      'INSERT INTO ingredients (id, details_version, details) ' +
      'VALUES (?, ?, ?)',
      [id, detailsVersion, detailsBuffer],
    );
  }
}

export async function insertIngredientsFromJSON(
  db: SQLiteDB,
  jsonFilename: string,
): Promise<void> {
  const detailsVersion = 1;

// load & validate
  const ingredients = await loadIngredients(jsonFilename);
  await validateIngredients(ingredients);

// insert
  await insertIngredients(db, ingredients, detailsVersion, true);
}

async function run(): Promise<void> {
  if (process.argv.length < 4) {
    Log.error('Re-run with arguments: [db-file] [json-file]');
    process.exit(1);
  }
  const dbFilename = process.argv[2];
  const jsonFilename = process.argv[3];

  const db = await SQLiteDB.open(dbFilename);
  await insertIngredientsFromJSON(db, jsonFilename);
  await db.close();
}

if (require.main === module) {
  run().catch(error => {
    Log.error('Failed to insert ingredients from JSON', error);
    process.exit(1);
  });
}


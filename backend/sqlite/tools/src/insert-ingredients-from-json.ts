import * as fs from 'fs';
import * as protobufjs from 'protobufjs';

import { Colors, errorToMessage, Log } from './log';
import { backendSrc, generateId } from './common';
import { listRequiredFields, loadProtobuf } from './protobuf';
import { SQLiteDB } from './sqlite';

interface Error {
  message: string;
}

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
  if (!ingredient.name) {
    return '?';
  }
  if (ingredient.name.en) {
    return ingredient.name.en;
  }
  return Object.keys(ingredient.name)[0] ?? '?';
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

async function readAllIngredientsFromDB(
  db: SQLiteDB,
  detailsPb: protobufjs.Type,
): Promise<DBIngredient[]> {
  const ingredients: DBIngredient[] = [];
  const limit = 100;

  let lastId: string | undefined = undefined;
  while (true) {
    // read
    let where: string = '';
    if (lastId) {
      where = `WHERE id > '${lastId}'`;
    }
    const query = `SELECT id, details FROM Ingredients ${where} LIMIT ${limit}`;
    const rows = await db.select<any>(query, []);

    // keep
    rows.forEach(row => {
      const details = detailsPb.toObject(detailsPb.decode(row.details));
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
  detailsPb: protobufjs.Type,
  detailsVersion: number,
  overwrite = false,
): Promise<void> {
  const dbIngredients = await readAllIngredientsFromDB(db, detailsPb);

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
          'DELETE FROM Ingredients WHERE id = ?',
          [existing.id],
        );
      }
    }

    // insert new
    const id = existingInDb.length > 0 ? existingInDb[0].id : generateId();
    const detailsBuffer = detailsPb.encode(ingredient).finish();
    const name = getIngredientName(ingredient);

    // insert
    Log.info(
      `Inserting ingredient ${Colors.yellow(name)}` +
      ` ${Colors.gray('(' + id + ')')}`
    );
    await db.run(
      'INSERT INTO Ingredients (id, detailsVersion, details) ' +
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
// load protobuf
  const detailsPb = loadProtobuf(
    backendSrc(
      'domains/ingredients/common/protobuf/IngredientDetailsV1Pb.proto'
    ),
    'mealz.ingredients',
    'IngredientDetailsV1',
  );

// load & validate
  const ingredients = await loadIngredients(jsonFilename);
  await validateIngredients(ingredients, detailsPb);

// insert
  await insertIngredients(db, ingredients, detailsPb, detailsVersion, true);
}

async function run(): Promise<void> {
  if (process.argv.length < 3) {
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
    const message = errorToMessage(error);
    Log.error('Failed to insert ingredients from JSON', '  ' + message);
    process.exit(1);
  });
}


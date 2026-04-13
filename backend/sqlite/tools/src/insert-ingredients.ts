import 'reflect-metadata';
import { IngredientDetailsV1 } from './ingredients';
import { Colors, Log } from './log';
import { generateId } from './common';
import { SQLiteDB } from './sqlite';
import {
  getIngredientName,
  loadIngredients,
  validateIngredients,
} from './ingredients-utils';

interface DBIngredient {
  id: string;
  name: Record<string, string>;
}

function encode(value: any): Buffer {
  return Buffer.from(JSON.stringify(value));
}

function decode<T>(buffer: Buffer): T {
  return JSON.parse(buffer.toString()) as T;
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
    const query =
      `SELECT id, details ` +
      `FROM ingredients ${where} ` +
      `ORDER BY id ASC ` +
      `LIMIT ${limit}`;
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


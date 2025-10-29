import * as path from 'path';
import * as fs from 'fs';

import { backendPath } from './common';
import { Colors, Log } from './log';
import { SQLiteDB } from './sqlite';
import { insertIngredientsFromJSON } from './insert-ingredients-from-json';

let databasesDir: string;

async function openDB(dbFilename: string): Promise<SQLiteDB> {
  if (fs.existsSync(dbFilename)) {
    Log.info(`Deleting DB ${Colors.red(dbFilename)}`);
    fs.unlinkSync(dbFilename);
  }
  return await SQLiteDB.open(dbFilename);
}

async function prepareUsersDB(): Promise<void> {
  const dbFilename = path.join(databasesDir, 'users.sqlite');
  Log.info(`Creating DB ${dbFilename}`);

  const db = await openDB(dbFilename);
  await db.runScriptsFromDirectory(backendPath('sqlite/users'));
  await db.close();
}

async function prepareIngredientsDB(): Promise<void> {
  const dbFilename = path.join(databasesDir, 'ingredients.sqlite');
  Log.info(`Creating DB ${dbFilename}`);

  const db = await openDB(dbFilename);
  await db.runScriptsFromDirectory(backendPath('sqlite/ingredients'));
  await insertIngredientsFromJSON(
    db,
    backendPath('sqlite/ingredients/ingredients.json'),
  );
  await db.close();
}

async function prepareMealsDB(): Promise<void> {
  const dbFilename = path.join(databasesDir, 'meals.sqlite');
  Log.info(`Creating DB ${dbFilename}`);

  const db = await openDB(dbFilename);
  await db.runScriptsFromDirectory(backendPath('sqlite/meals'));
  await db.close();
}

async function prepareMealsUserDB(): Promise<void> {
  const dbFilename = path.join(databasesDir, 'meals-user.sqlite');
  Log.info(`Creating DB ${dbFilename}`);

  const db = await openDB(dbFilename);
  await db.runScriptsFromDirectory(backendPath('sqlite/meals-user'));
  await db.close();
}

async function run(): Promise<void> {
  if (process.argv.length < 3) {
    Log.error('Re-run with arguments: [db-directory]');
    process.exit(1);
  }
  databasesDir = path.resolve(process.argv[2]);
  
  if (!fs.existsSync(databasesDir)) {
    fs.mkdirSync(databasesDir, { recursive: true });
  }
  Log.info(`Databases directory is ${databasesDir}`);

  await prepareUsersDB();
  await prepareIngredientsDB();
  await prepareMealsDB();
  await prepareMealsUserDB();
}

run().catch(error => {
  Log.error('Failed to prepare SQLite databases', error);
  process.exit(1);
});
import * as path from 'path';
import * as fs from 'fs';

import { backendPath } from './common';
import { Colors, Log } from './log';
import { SQLiteDB, SQLiteDBMigrations } from './sqlite';

let databasesDir: string;
let recreateDatabases = false;

async function openDB(dbFilename: string): Promise<SQLiteDB> {
  if (fs.existsSync(dbFilename) && recreateDatabases) {
    Log.info(`Deleting DB ${Colors.red(dbFilename)}`);
    fs.unlinkSync(dbFilename);
  }
  return await SQLiteDB.open(dbFilename);
}

async function migrateDB(name: string): Promise<void> {
  const dbFilename = path.join(databasesDir, name + '.sqlite');
  const migrationsDir = backendPath(`sqlite/${name}`);
  Log.info(
    `\nMigrating ${Colors.cyan(name)} database ` +
    `from ${Colors.cyan(migrationsDir)}`
  );

  // open database
  const db = await openDB(dbFilename);

  // run migrations
  const migrations = new SQLiteDBMigrations(db.getDB());
  await migrations.runMigrationsFromDirectory(migrationsDir);
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
  Log.info(`Databases directory is ${Colors.cyan(databasesDir)}`);

  await migrateDB('users');
  await migrateDB('ingredients');
  await migrateDB('meals');
  await migrateDB('meals-user');
  await migrateDB('meals-log');
  await migrateDB('meals-daily-plan');
  await migrateDB('meals-named');
  await migrateDB('telegram-users');

}

run().catch(error => {
  Log.error('Failed to migrate SQLite databases', error);
  process.exit(1);
});
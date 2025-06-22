import { Log } from './Log';
import { SQLiteDB } from './SQLiteDB';

async function run(): Promise<void> {
  if (process.argv.length < 3) {
    Log.error('Re-run with arguments [db-file] [directory]');
    process.exit(1);
  }
  const dbFilename = process.argv[2];
  const directory = process.argv[3];

  const db = await SQLiteDB.open(dbFilename);
  await db.runScriptsFromDirectory(directory);
  await db.close();
}

run().catch(error => Log.error('Failed to run scripts', error));
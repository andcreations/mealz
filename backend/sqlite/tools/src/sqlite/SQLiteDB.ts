import * as path from 'path';
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';

import { Colors, Log } from '../log';

export class SQLiteDB {
  private db: sqlite3.Database;

  private constructor() {
  }

  private async init(dbFilename: string): Promise<void> {
    this.db = new sqlite3.Database(dbFilename);
  }

  public static async open(dbFilename: string): Promise<SQLiteDB> {
    const dir = path.dirname(dbFilename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const db = new SQLiteDB();
    await db.init(dbFilename);
    return db;
  }

  public getDB(): sqlite3.Database {
    return this.db;
  }

  public async close(): Promise<void> {
    await this.db.close();
  }

  public async select<T>(query: string, params: any[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  public async run(query: string, params: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  public async runScriptFromFile(filename: string): Promise<void> {
    Log.info(`Running script ${path.resolve(filename)}`);
    const script = fs.readFileSync(filename, 'utf8');
    await this.db.exec(script);
  }

  public async runScriptsFromDirectory(directory: string): Promise<void> {
    Log.info(`Running scripts from directory ${path.resolve(directory)}`);
    
    const files = fs.readdirSync(directory);
    files.sort((a, b) => a.localeCompare(b));

    for (const file of files) {
      if (file.endsWith('.sql')) {
        await this.runScriptFromFile(path.resolve(directory, file));
      }
    }
  }
}
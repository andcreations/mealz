import * as path from 'path';
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';

import { Colors, errorToMessage, Log } from '../log';

export class SQLiteDBMigrations {
  public constructor(private readonly db: sqlite3.Database) {
  }

  private async createMigrationsTable(): Promise<void> {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        filename TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        error TEXT NOT NULL,
        runAt DATETIME NOT NULL
      )
    `);
  }

  private async upsertMigration(
    filename: string,
    status: MigrationStatus,
    error?: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO ` +
        `migrations (filename, status, error, runAt) ` + 
        `VALUES (?, ?, ?, ?)`,
        [filename, status, error ?? '', new Date().toISOString()],
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    })
  }

  private async readMigrations(): Promise<Migration[]> {
    return new Promise<Migration[]>((resolve, reject) => {
      this.db.all(
        'SELECT filename, status, runAt FROM migrations',
        (error, rows) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(rows.map((row: any) => ({
            filename: row.filename,
            status: row.status,
            error: row.error,
            runAt: new Date(row.runAt),
          })))
        }
      );
    })
  }

  private getDBForMigration(): any {
    return {
      db: this.db,
      run: async (statement: string, params: any[]) => {
        return new Promise<void>((resolve, reject) => {
          this.db.run(statement, params, (error) => {
            if (error) {
              reject(error);
              return;
            }
            resolve();
          });
        });
      },
      select: async (statement: string, params: any[]) => {
        return new Promise<any[]>((resolve, reject) => {
          this.db.all(statement, params, (error, rows) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(rows);
          });
        });
      },
    };
  }

  private async runMigrationFromFile(
    fullFilename: string,
    migrationType: 'up' | 'down',
  ): Promise<void> {
    const filename = path.basename(fullFilename);
    try {
      const scriptSrc = fs.readFileSync(fullFilename, 'utf8');
      const script = eval(scriptSrc);

      // run the migration function
      const func = script[migrationType];
      if (!func || typeof func !== 'function') {
        throw new Error(`Migration function ${migrationType} not found in ${filename}`);
      }
      await func(this.getDBForMigration());

      // update the migration table
      await this.upsertMigration(filename, migrationType);
      await this.db.wait();
      Log.info(
        `Successfully ${migrationType}-migrated ${Colors.green(filename)}`
      );
    } catch (error) {
      Log.error(`Failed to run ${migrationType}-migration ${filename}`, error);
      await this.upsertMigration(
        filename,
        migrationType === 'up' ? 'up-failed' : 'down-failed',
        errorToMessage(error),
      );
      await this.db.wait();
      throw error;
    }
  }

  public async runMigrationsFromDirectory(directory: string): Promise<void> {
    await this.createMigrationsTable();
    const migrations = await this.readMigrations();
    
    const files = fs.readdirSync(directory)
      .filter(file => file.endsWith('js'));
    files.sort((a, b) => a.localeCompare(b));

    const filesToRun = files.filter(file => {
      return !migrations.some(migration => {
        return migration.filename === file;
      });
    });

    if (filesToRun.length === 0) {
      const fullDirectory = path.resolve(directory);
      Log.info(`No migrations to run from ${Colors.green(fullDirectory)}`);
      return;
    }

    for (const file of filesToRun) {
      const fullFilename = path.resolve(directory, file);
      await this.runMigrationFromFile(fullFilename, 'up');
    }
  }

  public async migrateDown(directory: string, filename: string): Promise<void> {
    const fullFilename = path.resolve(directory, filename);
    if (!fs.existsSync(fullFilename)) {
      throw new Error(`Migration file ${fullFilename} not found`);
    }

    const migrations = await this.readMigrations();
    const migration = migrations.find(migration => {
      return migration.filename === filename;
    });
    if (!migration) {
      throw new Error(`Migration ${filename} not found`);
    }
    if (migration.status !== 'up') {
      throw new Error(`Migration ${filename} is not up`);
    }
    await this.runMigrationFromFile(fullFilename, 'down');
  }
}

type MigrationStatus = 'up' | 'down' | 'up-failed' | 'down-failed';

interface Migration {
  filename: string;
  status: MigrationStatus;
  error?: string;
  runAt: Date;
}

import * as csv from 'csv-parser';
import * as fs from 'fs';

export async function readCSV<T>(filename: string): Promise<{
  rows: T[];
}> {
  const rows: T[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('error', (error) => {
        reject(error);
      })
      .on('end', () => {
        resolve({ rows });
      });
  });
}
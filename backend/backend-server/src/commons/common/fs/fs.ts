import * as fs from 'fs';
import * as path from 'path';

export function deleteFilesInDirectory(directory: string): void {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    fs.unlinkSync(path.join(directory, file));
  }
}

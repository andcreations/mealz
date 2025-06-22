import { hashPassword } from '../utils';

if (process.argv.length < 3) {
  console.error('Re-run with password');
  process.exit(1);
}

const password = process.argv[2];
const hash = hashPassword(password);
console.log(`${password} -> ${hash}`);
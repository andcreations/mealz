import { hashPassword } from '@mealz/backend-users-common';

if (process.argv.length < 3) {
  console.error('Re-run with arguments: [password]');
  process.exit(1);
}

const password = process.argv[2];
const hash = hashPassword(password);
console.log(`${password} -> ${hash}`);
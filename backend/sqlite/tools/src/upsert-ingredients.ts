import 'reflect-metadata';
import { readPassword } from './common';
import { Colors, Log } from './log';
import { GWIngredient } from './gateway-ingredients';
import {
  getIngredientName,
  loadIngredients,
  validateIngredients,
} from './ingredients-utils';

async function downloadIngredients(
  serverUrl: string,
  adminToken: string,
): Promise<GWIngredient[]> {
  const ingredients: GWIngredient[] = [];

  const limit = 100;
  let lastId: string | undefined = undefined;

  while (true) {
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    if (lastId) {
      params.set('lastId', lastId);
    }
    const url = (
      `${serverUrl}` +
      `/api/v1/ingredients/crud/admin/from-last?${params.toString()}`
    );

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-mealz-system-admin-token': `${adminToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to download ingredients: ` +
        `${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    ingredients.push(...data.ingredients);

    if (data.ingredients.length < limit) {
      break;
    }
    lastId = data.ingredients[data.ingredients.length - 1].id;
  }

  return ingredients;
}

function compareIngredients(a: GWIngredient, b: GWIngredient): boolean {
  return true;
}

function reconcileIngredients(
  localIngredients: GWIngredient[],
  serverIngredients: GWIngredient[],
): void {
  const toInsert: GWIngredient[] = [];
  const toUpdate: GWIngredient[] = [];

  for (const localIngredient of localIngredients) {
    const localName = getIngredientName(localIngredient);

    const serverIngredient = serverIngredients.find(ingredient => {
      const serverName = getIngredientName(ingredient);
      return serverName === localName;
    });
    if (!serverIngredient) {
      toInsert.push(localIngredient);
      continue;
    }

  }  
}

async function run(): Promise<void> {
  if (process.argv.length < 4) {
    Log.error('Re-run with arguments: [json-file] [server-url] [--dry-run]');
    process.exit(1);
  }  
  const jsonFilename = process.argv[2];
  const serverUrl = process.argv[3];
  const dryRun = process.argv.includes('--dry-run');

  // read admin token
  // const adminToken = await readPassword('Enter admin token: ');
  const adminToken = 'eatgood';

  // load & validate
  const ingredients = await loadIngredients(jsonFilename);
  await validateIngredients(ingredients);
  console.log(`Loaded ${ingredients.length} ingredients`);

  // download
  const serverIngredients = await downloadIngredients(
    serverUrl,
    adminToken,
  );
  console.log(`Downloaded ${serverIngredients.length} ingredients`);
}

if (require.main === module) {
  run().catch(error => {
    Log.error('Failed to upsert ingredients from JSON', error);
    process.exit(1);
  });
}
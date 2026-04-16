import 'reflect-metadata';
import { readInput, readPassword } from './common';
import { Colors, Log } from './log';
import { GWFactPer100, GWIngredient } from './gateway-ingredients';
import { getIngredientName, loadIngredients } from './ingredients-utils';

let debug = false;

async function downloadIngredients(
  serverUrl: string,
  adminToken: string,
): Promise<GWIngredient[]> {
  const ingredients: GWIngredient[] = [];

  const downloadUrl = `${serverUrl}/api/v1/ingredients/crud/admin/from-last`;
  console.log(`Downloading ingredients from ${Colors.cyan(downloadUrl)}`);

  const limit = 100;
  let lastId: string | undefined = undefined;

  while (true) {
    const params = new URLSearchParams();
    params.set('limit', limit.toString());
    if (lastId) {
      params.set('lastId', lastId);
    }
    const url = `${downloadUrl}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-mealz-system-admin-token': `${adminToken}`,
      },
    });

    if (!response.ok) {
      const body = await response.json();
      throw new Error(
        `Failed to download ingredients: ` +
        `${response.status} ${response.statusText} | ${JSON.stringify(body)}`
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

function areFactsEqual(a: GWFactPer100[], b: GWFactPer100[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let index = 0; index < a.length; index++) {
    const factA = a[index];
    const factB = b.find(fact => fact.id === factA.id);
    if (!factB) {
      return false;
    }
    if (factA.unit !== factB.unit) {
      return false;
    }
    if (factA.amount !== factB.amount) {
      return false;
    }
  }
  return true;
}

function areIngredientsEqual(a: GWIngredient, b: GWIngredient): boolean {
  const aName = getIngredientName(a);
  const bName = getIngredientName(b);
  if (aName !== bName) {
    return false;
  }
  if (a.type !== b.type) {
    return false;
  }
  if (a.unitPer100 !== b.unitPer100) {
    return false;
  }
  if (!areFactsEqual(a.factsPer100, b.factsPer100)) {
    return false;
  }
  if (a.product !== b.product) {
    return false;
  }
  if (a.isHidden !== b.isHidden) {
    return false;
  }
  return true;
}

function reconcileIngredients(
  localIngredients: GWIngredient[],
  serverIngredients: GWIngredient[],
): {
  toInsert: GWIngredient[];
  toUpdate: GWIngredient[];
} {
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
    if (!areIngredientsEqual(localIngredient, serverIngredient)) {
      toUpdate.push({
        ...localIngredient,
        id: serverIngredient.id,
      });
    }
  }
  return { toInsert, toUpdate };
}

async function upsertIngredientsBatch(
  serverUrl: string,
  adminToken: string,
  toUpsert: GWIngredient[],
): Promise<void> {
  const upsertUrl = `${serverUrl}/api/v1/ingredients/crud/admin/upsert`;
  console.log(
    `Upserting ${Colors.yellow(toUpsert.length.toString())} ingredients ` +
    `to ${Colors.cyan(upsertUrl)}`
  );

  if (debug) {
    for (let index = 0; index < toUpsert.length; index++) {
      const indexStr = index.toString().padStart(3, ' ');
      const ingredient = toUpsert[index];
      console.log(
        `  ${Colors.green(indexStr)} ` +
        `${Colors.gray(JSON.stringify(ingredient))}`
      );
    }
  }

  const body = { ingredients: toUpsert };
  const response = await fetch(upsertUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-mealz-system-admin-token': `${adminToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(
      `Failed to upsert ingredients: ` +
      `${response.status} ${response.statusText} | ${JSON.stringify(body)}`
    );
  }
}

async function notifyChangedIngredients(
  serverUrl: string,
  adminToken: string,
): Promise<void> {
  const notifyUrl = `${serverUrl}/api/v1/ingredients/crud/admin/notify-changed`;
  console.log(`Notifying changed ingredients to ${Colors.cyan(notifyUrl)}`);
  const response = await fetch(notifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-mealz-system-admin-token': `${adminToken}`,
    },
  });
  if (!response.ok) {
    const body = await response.json();
    throw new Error(
      `Failed to notify changed ingredients: ` +
      `${response.status} ${response.statusText} | ${JSON.stringify(body)}`
    );
  }
}

async function upsertIngredients(
  serverUrl: string,
  adminToken: string,
  toUpsert: GWIngredient[],
): Promise<void> {
  const batchSize = 100;
  const remaining = [...toUpsert];
  while (remaining.length > 0) {
    const batch = remaining.splice(0, batchSize);
    await upsertIngredientsBatch(serverUrl, adminToken, batch);
  }
  await notifyChangedIngredients(serverUrl, adminToken);
}

async function run(): Promise<void> {
  if (process.argv.length < 4) {
    Log.error(
      'Re-run with arguments: [json-file] [server-url] [--dry-run] [--debug]'
    );
    process.exit(1);
  }  
  const jsonFilename = process.argv[2];
  const serverUrl = process.argv[3];
  const dryRun = process.argv.includes('--dry-run');
  debug = process.argv.includes('--debug');

  // read admin token
  const adminToken = await readPassword('Enter admin token: ');

  // load & validate
  const ingredients = await loadIngredients(jsonFilename);
  console.log(
    `Loaded ${Colors.green(ingredients.length.toString())} ingredients`
  );

  // download
  const serverIngredients = await downloadIngredients(
    serverUrl,
    adminToken,
  );
  console.log(
    `Downloaded ${Colors.green(serverIngredients.length.toString())} ` +
    `ingredients`
  );

  // reconcile
  const {
    toInsert,
    toUpdate,
  } = reconcileIngredients(ingredients, serverIngredients);

  const toUpsert = [...toInsert, ...toUpdate];
  if (toUpsert.length === 0) {
    console.log('No ingredients to insert or update');
    process.exit(0);
  }

  const printIngredient = (ingredient: GWIngredient) => {
    console.log(`  ${Colors.green(getIngredientName(ingredient))}`);
  };
  if (toInsert.length > 0) {
    console.log('\nTo insert:');
    toInsert.forEach(printIngredient);
  }
  if (toUpdate.length > 0) {
    console.log('\nTo update:');
    toUpdate.forEach(printIngredient);
  }

  console.log();
  console.log(
    `${Colors.yellow(toInsert.length.toString())} ingredients to insert`,
  );
  console.log(
    `${Colors.yellow(toUpdate.length.toString())} ingredients to update`,
  );

  // upsert
  if (!dryRun) {
    console.log();
    const answer = await readInput('Continue? (yes/no): ');
    if (answer !== 'yes') {
      console.log('Aborting...');
      process.exit(0);
    }
    await upsertIngredients(serverUrl, adminToken, toUpsert);
  }
}

if (require.main === module) {
  run().catch(error => {
    Log.error('Failed to upsert ingredients from JSON', error);
    process.exit(1);
  });
}
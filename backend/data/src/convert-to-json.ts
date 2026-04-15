import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { Log } from './log';
import { 
  YamlFacts,
  YamlIngredient,
  YamlName,
  YamlProduct,
} from './ingredients';
import {
  FactIdV1,
  FactUnitV1,
  IngredientDetailsV1,
} from './ingredients/v1';
import {
  GWFactId,
  GWFactPer100,
  GWFactUnit,
  GWIngredient,
  GWIngredientType,
  GWUnitPer100,
} from './gateway-ingredients';

type GWIngredientWithoutId = Omit<GWIngredient, 'id'>;

function validateIngredients(
  rawIngredients: any,
  filePath: string,
): YamlIngredient[] {
  if (!Array.isArray(rawIngredients)) {
    throw new Error('Ingredients must be an array');
  }

  for (const rawIngredient of rawIngredients) {
    const instance = plainToInstance(YamlIngredient, rawIngredient);
    const errors = validateSync(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      throw new Error(
        `Invalid ingredient in ${filePath}: ${JSON.stringify(errors)}`,
      );
    }
  }

  return rawIngredients as YamlIngredient[];
}

function populateMissingFields(
  ingredients: YamlIngredient[]
): YamlIngredient[] {
  return ingredients.map(ingredient => {
    return {
      ...ingredient,
      facts: {
        ...ingredient.facts,
        fat: {
          ...ingredient.facts.fat,
          monounsaturated: ingredient.facts.fat.monounsaturated ?? 0,
          polyunsaturated: ingredient.facts.fat.polyunsaturated ?? 0,
        },
      },
    };
  });
}

function mergeIngredients(list: YamlIngredient[][]): YamlIngredient[] {
  const equals = (a: YamlIngredient, b: YamlIngredient) => {
    return a.name.en === b.name.en || a.name.pl === b.name.pl;
  };

  const merged: YamlIngredient[] = [];
  for (const ingredients of list) {
    for (const ingredient of ingredients) {
      const existing = merged.find(itr => equals(itr, ingredient));
      if (existing) {
        throw new Error(`Duplicate ingredient ${ingredient.name.en}`);
      }
      merged.push(ingredient);
    }
  }
  return merged;
}

function readIngredients(dir: string): YamlIngredient[] {
  let allIngredients: YamlIngredient[] = [];

  const ymlFiles = fs.readdirSync(dir).filter((file) => {
    return file.endsWith('.yml') && !file.startsWith('.');
  });
  ymlFiles.forEach(ymlFile => {
    const filePath = path.join(dir, ymlFile);
    Log.info(`Reading ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    const raw = YAML.parse(content);
    const validatedIngredients = validateIngredients(raw, filePath);
    const ingredients = populateMissingFields(validatedIngredients);
    allIngredients = mergeIngredients([allIngredients, ingredients]);
  });

  return allIngredients;
}

function convertToJson(ingredients: YamlIngredient[]): GWIngredientWithoutId[] {
  const convertName = (name: YamlName): IngredientDetailsV1['name'] => {
    return {
      en: name.en,
      pl: name.pl,
    };
  };

  const convertType = (type: string): GWIngredientType => {
    if (type === 'generic') {
      return GWIngredientType.Generic;
    }
    if (type === 'product') {
      return GWIngredientType.Product;
    }
    throw new Error(`Invalid type ${type}`);
  };

  const convertUnit = (unit: string): GWUnitPer100 => {
    if (unit === 'g') {
      return GWUnitPer100.Grams;
    }
    if (unit === 'ml') {
      return GWUnitPer100.Milliliters;
    }
    throw new Error(`Invalid per 100 unit ${unit}`);
  }

  const convertFacts = (
    facts: YamlFacts,
    factor100: number,
  ): GWFactPer100[] => {
    const round = (value: number) => parseFloat(value.toFixed(2))
    const per100 = (amount: number) => round(amount * factor100);
    return [
      {
        id: GWFactId.Calories,
        unit: GWFactUnit.Kcal,
        amount: per100(facts.calories),
      },
      {
        id: GWFactId.Carbs,
        unit: GWFactUnit.Grams,
        amount: per100(facts.carbs),
      },
      {
        id: GWFactId.Sugars,
        unit: GWFactUnit.Grams,
        amount: per100(facts.sugars),
      },
      {
        id: GWFactId.Protein,
        unit: GWFactUnit.Grams,
        amount: per100(facts.protein),
      },
      {
        id: GWFactId.TotalFat,
        unit: GWFactUnit.Grams,
        amount: per100(facts.fat.total),
      },
      {
        id: GWFactId.SaturatedFat,
        unit: GWFactUnit.Grams,
        amount: per100(facts.fat.saturated),
      },
      {
        id: GWFactId.MonounsaturatedFat,
        unit: GWFactUnit.Grams,
        amount: per100(facts.fat.monounsaturated),
      },
      {
        id: GWFactId.PolyunsaturatedFat,
        unit: GWFactUnit.Grams,
        amount: per100(facts.fat.polyunsaturated),
      },
    ];
  };

  const convertProduct = (
    product: YamlProduct,
  ): IngredientDetailsV1['product'] => {
    return {
      brand: product.brand,
    }
  }

  const json: GWIngredientWithoutId[] = [];
  for (const ingredient of ingredients) {
    const factor100 = 100 / ingredient.weight;

    json.push({
      name: convertName(ingredient.name),
      type: convertType(ingredient.type),
      unitPer100: convertUnit(ingredient.unit),
      factsPer100: convertFacts(ingredient.facts, factor100),
      ...(ingredient.product
        ? { product: convertProduct(ingredient.product) }
        : {}
      ),
      isHidden: ingredient.hidden,
    });
  }

  json.sort((a, b) => a.name.en.localeCompare(b.name.en));
  return json;
}

function run() {
  const ingredients = readIngredients('ingredients');
  const json = convertToJson(ingredients);

  const dstDir = '../sqlite/ingredients';  
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir);
  }
  const dstFile = path.join(dstDir, 'ingredients.json');
  Log.info(`Writing ${dstFile}`);
  fs.writeFileSync(dstFile, JSON.stringify(json, null, 2));
}

run();
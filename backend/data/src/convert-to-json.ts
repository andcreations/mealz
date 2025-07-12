import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { Log } from './log';
import { YamlFacts, YamlFat, YamlIngredient, YamlName, YamlProduct } from './ingredients';
import {
  FactIdV1,
  FactUnitV1,
  IngredientDetailsV1,
  IngredientTypeV1,
  UnitPer100V1,
} from './ingredients/v1';

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

  const ymlFiles = fs.readdirSync(dir).filter((file) => file.endsWith('.yml'));
  ymlFiles.forEach(ymlFile => {
    const filePath = path.join(dir, ymlFile);
    Log.info(`Reading ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    const raw = YAML.parse(content);
    const ingredients = validateIngredients(raw, filePath);
    allIngredients = mergeIngredients([allIngredients, ingredients]);
  });

  return allIngredients;
}

function convertToJson(ingredients: YamlIngredient[]): any {
  const convertName = (name: YamlName): IngredientDetailsV1['name'] => {
    return {
      en: name.en,
      pl: name.pl,
    };
  };

  const convertType = (type: string): IngredientTypeV1 => {
    if (type === 'generic') {
      return IngredientTypeV1.Generic;
    }
    if (type === 'product') {
      return IngredientTypeV1.Product;
    }
    throw new Error(`Invalid type ${type}`);
  };

  const convertUnit = (unit: string): UnitPer100V1 => {
    if (unit === 'g') {
      return UnitPer100V1.Grams;
    }
    if (unit === 'ml') {
      return UnitPer100V1.Milliliters;
    }
    throw new Error(`Invalid per 100 unit ${unit}`);
  }

  const convertFacts = (
    facts: YamlFacts,
    factor100: number,
  ): IngredientDetailsV1['factsPer100'] => {
    const round = (value: number) => parseFloat(value.toFixed(2))
    const per100 = (amount: number) => round(amount * factor100);
    return [
      {
        id: FactIdV1.Calories,
        unit: FactUnitV1.Kcal,
        amount: per100(facts.calories),
      },
      {
        id: FactIdV1.Carbs,
        unit: FactUnitV1.Grams,
        amount: per100(facts.carbs),
      },
      {
        id: FactIdV1.Sugars,
        unit: FactUnitV1.Grams,
        amount: per100(facts.sugars),
      },
      {
        id: FactIdV1.Protein,
        unit: FactUnitV1.Grams,
        amount: per100(facts.protein),
      },
      {
        id: FactIdV1.TotalFat,
        unit: FactUnitV1.Grams,
        amount: per100(facts.fat.total),
      },
      {
        id: FactIdV1.SaturatedFat,
        unit: FactUnitV1.Grams,
        amount: per100(facts.fat.saturated),
      },
      {
        id: FactIdV1.MonounsaturatedFat,
        unit: FactUnitV1.Grams,
        amount: per100(facts.fat.monounsaturated),
      },
      {
        id: FactIdV1.PolyunsaturatedFat,
        unit: FactUnitV1.Grams,
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

  const json: IngredientDetailsV1[] = [];
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
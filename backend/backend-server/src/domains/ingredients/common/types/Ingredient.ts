import { FactPer100 } from './FactPer100';
import { Product } from './Product';

export enum IngredientType {
  Generic = 'generic',
  Product = 'product',
}

export enum UnitPer100 {
  Grams = 'g',
  Milliliters = 'ml',
}

export class Ingredient {
  // Ingredient unique identifier
  public id: string;

  // Name in various languages
  public name: Record<string, string>;

  // Type of ingredient
  public type: IngredientType;

  // Unit of measure for facts per 100 grams/milliliters
  public unitPer100: UnitPer100;

  // Facts per 100 grams/milliliters
  public factsPer100: FactPer100[];

  // Product if ingredient is a product
  public product?: Product;
}


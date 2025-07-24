import { GWFactPer100 } from './GWFactPer100';
import { GWProduct } from './GWProduct';

export enum GWIngredientType {
  Generic = 'generic',
  Product = 'product',
}

export enum GWUnitPer100 {
  Grams = 'g',
  Milliliters = 'ml',
}

export interface GWIngredient {
  // Ingredient unique identifier
  id: string;

  // Name in various languages
  name: Record<string, string>;

  // Type of ingredient
  type: GWIngredientType;

  // Unit per 100g
  unitPer100: GWUnitPer100;

  // Facts per 100g
  factsPer100: GWFactPer100[];

  // Product if ingredient is a product
  product?: GWProduct;
}
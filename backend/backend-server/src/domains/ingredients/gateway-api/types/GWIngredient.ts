import { GWFactPer100 } from './GWFactPer100';
import { GWProduct } from './GWProduct';

export enum GWIngredientType {
  Generic = 'generic',
  Product = 'product',
}

export interface GWIngredient {
  // Ingredient unique identifier
  id: string;

  // Name in various languages
  name: Record<string, string>;

  // Type of ingredient
  type: GWIngredientType;

  // Facts per 100g
  facts: GWFactPer100[];

  // Product if ingredient is a product
  product?: GWProduct;
}
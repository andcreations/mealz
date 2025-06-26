import { FactPer100 } from './FactPer100';
import { Product } from './Product';

export enum IngredientType {
  Generic = 'generic',
  Product = 'product',
}

export class Ingredient {
  // Ingredient unique identifier
  public id: string;

  // Name in U.S. English
  public name: string;

  // Name translations in other languages
  public translations: Record<string, string> = {};

  // Type of ingredient
  public type: IngredientType;

  // Facts per 100g
  public facts: FactPer100[];

  // Product if ingredient is a product
  public product?: Product;
}


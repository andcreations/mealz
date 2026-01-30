import { PhotoScanIngredient } from './PhotoScanIngredient';

export interface PhotoScanMeal {
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  ingredients: PhotoScanIngredient[];
}
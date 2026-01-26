import { GWPhotoScanIngredient } from './GWPhotoScanIngredient';

export interface GWPhotoScanMeal {
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  ingredients: GWPhotoScanIngredient[];
}
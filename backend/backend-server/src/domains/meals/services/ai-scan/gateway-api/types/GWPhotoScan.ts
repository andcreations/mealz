import { GWPhotoScanMeal } from './GWPhotoScanMeal';

export interface GWPhotoScan {
  nameOfAllMeals: string;
  weightOfAllMeals: number;
  meals: GWPhotoScanMeal[];
}
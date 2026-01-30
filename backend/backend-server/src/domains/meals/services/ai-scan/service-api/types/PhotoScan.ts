import { PhotoScanMeal } from './PhotoScanMeal';

export interface PhotoScan {
  photoContent: string;
  nameOfAllMeals: string;
  weightOfAllMeals: number;
  meals: PhotoScanMeal[];
}
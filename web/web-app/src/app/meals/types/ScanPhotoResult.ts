import { GWPhotoScanMeal } from '@mealz/backend-meals-ai-scan-gateway-api';

export interface ScanPhotoResult {
  meals: GWPhotoScanMeal[];
  nameOfAllMeals: string;
  weightOfAllMeals: number;
}
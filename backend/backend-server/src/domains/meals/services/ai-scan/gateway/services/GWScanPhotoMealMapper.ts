import { Injectable } from '@nestjs/common';
import { 
  PhotoScanIngredient,
  PhotoScanMeal,
  PhotoScan,
} from '@mealz/backend-meals-ai-scan-service-api';

import { 
  GWPhotoScanIngredientImpl, 
  GWPhotoScanMealImpl, 
  GWPhotoScanImpl,
} from '../types';

@Injectable()
export class GWScanPhotoMealMapper {
  private fromPhotoScanIngredient(
    photoScanIngredient: PhotoScanIngredient,
  ): GWPhotoScanIngredientImpl {
    return {
      name: photoScanIngredient.name,
      amount: photoScanIngredient.amount,
    };
  }

  private fromPhotoScanMeal(
    photoScanMeal: PhotoScanMeal,
  ): GWPhotoScanMealImpl {
    return {
      name: photoScanMeal.name,
      calories: photoScanMeal.calories,
      carbs: photoScanMeal.carbs,
      protein: photoScanMeal.protein,
      fat: photoScanMeal.fat,
      ingredients: photoScanMeal.ingredients.map(ingredient => {
        return this.fromPhotoScanIngredient(ingredient);
      }),
    };
  }

  public fromPhotoScan(
    photoScan: PhotoScan,
  ): GWPhotoScanImpl {
    return {
      nameOfAllMeals: photoScan.nameOfAllMeals,
      weightOfAllMeals: photoScan.weightOfAllMeals,
      meals: photoScan.meals.map(meal => this.fromPhotoScanMeal(meal)),
    };
  }
}
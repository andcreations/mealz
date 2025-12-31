import { Service } from '@andcreations/common';
import { GWMealWithoutId } from '@mealz/backend-meals-gateway-api';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';

import { IngredientsCrudService } from '../../ingredients';
import { 
  MealPlannerIngredient,
  MealCalculator as ChefMealCalculator,
} from '../../chef';

@Service()
export class GWMealCalculator {

  public constructor(
    private readonly ingredientsCrudService: IngredientsCrudService,
    private readonly chefMealCalculator: ChefMealCalculator,
  ) {}

  public calculateMacros(meal: GWMealWithoutId): GWMacros {
    // convert to chef ingredients
    const chefIngredients: MealPlannerIngredient[] = meal.ingredients.map(
      (ingredient) => {
        const { ingredientId, adHocIngredient } = ingredient;
        const chefIngredient = ingredientId
          ? this.ingredientsCrudService.getById(ingredientId)
          : undefined;
        const chefAdHocIngredient = adHocIngredient
          ? {
            name: adHocIngredient.name,
            caloriesPer100: adHocIngredient.caloriesPer100,
          }
          : undefined;
        return {
          fullIngredient: chefIngredient,
          adHocIngredient: chefAdHocIngredient,
          enteredAmount: ingredient.enteredAmount,
        };
      }
    );

    // calculate amounts
    const { ingredients } = this.chefMealCalculator.calculateAmounts(
      meal.calories,
      chefIngredients,
    );

    // summarize to get totals
    const summary = this.chefMealCalculator.summarize(ingredients);
    return {
      calories: summary.total.calories,
      carbs: summary.total.carbs,
      protein: summary.total.protein,
      fat: summary.total.totalFat,
    }
  }
}
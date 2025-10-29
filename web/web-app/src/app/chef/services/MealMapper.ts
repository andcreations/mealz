import { Service } from '@andcreations/common';
import { AdHocIngredient } from '@mealz/backend-ingredients-shared';
import { GWMealIngredient } from '@mealz/backend-meals-gateway-api';

import { ifValueDefined } from '../../utils';

import { IngredientsCrudService } from '../../ingredients';
import { MealPlannerIngredient } from '../types';

@Service()
export class MealMapper {
  public constructor(
    private readonly ingredientsCrudService: IngredientsCrudService,
  ) {}

  public toMealPlannerIngredient(
    gwMealIngredient: GWMealIngredient,
  ): MealPlannerIngredient {
    const {
      ingredientId,
      adHocIngredient: gwAdHocIngredient,
    } = gwMealIngredient;

    // full ingredient
    const fullIngredient = ingredientId
      ? this.ingredientsCrudService.getById(ingredientId)
      : undefined;

    // ad-hoc ingredient
    const adHocIngredient: AdHocIngredient | undefined = gwAdHocIngredient
      ? {
          name: gwAdHocIngredient.name,
          caloriesPer100: gwAdHocIngredient.caloriesPer100,
        }
      : undefined;

    return {
      ...ifValueDefined<MealPlannerIngredient>(
        'fullIngredient',
        fullIngredient,
      ),
      ...ifValueDefined<MealPlannerIngredient>(
        'adHocIngredient',
        adHocIngredient,
      ),
      ...ifValueDefined<MealPlannerIngredient>(
        'enteredAmount',
        gwMealIngredient.enteredAmount,
      ),
    };
  }

  public toMealPlannerIngredients(
    gwMealIngredients: GWMealIngredient[],
  ): MealPlannerIngredient[] {
    return gwMealIngredients.map(ingredient => {
      return this.toMealPlannerIngredient(ingredient);
    });
  }

  public toGWMealIngredient(
    mealPlannerIngredient: MealPlannerIngredient,
  ): GWMealIngredient {
    const { 
      fullIngredient,
      adHocIngredient,
      enteredAmount,
    } = mealPlannerIngredient;

    // full ingredient
    const ingredientId = fullIngredient?.id;

    // ad-hoc ingredient
    const gwAdHocIngredient = adHocIngredient
     ? {
        name: adHocIngredient.name,
        caloriesPer100: adHocIngredient.caloriesPer100,
       }
     : undefined;

    return {
      ...ifValueDefined<GWMealIngredient>(
        'ingredientId',
        ingredientId,
      ),
      ...ifValueDefined<GWMealIngredient>(
        'adHocIngredient',
        gwAdHocIngredient,
      ),
      ...ifValueDefined<GWMealIngredient>(
        'enteredAmount',
        enteredAmount,
      ),
    }
  }
}
import { Injectable } from '@nestjs/common';
import { NamedMeal } from '@mealz/backend-meals-named-service-api';
import { GWNamedMeal } from '@mealz/backend-meals-named-gateway-api';

@Injectable()
export class GWNamedMealMapper {
  public fromNamedMeal(namedMeal: NamedMeal): GWNamedMeal {
    return {
      id: namedMeal.id,
      name: namedMeal.mealName,
      mealId: namedMeal.mealId,
    };
  }

  public fromNamedMeals(namedMeals: NamedMeal[]): GWNamedMeal[] {
    return namedMeals.map(namedMeal => this.fromNamedMeal(namedMeal));
  }
}
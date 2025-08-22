import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { UserMeal } from '@mealz/backend-meals-user-service-api';
import { MealsCrudTransporter } from '@mealz/backend-meals-crud-service-api';
import { GWMealMapper } from '@mealz/backend-meals-gateway-common';
import { GWUserMeal } from '@mealz/backend-meals-user-gateway-api';

@Injectable()
export class GWUserMealMapper {
  public constructor(
    private readonly mealsCrudTransporter: MealsCrudTransporter,
    private readonly gwMealMapper: GWMealMapper,
  ) {}

  public async fromUserMeals(
    userMeals: UserMeal[],
    context: Context,
  ): Promise<GWUserMeal[]> {
    const { meals } = await this.mealsCrudTransporter.readMealsByIdV1(
      {
        ids: userMeals.map(userMeal => userMeal.id),
      },
      context,
    );

    return userMeals.map(userMeal => {
      const meal = meals.find(meal => meal.id === userMeal.mealId);
      return {
        id: userMeal.id,
        userId: userMeal.userId,
        type: userMeal.type,
        meal: this.gwMealMapper.fromMeal(meal),
      }
    });
  }
}
import { Injectable } from '@nestjs/common';
import { UserWithoutPassword } from '@mealz/backend-users-common';
import { GWUpdatedAt } from '@mealz/backend-gateway-api';
import { NamedMeal } from '@mealz/backend-meals-named-service-api';
import { GWNamedMeal } from '@mealz/backend-meals-named-gateway-api';

@Injectable()
export class GWNamedMealMapper {
  private fromSharedByUser(
    sharedByUser?: UserWithoutPassword,
  ): Pick<GWNamedMeal, 'sharedBy'> | {} {
    if (!sharedByUser) {
      return {};
    }
    return {
      sharedBy: {
        firstName: sharedByUser.firstName,
      },
    };
  }

  public fromNamedMeal(
    namedMeal: NamedMeal,
    sharedByUser?: UserWithoutPassword,
  ): GWNamedMeal {
    return {
      id: namedMeal.id,
      name: namedMeal.mealName,
      mealId: namedMeal.mealId,
      ...this.fromSharedByUser(sharedByUser),
    };
  }

  public fromNamedMealWithUpdatedAt(
    namedMeal: NamedMeal & { updatedAt: number },
    sharedByUser?: UserWithoutPassword,
  ): GWNamedMeal & GWUpdatedAt {
    return {
      ...this.fromNamedMeal(namedMeal, sharedByUser),
      updatedAt: namedMeal.updatedAt,
    };
  }

  public fromNamedMeals(
    namedMeals: NamedMeal[],
    sharedByUsers: UserWithoutPassword[],
  ): GWNamedMeal[] {
    return namedMeals.map(namedMeal => {
      const sharedByUser = sharedByUsers.find(user => {
        return user.id === namedMeal.sharedByUserId;
      });
      return this.fromNamedMeal(namedMeal, sharedByUser);
    });
  }

  public fromNamedMealsWithUpdatedAt(
    namedMeals: NamedMeal[],
    sharedByUsers: UserWithoutPassword[],
  ): (GWNamedMeal & GWUpdatedAt)[] {
    return namedMeals.map(namedMeal => {
      const sharedByUser = sharedByUsers.find(user => {
        return user.id === namedMeal.sharedByUserId;
      });
      return this.fromNamedMealWithUpdatedAt(namedMeal, sharedByUser);
    });
  }
}
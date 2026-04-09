import { Injectable } from '@nestjs/common';
import { UserWithoutPassword } from '@mealz/backend-users-common';
import { NamedMeal } from '@mealz/backend-meals-named-service-api';
import { 
  GWNamedMeal,
  GWNamedMealSharedBy,
} from '@mealz/backend-meals-named-gateway-api';

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
}
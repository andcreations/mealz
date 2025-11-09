import { UserMeal } from '../types';

export class DeleteUserMealRequestV1 {
  // User identifier
  public userId: UserMeal['userId'];

  // User meal type
  public typeId: UserMeal['typeId'];
}
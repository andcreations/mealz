import { UserMeal } from '../types';

export class ReadManyUserMealsRequestV1 {
  // Identifier of the user meal read last
  public lastId?: string;

  // Number of user meals to read
  public limit: number;

  // User identifier
  public userId: UserMeal['userId'];

  // Meal types
  public typeIds?: UserMeal['typeId'][];
}
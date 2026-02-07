export class UserMeal<T = any> {
  // User meal identifier
  public id: string;

  // User identifier
  public userId: string;

  // Indicates the type of the meal (e.g. meal cached in the web, meal saved
  // by the user...)
  public typeId: string;

  // Meal identifier
  public mealId: string;

  // Metadata (serialized to message pack)
  public metadata?: T;

  // Created at
  public createdAt: number;
}
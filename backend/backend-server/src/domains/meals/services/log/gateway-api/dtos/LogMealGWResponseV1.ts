export enum LogMealGWResponseStatusV1 {
  Created = 'created',
  Updated = 'updated',
}

export class LogMealGWResponseV1 {
  // Meal log identifier
  public id: string;

  // Meal log status
  public status: LogMealGWResponseStatusV1;
}
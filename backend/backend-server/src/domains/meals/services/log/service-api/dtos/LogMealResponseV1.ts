export enum LogMealResponseStatusV1 {
  Created = 'created',
  Updated = 'updated',
}

export class LogMealResponseV1 {
  // Meal log identifier
  public id: string;

  // Meal log status
  public status: LogMealResponseStatusV1;
}
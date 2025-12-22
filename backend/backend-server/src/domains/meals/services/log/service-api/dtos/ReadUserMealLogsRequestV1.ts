export interface ReadUserMealLogsRequestV1 {
  // User identifier
  userId: string;

  // Date from which to read the meal logs
  fromDate: number;

  // Date to which to read the meal logs
  toDate: number;
}
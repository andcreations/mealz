export interface ReadHydrationLogsByDateRangeRequestV1 {
  // User identifier
  userId: string;

  // Date from which to read the hydration logs
  fromDate: number;

  // Date to which to read the hydration logs
  toDate: number;
}
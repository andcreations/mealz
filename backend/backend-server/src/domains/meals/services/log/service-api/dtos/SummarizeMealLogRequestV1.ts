export class SummarizeMealLogRequestV1 {
  // User identifier
  public userId: string;

  // Date from which to summarize the meal logs
  public fromDate: number;

  // Date to which to summarize the meal logs
  public toDate: number;
}
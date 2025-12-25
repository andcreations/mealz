import { UserDailyInsightsAmounts } from './UserDailyInsightsAmounts';

export interface UserDailyInsightsMeal {
  name: string;
  skipped: boolean;
  amounts?: UserDailyInsightsAmounts;
}
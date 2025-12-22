import { UserDailyInsightsAmounts } from './UserDailyInsightsAmounts';
import { UserDailyInsightsMeal } from './UserDailyInsightsMeal';

export interface UserDailyInsightsInput {
  meals: UserDailyInsightsMeal[]
  overallAmounts: UserDailyInsightsAmounts;
}
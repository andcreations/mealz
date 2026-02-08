import { ActivityLevel, ActivityLevelFactor } from './types';

export class TotalDailyEnergyExpenditure {
  public static calculateTDEE(
    bmr: number,
    activityLevel: ActivityLevel,
  ): number {
    return bmr * ActivityLevelFactor[activityLevel];
  }
}
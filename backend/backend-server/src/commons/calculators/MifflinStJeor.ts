import { ActivityLevel, ActivityLevelFactor, Sex } from './types';

export class MifflinStJeor {
  // calculate BMR (basal metabolic rate)
  public static calculateBMR(
    sex: Sex,
    ageInYears: number,
    heightInCm: number,
    weightInKg: number,
  ): number {
    const base = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears;
    return sex === 'female' ? base - 161 : base + 5;
  }
}
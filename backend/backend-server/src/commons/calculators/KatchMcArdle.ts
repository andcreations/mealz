import { Sex } from './types';

export class KatchMcArdle {
  // calculate BMR (basal metabolic rate)
  public static calculateBMR(
    leanBodyMassInKg: number,
  ): number {
    return 370 + (21.6 * leanBodyMassInKg);
  }

  public static calculateLeanBodyMass(
    weightInKg: number,
    bodyFatPercentage: number,
  ): number {
    return weightInKg - (weightInKg * bodyFatPercentage);
  }
}
import { Sex } from './types';

export class KatchMcArdle {
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
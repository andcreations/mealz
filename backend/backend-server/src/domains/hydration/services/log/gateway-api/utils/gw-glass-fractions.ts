import { GWGlassFraction } from '../types/GWGlassFraction';

export const GW_GLASS_FRACTION_TO_NUMBER: Record<GWGlassFraction, number> = {
  full: 1,
  half: 0.5,
};

export function glassFractionToNumber(glassFraction: GWGlassFraction): number {
  return GW_GLASS_FRACTION_TO_NUMBER[glassFraction];
}

export function sumGlassFractions(glassFractions: GWGlassFraction[]): number {
  return glassFractions.reduce(
    (acc, glassFraction) => {
      return acc + glassFractionToNumber(glassFraction);
    },
    0,
  );
}
export const GLASS_FRACTIONS = ['full', 'half'] as const;
export type GlassFraction = typeof GLASS_FRACTIONS[number];
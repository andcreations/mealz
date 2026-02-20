export enum Goal {
  LoseWeight = 'lose-weight',
  StayFit = 'stay-fit',
  BuildBody = 'build-body',
}

export const CaloriesGoalFactor: Record<Goal, number> = {
  [Goal.LoseWeight]: 0.83,
  [Goal.StayFit]: 1.0,
  [Goal.BuildBody]: 1.1,
};

export interface MacrosGoalFactors {
  carbsFactor: number;
  proteinFactor: number;
  fatFactor: number;
}

// How much of the calories should be from carbs, protein and fat
export const MacrosGoalFactors: Record<Goal, MacrosGoalFactors> = {
  [Goal.LoseWeight]: {
    carbsFactor: 0.43,
    proteinFactor: 0.28,
    fatFactor: 0.29,
  },
  [Goal.StayFit]: {
    carbsFactor: 0.47,
    proteinFactor: 0.25,
    fatFactor: 0.28,
  },
  [Goal.BuildBody]: {
    carbsFactor: 0.49,
    proteinFactor: 0.25,
    fatFactor: 0.26,
  },
};
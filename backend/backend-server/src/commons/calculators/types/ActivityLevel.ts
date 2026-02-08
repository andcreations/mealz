export enum ActivityLevel {
  // little or no exercise
  Sedentary = 'sedentary',

  // light exercise 1-3 days/week
  LightlyActive = 'lightly_active',

  // light to moderate exercise 3-4 days/week
  ModeratelyActive = 'moderately_active',

  // moderate exercise 6-7 days/week or intensive exercise 3-4 days/week
  VeryActive = 'very_active',

  // intense exercise 6-7 times/week, sports training or physical job
  SuperActive = 'super_active',
}

export const ActivityLevelFactor: Record<ActivityLevel, number> = {
  [ActivityLevel.Sedentary]: 1.2,
  [ActivityLevel.LightlyActive]: 1.375,
  [ActivityLevel.ModeratelyActive]: 1.55,
  [ActivityLevel.VeryActive]: 1.725,
  [ActivityLevel.SuperActive]: 1.9,
};
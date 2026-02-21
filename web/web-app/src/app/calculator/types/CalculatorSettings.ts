import { Sex, ActivityLevel, Goal } from '@mealz/backend-calculators';

export interface CalculatorSettings {
  sex: Sex;
  age: number;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}
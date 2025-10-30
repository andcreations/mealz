import { Meal } from './Meal';

export type MealWithoutId = Omit<Meal, 'id'>;
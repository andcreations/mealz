import { NamedMeal } from './NamedMeal';

export type NamedMealWithoutId = Omit<NamedMeal, 'id'>;
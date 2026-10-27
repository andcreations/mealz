import { NamedMeal } from './NamedMeal';

export type NamedMealForCreation = Omit<NamedMeal, 'id' | 'updatedAt'>;
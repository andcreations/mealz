export interface NamedMeal {
  id: string;
  userId?: string;
  mealName: string;
  mealId: string;
  sharedByUserId?: string;
  createdAt: number;
}
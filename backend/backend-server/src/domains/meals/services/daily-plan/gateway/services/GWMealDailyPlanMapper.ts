import { Injectable } from '@nestjs/common';
import { 
  MealDailyPlan,
  MealDailyPlanEntry,
  MealDailyPlanForCreation,
  MealDailyPlanForUpdate,
  MealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-service-api';
import {
  GWMealDailyPlan,
  GWMealDailyPlanEntry,
  GWMealDailyPlanForCreation,
  GWMealDailyPlanForUpdate,
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

@Injectable()
export class GWMealDailyPlanMapper {
  private fromGWMealDailyPlanEntry(
    gwEntry: GWMealDailyPlanEntry,
  ): MealDailyPlanEntry {
    return {
      startHour: gwEntry.startHour,
      startMinute: gwEntry.startMinute,
      endHour: gwEntry.endHour,
      endMinute: gwEntry.endMinute,
      mealName: gwEntry.mealName,
      goals: {
        calories: gwEntry.goals.calories,
        protein: gwEntry.goals.protein,
        carbs: gwEntry.goals.carbs,
        fat: gwEntry.goals.fat,
      },
    };
  }

  private fromGWMealDailyPlanEntries(
    gwEntries: GWMealDailyPlanEntry[],
  ): MealDailyPlanEntry[] {
    return gwEntries.map(gwEntry => this.fromGWMealDailyPlanEntry(gwEntry));
  }

  public fromGWMealDailyPlanForCreation(
    userId: string,
    gwMealDailyPlan: GWMealDailyPlanForCreation,
  ): MealDailyPlanForCreation {
    return {
      userId,
      entries: this.fromGWMealDailyPlanEntries(gwMealDailyPlan.entries),
    };
  }

  public fromGWMealDailyPlanForUpdate(
    mealDailyPlanId: string,
    userId: string,
    gwMealDailyPlan: GWMealDailyPlanForUpdate,
  ): MealDailyPlanForUpdate {
    return {
      id: mealDailyPlanId,
      userId,
      entries: this.fromGWMealDailyPlanEntries(gwMealDailyPlan.entries),
    };
  }

  private fromMealDailyPlanGoals(
    mealDailyPlanGoals: MealDailyPlanGoals,
  ): GWMealDailyPlanGoals {
    return {
      calories: mealDailyPlanGoals.calories,
      protein: mealDailyPlanGoals.protein,
      carbs: mealDailyPlanGoals.carbs,
      fat: mealDailyPlanGoals.fat,
    };
  }
  private fromMealDailyPlanEntry(
    mealDailyPlanEntry: MealDailyPlanEntry,
  ): GWMealDailyPlanEntry {
    return {
      startHour: mealDailyPlanEntry.startHour,
      startMinute: mealDailyPlanEntry.startMinute,
      endHour: mealDailyPlanEntry.endHour,
      endMinute: mealDailyPlanEntry.endMinute,
      mealName: mealDailyPlanEntry.mealName,
      goals: this.fromMealDailyPlanGoals(mealDailyPlanEntry.goals),
    };
  }

  private fromMealDailyPlanEntries(
    mealDailyPlanEntries: MealDailyPlanEntry[],
  ): GWMealDailyPlanEntry[] {
    return mealDailyPlanEntries.map(mealDailyPlanEntry => {
      return this.fromMealDailyPlanEntry(mealDailyPlanEntry);
    });
  }

  public fromMealDailyPlan(
    mealDailyPlan: MealDailyPlan,
  ): GWMealDailyPlan {
    return {
      id: mealDailyPlan.id,
      entries: this.fromMealDailyPlanEntries(mealDailyPlan.entries),
      createdAt: mealDailyPlan.createdAt,
    };
  }
}
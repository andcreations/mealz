import { Injectable } from '@nestjs/common';
import { decode, encode } from '@mealz/backend-db';
import {
  MealDailyPlanGoals,
  MealDailyPlanEntry,
  MealDailyPlan,
} from '@mealz/backend-meals-daily-plan-service-api';

import { 
  MealDailyPlanEntryDetailsV1, 
  MealDailyPlanDetailsV1,
  MealDailyPlanGoalsV1,
} from '../../types';

export type MealDailyPlanForBuffer = Omit<MealDailyPlan, 
  | 'id'
  | 'userId' 
  | 'createdAt'
>;

@Injectable()
export class MealDailyPlanDetailsV1Mapper {
  private toGoalsV1(goals: MealDailyPlanGoals): MealDailyPlanGoalsV1 {
    return {
      calories: goals.calories,
      protein: goals.protein,
      carbs: goals.carbs,
      fat: goals.fat,
    };
  }
  private toEntryV1(entry: MealDailyPlanEntry): MealDailyPlanEntryDetailsV1 {
    return {
      startHour: entry.startHour,
      startMinute: entry.startMinute,
      endHour: entry.endHour,
      endMinute: entry.endMinute,
      mealName: entry.mealName,
      goals: this.toGoalsV1(entry.goals),
    };
  }

  public toBuffer(mealDailyPlan: MealDailyPlanForBuffer): Buffer {
    const details: MealDailyPlanDetailsV1 = {
      entries: mealDailyPlan.entries.map(entry => this.toEntryV1(entry)),
    };
    const encoded = encode(details);
    return Buffer.from(encoded);
  }

  private fromGoalsV1(goals: MealDailyPlanGoalsV1): MealDailyPlanGoals {
    return {
      calories: goals.calories,
      protein: goals.protein,
      carbs: goals.carbs,
      fat: goals.fat,
    };
  }

  private fromEntryV1(entry: MealDailyPlanEntryDetailsV1): MealDailyPlanEntry {
    return {
      startHour: entry.startHour,
      startMinute: entry.startMinute,
      endHour: entry.endHour,
      endMinute: entry.endMinute,
      mealName: entry.mealName,
      goals: this.fromGoalsV1(entry.goals),
    };
  }

  public fromBuffer(buffer: Buffer): MealDailyPlanForBuffer {
    const details = decode(buffer) as MealDailyPlanDetailsV1;
    return {
      entries: details.entries.map(entry => this.fromEntryV1(entry)),
    };
  }
}
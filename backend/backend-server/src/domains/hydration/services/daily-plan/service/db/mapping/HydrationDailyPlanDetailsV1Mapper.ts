import { Injectable } from '@nestjs/common';
import { decode, encode } from '@mealz/backend-db';
import {
  HydrationDailyPlanGoals,
  HydrationDailyPlanReminders,
  HydrationDailyPlan,
  HydrationDailyPlanReminderEntry,
} from '@mealz/backend-hydration-daily-plan-service-api';

import { 
  HydrationDailyPlanDetailsV1, 
  HydrationDailyPlanGoalsDetailsV1, 
  HydrationDailyPlanReminderEntryDetailsV1, 
  HydrationDailyPlanRemindersDetailsV1,
} from '../../types';

export type HydrationDailyPlanForBuffer = Omit<HydrationDailyPlan, 
  | 'id'
  | 'userId' 
  | 'createdAt'
>;

@Injectable()
export class HydrationDailyPlanDetailsV1Mapper {
  private toGoalsV1(
    goals: HydrationDailyPlanGoals,
  ): HydrationDailyPlanGoalsDetailsV1 {
    return {
      glasses: goals.glasses,
    };
  }

  private toReminderEntryV1(
    entry: HydrationDailyPlanReminderEntry,
  ): HydrationDailyPlanReminderEntryDetailsV1 {
    return {
      startHour: entry.startHour,
      startMinute: entry.startMinute,
      endHour: entry.endHour,
      endMinute: entry.endMinute,
      minutesSinceLastWaterIntake: entry.minutesSinceLastWaterIntake,
      periodInMinutes: entry.periodInMinutes,
    };
  }

  private toRemindersV1(
    reminders: HydrationDailyPlanReminders,
  ): HydrationDailyPlanRemindersDetailsV1 {
    return {
      enabled: reminders.enabled,
      entries: reminders.entries.map(entry => this.toReminderEntryV1(entry)),
    };
  }

  public toBuffer(hydrationDailyPlan: HydrationDailyPlanForBuffer): Buffer {
    const details: HydrationDailyPlanDetailsV1 = {
      goals: this.toGoalsV1(hydrationDailyPlan.goals),
      reminders: this.toRemindersV1(hydrationDailyPlan.reminders),
    };
    const encoded = encode(details);
    return Buffer.from(encoded);
  }


  private fromGoalsV1(
    goals: HydrationDailyPlanGoalsDetailsV1,
  ): HydrationDailyPlanGoals {
    return {
      glasses: goals.glasses,
    };
  }

  private fromReminderEntryV1(
    entry: HydrationDailyPlanReminderEntryDetailsV1,
  ): HydrationDailyPlanReminderEntry {
    return {
      startHour: entry.startHour,
      startMinute: entry.startMinute,
      endHour: entry.endHour,
      endMinute: entry.endMinute,
      minutesSinceLastWaterIntake: entry.minutesSinceLastWaterIntake,
      periodInMinutes: entry.periodInMinutes,
    };   
  }

  private fromRemindersV1(
    reminders: HydrationDailyPlanRemindersDetailsV1,
  ): HydrationDailyPlanReminders {
    return {
      enabled: reminders.enabled,
      entries: reminders.entries.map(entry => this.fromReminderEntryV1(entry)),
    };
  }

  public fromBuffer(buffer: Buffer): HydrationDailyPlanForBuffer {
    const details = decode(buffer) as HydrationDailyPlanDetailsV1;
    return {
      goals: this.fromGoalsV1(details.goals),
      reminders: this.fromRemindersV1(details.reminders),
    };
  }
}
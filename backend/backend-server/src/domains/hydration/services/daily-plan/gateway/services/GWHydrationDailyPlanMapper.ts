import { Injectable } from '@nestjs/common';
import { 
  HydrationDailyPlan,
  HydrationDailyPlanForCreation,
  HydrationDailyPlanForUpdate,
  HydrationDailyPlanGoals,
  HydrationDailyPlanReminderEntry,
  HydrationDailyPlanReminders,
} from '@mealz/backend-hydration-daily-plan-service-api';
import {
  GWHydrationDailyPlan,
  GWHydrationDailyPlanForCreation,
  GWHydrationDailyPlanForUpdate,
  GWHydrationDailyPlanGoals,
  GWHydrationDailyPlanReminders,
  GWHydrationDailyPlanReminderEntry,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

@Injectable()
export class GWHydrationDailyPlanMapper {
  private fromGWHydrationDailyPlanGoals(
    gwGoals: GWHydrationDailyPlanGoals,
  ): HydrationDailyPlanGoals {
    return {
      glasses: gwGoals.glasses,
    };
  }

  private fromGWHydrationDailyPlanReminders(
    gwReminders: GWHydrationDailyPlanReminders,
  ): HydrationDailyPlanReminders {
    return {
      enabled: gwReminders.enabled,
      entries: gwReminders.entries.map(entry => {
        return this.fromGWHydrationDailyPlanReminderEntry(entry);
      }),
    };
  }

  private fromGWHydrationDailyPlanReminderEntry(
    gwEntry: GWHydrationDailyPlanReminderEntry,
  ): HydrationDailyPlanReminderEntry {
    return {
      startHour: gwEntry.startHour,
      startMinute: gwEntry.startMinute,
      endHour: gwEntry.endHour,
      endMinute: gwEntry.endMinute,
      minutesSinceLastWaterIntake: gwEntry.minutesSinceLastWaterIntake,
      periodInMinutes: gwEntry.periodInMinutes,
    };
  }
  public fromGWHydrationDailyPlanForCreation(
    userId: string,
    gwHydrationDailyPlan: GWHydrationDailyPlanForCreation,
  ): HydrationDailyPlanForCreation {
    return {
      userId,
      goals: this.fromGWHydrationDailyPlanGoals(
        gwHydrationDailyPlan.goals,
      ),
      reminders: this.fromGWHydrationDailyPlanReminders(
        gwHydrationDailyPlan.reminders,
      ),
    };
  }

  public fromGWHydrationDailyPlanForUpdate(
    hydrationDailyPlanId: string,
    userId: string,
    gwHydrationDailyPlan: GWHydrationDailyPlanForUpdate,
  ): HydrationDailyPlanForUpdate {
    return {
      id: hydrationDailyPlanId,
      userId,
      goals: this.fromGWHydrationDailyPlanGoals(
        gwHydrationDailyPlan.goals,
      ),
      reminders: this.fromGWHydrationDailyPlanReminders(
        gwHydrationDailyPlan.reminders,
      ),
    };
  }

  private fromHydrationDailyPlanGoals(
    goals: HydrationDailyPlanGoals,
  ): GWHydrationDailyPlanGoals {
    return {
      glasses: goals.glasses,
    };
  }

  private fromHydrationDailyPlanReminders(
    reminders: HydrationDailyPlanReminders,
  ): GWHydrationDailyPlanReminders {
    return {
      enabled: reminders.enabled,
      entries: reminders.entries.map(entry => {
        return this.fromHydrationDailyPlanReminderEntry(entry);
      }),
    };
  }

  private fromHydrationDailyPlanReminderEntry(
    entry: HydrationDailyPlanReminderEntry,
  ): GWHydrationDailyPlanReminderEntry {
    return {
      startHour: entry.startHour,
      startMinute: entry.startMinute,
      endHour: entry.endHour,
      endMinute: entry.endMinute,
      minutesSinceLastWaterIntake: entry.minutesSinceLastWaterIntake,
      periodInMinutes: entry.periodInMinutes,
    };
  }
  public fromHydrationDailyPlan(
    hydrationDailyPlan: HydrationDailyPlan,
  ): GWHydrationDailyPlan {
    return {
      id: hydrationDailyPlan.id,
      goals: this.fromHydrationDailyPlanGoals(
        hydrationDailyPlan.goals,
      ),
      reminders: this.fromHydrationDailyPlanReminders(
        hydrationDailyPlan.reminders,
      ),
      createdAt: hydrationDailyPlan.createdAt,
    };
  }
}
import { DateTime } from 'luxon';
import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import {
  GWMealDailyPlan,
  GWMealDailyPlanEntry,
  GWMealDailyPlanGoals,
  MealsDailyPlanV1API,
  ReadMealDailyPlansGWResponseV1,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { SystemService } from '../../system';

@Service()
export class MealsDailyPlanService {
  public constructor(
    private readonly http: HTTPWebClientService,
    private readonly systemService: SystemService,
  ) {}

  public async readCurrentDailyPlan(): Promise<GWMealDailyPlan | undefined> {
    const { data } = await this.http.get<ReadMealDailyPlansGWResponseV1>(
      MealsDailyPlanV1API.url.readManyV1({ limit: 1 }),
    );
    return data.mealDailyPlans[0];
  }

  public async readCurrentDailyGoals(
  ): Promise<GWMealDailyPlanGoals | undefined> {
    const { data } = await this.http.get<ReadMealDailyPlansGWResponseV1>(
      MealsDailyPlanV1API.url.readManyV1({ limit: 1 }),
    );
    const plan = data.mealDailyPlans[0];
    if (!plan) {
      return undefined;
    }

    const goals: GWMealDailyPlanGoals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
    plan.entries.forEach(entry => {
      goals.calories += entry.goals.calories;
      goals.protein += entry.goals.protein;
      goals.carbs += entry.goals.carbs;
      goals.fat += entry.goals.fat;
    });
    return goals;
  }

  public getEntry(
    plan: GWMealDailyPlan | undefined,
    timestamp: number,
  ): GWMealDailyPlanEntry | undefined {
    if (!plan) {
      return undefined;
    }

    const timeZone = this.systemService.getTimeZone();
    const minute = (hour: number, minute: number) => {
      return hour * 60 + minute;
    };
    const nowMinute = minute(
      DateTime.fromMillis(timestamp).setZone(timeZone).hour,
      DateTime.fromMillis(timestamp).setZone(timeZone).minute,
    );

    const { entries } = plan;
    // match all entries except the last one
    for (let index = 0; index < entries.length - 1; index++) {
      const entry = plan.entries[index];
      const startMinute = minute(entry.startHour, entry.startMinute);
      const endMinute = minute(entry.endHour, entry.endMinute);
      if (nowMinute >= startMinute && nowMinute < endMinute) {
        return entry;
      }
    }

    // last entry where the end hour:minute is 00:00
    const lastEntry = entries[entries.length - 1];
    const startMinute = minute(lastEntry.startHour, lastEntry.startMinute);
    if (nowMinute >= startMinute) {
      return lastEntry;
    }

    return undefined;
  }

  public getMealName(
    plan: GWMealDailyPlan | undefined,
    timestamp: number,
  ): string | undefined {
    const entry = this.getEntry(plan, timestamp);
    return entry?.mealName;
  }
}
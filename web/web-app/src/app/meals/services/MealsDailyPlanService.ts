import { DateTime } from 'luxon';
import { Service } from '@andcreations/common';
import { HTTPWebClientService } from '@andcreations/web-common';
import {
  CreateMealDailyPlanGWRequestV1,
  GWMealDailyPlan,
  GWMealDailyPlanEntry,
  GWMealDailyPlanForCreation,
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
    return this.summarizeEntries(plan.entries);
  }

  public async readCurrentDailyGoalsByNow(
  ): Promise<GWMealDailyPlanGoals | undefined> {
    const { data } = await this.http.get<ReadMealDailyPlansGWResponseV1>(
      MealsDailyPlanV1API.url.readManyV1({ limit: 1 }),
    );
    const plan = data.mealDailyPlans[0];
    if (!plan) {
      return undefined;
    }
    const entries = this.getEntriesByNow(plan);
    return this.summarizeEntries(entries);
  }

  public summarizeEntries(
    entries: GWMealDailyPlanEntry[],
  ): GWMealDailyPlanGoals {
    const goals: GWMealDailyPlanGoals = {
      caloriesFrom: 0,
      caloriesTo: 0,
      proteinFrom: 0,
      proteinTo: 0,
      carbsFrom: 0,
      carbsTo: 0,
      fatFrom: 0,
      fatTo: 0,
    };
    entries.forEach(entry => {
      goals.caloriesFrom += entry.goals.caloriesFrom;
      goals.caloriesTo += entry.goals.caloriesTo;
      goals.proteinFrom += entry.goals.proteinFrom;
      goals.proteinTo += entry.goals.proteinTo;
      goals.carbsFrom += entry.goals.carbsFrom;
      goals.carbsTo += entry.goals.carbsTo;
      goals.fatFrom += entry.goals.fatFrom;
      goals.fatTo += entry.goals.fatTo;
    });
    return goals;
  }

  public async readEntriesByNow(): Promise<GWMealDailyPlanEntry[]> {
    const plan = await this.readCurrentDailyPlan();
    return this.getEntriesByNow(plan);
  }

  public async readCurrentEntry(): Promise<GWMealDailyPlanEntry | undefined> {
    const plan = await this.readCurrentDailyPlan();
    return this.getEntryByTime(plan, Date.now());
  }

  public async readCurrentGoals(): Promise<GWMealDailyPlanGoals | undefined> {
    const entry = await this.readCurrentEntry();
    return entry?.goals;
  }

  public async createDailyPlan(
    mealDailyPlan: GWMealDailyPlanForCreation,
  ): Promise<void> {
    const request: CreateMealDailyPlanGWRequestV1 = {
      mealDailyPlan,
    };
    await this.http.post<CreateMealDailyPlanGWRequestV1>(
      MealsDailyPlanV1API.url.createV1(),
      request,
    );
  }

  private minuteSinceMidnight(hour: number, minute: number): number {
    return hour * 60 + minute;
  }

  private matchEntryByHourAndMinute(
    plan: GWMealDailyPlan | undefined,
    hour: number,
    minute: number,
  ): GWMealDailyPlanEntry | undefined {
    if (!plan) {
      return undefined;
    }
    const nowMinute = this.minuteSinceMidnight(hour, minute);

    const { entries } = plan;
    // match all entries except the last one
    for (let index = 0; index < entries.length - 1; index++) {
      const entry = entries[index];
      const startMinute = this.minuteSinceMidnight(
        entry.startHour,
        entry.startMinute,
      );
      const endMinute = this.minuteSinceMidnight(
        entry.endHour,
        entry.endMinute,
      );
      if (nowMinute >= startMinute && nowMinute < endMinute) {
        return entry;
      }
    }

    // last entry where the end hour:minute is 00:00
    const lastEntry = entries[entries.length - 1];
    const startMinute = this.minuteSinceMidnight(
      lastEntry.startHour,
      lastEntry.startMinute,
    );
    if (nowMinute >= startMinute) {
      return lastEntry;
    }

    return undefined;    
  }

  public getEntryByTime(
    plan: GWMealDailyPlan | undefined,
    timestamp: number,
  ): GWMealDailyPlanEntry | undefined {
    if (!plan) {
      return undefined;
    }

    const timeZone = this.systemService.getTimeZone();
    const dateTime = DateTime.fromMillis(timestamp).setZone(timeZone);

    return this.matchEntryByHourAndMinute(
      plan,
      dateTime.hour,
      dateTime.minute,
    );
  }

  public getEntriesByNow(
    plan: GWMealDailyPlan | undefined,
  ): GWMealDailyPlanEntry[] {
    if (!plan) {
      return [];
    }

    const timeZone = this.systemService.getTimeZone();
    const dateTime = DateTime.fromMillis(Date.now()).setZone(timeZone);
    const nowMinute = this.minuteSinceMidnight(dateTime.hour, dateTime.minute);

    return plan.entries.filter(entry => {
      const startMinute = this.minuteSinceMidnight(
        entry.startHour,
        entry.startMinute,
      );      
      return nowMinute >= startMinute;
    });
  }

  public getEntryByMealName(
    plan: GWMealDailyPlan | undefined,
    mealName: string,
  ): GWMealDailyPlanEntry | undefined {
    if (!plan) {
      return undefined;
    }
    return plan.entries.find(entry => entry.mealName === mealName);
  }

  public getMealName(
    plan: GWMealDailyPlan | undefined,
    timestamp: number,
  ): string | undefined {
    if (!plan) {
      return undefined;
    }
    const entry = this.getEntryByTime(plan, timestamp);
    return entry?.mealName;
  }

  public getMealNames(plan: GWMealDailyPlan | undefined,): string[] {
    if (!plan) {
      return [];
    }
    return plan.entries.map(entry => entry.mealName);
  }
}
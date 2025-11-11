import { BadRequestException } from '@nestjs/common';
import { CreateMealDailyPlanGWRequestV1Impl } from '../dtos';
import { GWMealDailyPlanEntryImpl } from '../types';

export class CreateMealDailyPlanGWRequestV1Validator {
  public static validate(request: CreateMealDailyPlanGWRequestV1Impl): void {
    const entries = request.mealDailyPlan.entries;
    const throwInvalid = (message: string) => {
      throw new BadRequestException(message)
    }
    const startMinute = (entry: GWMealDailyPlanEntryImpl) => {
      return entry.startHour * 60 + entry.startMinute;
    }
    const endMinute = (entry: GWMealDailyPlanEntryImpl) => {
      return entry.endHour * 60 + entry.endMinute;
    }

    // meal names must be unique
    const mealNameSet = new Set<string>();
    entries.forEach(entry => {
      if (mealNameSet.has(entry.mealName)) {
        throwInvalid('Meals name must be unique');
      }
      mealNameSet.add(entry.mealName);
    });

    // first start time must be midnight
    const firstEntry = entries[0];
    const firstMinute = startMinute(firstEntry);
    if (firstMinute !== 0) {
      throwInvalid('First start time must be midnight');
    }

    // last end time must be midnight
    const lastEntry = entries[entries.length - 1];
    const lastMinute = endMinute(lastEntry);
    if (lastMinute !== 0) {
      throwInvalid('Last end time must be midnight');
    }

    // start time must be before end time (except for last entry)
    for (let index = 0; index < entries.length - 1; index++) {
      const entry = entries[index];
      if (startMinute(entry) >= endMinute(entry)) {
        throwInvalid('Start time must be before end time');
      }
    }

    // times must be adjacent
    for (let index = 0; index < entries.length - 1; index++) {
      const endTime = endMinute(entries[index]);
      const nextStartTime = startMinute(entries[index + 1]);
      if (endTime !== nextStartTime) {
        throwInvalid('Times must be adjacent');
      }
    }
  }
}
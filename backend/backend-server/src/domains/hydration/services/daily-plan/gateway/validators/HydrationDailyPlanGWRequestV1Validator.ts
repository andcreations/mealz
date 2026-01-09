import { BadRequestException } from '@nestjs/common';
import { CreateHydrationDailyPlanGWRequestV1Impl } from '../dtos';

export class HydrationDailyPlanGWRequestV1Validator {
  public static validate(
    request: CreateHydrationDailyPlanGWRequestV1Impl,
  ): void {
    const throwInvalid = (message: string) => {
      throw new BadRequestException(message)
    }
    const { hydrationDailyPlan } = request;
    const { reminders } = hydrationDailyPlan;

    const minute = (hour: number, minute: number) => {
      return hour * 60 + minute;
    }

    // start time must be before end time
    reminders.entries.forEach(entry => {
      const startMinute = minute(entry.startHour, entry.startMinute);
      const endMinute = minute(entry.endHour, entry.endMinute);
      if (startMinute >= endMinute) {
        throwInvalid('Start time must be before end time');
      }
    });
  }
}
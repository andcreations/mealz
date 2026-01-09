import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TimePeriod } from '@andcreations/common';
import {
  SummarizeMealLogQueryParamsV1,
} from '@mealz/backend-meals-log-gateway-api';

const MAX_DATE_RANGE_DAYS = 7;
const MAX_DATE_RANGE = TimePeriod.fromStr(`${MAX_DATE_RANGE_DAYS}d`);

export class SummarizeMealLogParamsV1Impl
  implements SummarizeMealLogQueryParamsV1
{
  @ApiProperty({
    description: 'Date from which to summarize the meal logs',
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  public fromDate: number;

  @ApiProperty({
    description: 'Date to which to summarize the meal logs',
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  public toDate: number;

  public static validate(
    gwParams: SummarizeMealLogQueryParamsV1,
  ): void {
    const { fromDate, toDate } = gwParams;
    if (toDate - fromDate > MAX_DATE_RANGE) {
      throw new BadRequestException(
        `Date range must be less than ${MAX_DATE_RANGE_DAYS} days`,
      );
    }
  }
}
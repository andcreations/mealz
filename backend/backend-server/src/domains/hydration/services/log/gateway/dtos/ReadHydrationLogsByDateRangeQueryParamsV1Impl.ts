import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { TimePeriod } from '@andcreations/common';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { 
  ReadHydrationLogsByDateRangeQueryParamsV1,
} from '@mealz/backend-hydration-log-gateway-api';

const MAX_DATE_RANGE_DAYS = 7;
const MAX_DATE_RANGE = TimePeriod.fromStr(`${MAX_DATE_RANGE_DAYS}d`);

export class ReadHydrationLogsByDateRangeQueryParamsV1Impl
  implements ReadHydrationLogsByDateRangeQueryParamsV1
{
  @ApiProperty({
    description: 'Date from which to read the hydration logs',
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  public fromDate: number;

  @ApiProperty({
    description: 'Date to which to read the hydration logs',
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  public toDate: number;

  public static validate(
    gwParams: ReadHydrationLogsByDateRangeQueryParamsV1,
  ): void {
    const { fromDate, toDate } = gwParams;
    if (toDate - fromDate > MAX_DATE_RANGE) {
      throw new BadRequestException(
        `Date range must be less than ${MAX_DATE_RANGE_DAYS} days`,
      );
    }
  }
}
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TimePeriod } from '@andcreations/common';

const MAX_DATE_RANGE_DAYS = 7;
const MAX_DATE_RANGE = TimePeriod.fromStr(`${MAX_DATE_RANGE_DAYS}d`);

export class ReadMealLogsByDateRangeQueryParamsV1 {
  @ApiProperty({
    description: 'Date from which to read the meal logs',
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  public fromDate: number;

  @ApiProperty({
    description: 'Date to which to read the meal logs',
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  public toDate: number;

  public static validate(
    gwParams: ReadMealLogsByDateRangeQueryParamsV1,
  ): void {
    const { fromDate, toDate } = gwParams;
    if (toDate - fromDate > MAX_DATE_RANGE) {
      throw new BadRequestException(
        `Date range must be less than ${MAX_DATE_RANGE_DAYS} days`,
      );
    }
  }
}
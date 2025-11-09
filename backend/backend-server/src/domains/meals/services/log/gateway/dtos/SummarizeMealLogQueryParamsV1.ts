import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SummarizeMealLogQueryParamsV1 {
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
}
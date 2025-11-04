import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class SummarizeMealLogQueryParamsV1 {
  @ApiProperty({
    description: 'Date from which to summarize the meal logs',
  })
  @IsInt()
  @Min(0)
  public fromDate: number;

  @ApiProperty({
    description: 'Date to which to summarize the meal logs',
  })
  @IsInt()
  @Min(0)
  public toDate: number;
}
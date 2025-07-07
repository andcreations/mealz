import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

const DEFAULT_LIMIT = 100;

export class ReadFromLastV1GWQueryParams {
  @IsString()
  @IsOptional()
  public lastId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => Number(value ?? DEFAULT_LIMIT))
  public limit: number;
}
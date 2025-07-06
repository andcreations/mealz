import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class ReadManyV1GWQueryParams {
  @IsString()
  @IsOptional()
  public lastId?: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  public limit: number;
}
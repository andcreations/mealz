import { applyDecorators } from '@nestjs/common';
import { IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export const DEFAULT_LIMIT = 100;
export const MAX_LIMIT = 100;

export interface IsLimitOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

export function IsLimit(options?: IsLimitOptions) {
  const defaultLimit = options?.defaultLimit ?? DEFAULT_LIMIT;
  return applyDecorators(
    IsNumber(),
    Min(1),
    Max(options?.maxLimit ?? MAX_LIMIT),
    Transform(({ value }) => Number(value ?? defaultLimit))
  );
}
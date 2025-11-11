import { applyDecorators } from '@nestjs/common';
import { IsNumber, Max, Min } from 'class-validator';

export function IsHour() {
  return applyDecorators(IsNumber(), Min(0), Max(23));
}
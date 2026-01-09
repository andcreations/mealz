import { applyDecorators } from '@nestjs/common';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export function IsHour() {
  return applyDecorators(IsNumber(), IsInt(), Min(0), Max(23));
}
import { applyDecorators } from '@nestjs/common';
import { IsNumber, Min } from 'class-validator';

export function IsCalories() {
  return applyDecorators(IsNumber(), Min(1));
}
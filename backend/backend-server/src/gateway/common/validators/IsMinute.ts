import { applyDecorators } from '@nestjs/common';
import { IsNumber, Min, Max } from 'class-validator';

export function IsMinute() {
  return applyDecorators(IsNumber(), Min(0), Max(59));
}
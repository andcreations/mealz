import { applyDecorators } from '@nestjs/common';
import { IsInt, IsNumber, Min, Max } from 'class-validator';

export function IsMinute() {
  return applyDecorators(IsNumber(), IsInt(), Min(0), Max(59));
}
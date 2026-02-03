import { applyDecorators } from '@nestjs/common';
import { IsNumber, Min } from 'class-validator';

export function IsCarbs() {
  return applyDecorators(IsNumber(), Min(0));
}
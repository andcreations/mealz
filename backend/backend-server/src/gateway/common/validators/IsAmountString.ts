import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

export function IsAmountString() {
  return applyDecorators(IsString(), Length(0, 16));
}
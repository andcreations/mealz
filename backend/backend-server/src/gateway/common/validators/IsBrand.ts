import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

export function IsBrand() {
  return applyDecorators(IsString(), Length(0, 64));
}
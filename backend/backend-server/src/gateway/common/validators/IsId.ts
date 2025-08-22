import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

export function IsId() {
  return applyDecorators(IsString(), Length(0, 32));
}
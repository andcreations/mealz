import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

export function IsName() {
  return applyDecorators(IsString(), Length(0, 64));
}
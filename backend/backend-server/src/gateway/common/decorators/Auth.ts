import { applyDecorators, UseGuards } from '@nestjs/common'
import { AuthGuard } from './AuthGuard'
import { UserRole } from '#mealz/backend-api';

export interface AuthOptions {
  roles?: UserRole[];
}

export const Auth = (options?: AuthOptions): MethodDecorator => {
  return applyDecorators(
    UseGuards(AuthGuard),
  )
}
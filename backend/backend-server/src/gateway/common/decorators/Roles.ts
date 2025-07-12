import { Reflector } from '@nestjs/core';
import { UserRole } from '@mealz/backend-api';

export const Roles = Reflector.createDecorator<UserRole[]>();
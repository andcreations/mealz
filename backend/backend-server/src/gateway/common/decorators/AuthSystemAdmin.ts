import { applyDecorators, UseGuards } from '@nestjs/common'

import { AuthSystemAdminGuard } from './AuthSystemAdminGuard'

export const AuthSystemAdmin = (): MethodDecorator => {
  return applyDecorators(UseGuards(AuthSystemAdminGuard))
}

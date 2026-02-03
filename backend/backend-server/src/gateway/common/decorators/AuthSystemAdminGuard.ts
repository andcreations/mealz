import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { requireStrEnv } from '@mealz/backend-common'

import { SYSTEM_ADMIN_TOKEN_HTTP_HEADER } from '../consts'

@Injectable()
export class AuthSystemAdminGuard implements CanActivate {
  private readonly systemAdminToken: string;

  public constructor() {
    this.systemAdminToken = requireStrEnv('MEALZ_SYSTEM_ADMIN_TOKEN')
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const systemAdminToken = request.headers[SYSTEM_ADMIN_TOKEN_HTTP_HEADER]
    if (!this.isHttpSystemAdminTokenValid(systemAdminToken)) {
      // not found because we don't want to leak the existence of the endpoint
      throw new NotFoundException()
    }
    return true
  }

  private isHttpSystemAdminTokenValid(token: string): boolean {
    return token === this.systemAdminToken
  }
}

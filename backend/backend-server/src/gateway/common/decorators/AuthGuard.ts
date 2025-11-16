import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_COOKIE_NAME } from '@mealz/backend-api';
import { requireStrEnv } from '@mealz/backend-common';
import { JwtPayload, JWT_SECRET_ENV_NAME } from '@mealz/backend-gateway-core';

import { getLogger } from '../../../logger';
import { AccessForbiddenError } from '../errors';
import { Roles } from './Roles';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret: string;

  public constructor(private reflector: Reflector) {
    this.jwtSecret = requireStrEnv(JWT_SECRET_ENV_NAME);
  }

  private authorize(context: ExecutionContext, accessToken?: string): void {
    if (!accessToken) {
      throw new AccessForbiddenError();
    }

    // verify
    let rawPayload: jwt.JwtPayload | string;
    try {
      rawPayload = jwt.verify(accessToken, this.jwtSecret);
    } catch (error) {
      throw new AccessForbiddenError();
    }
    if (typeof rawPayload === 'string') {
      throw new AccessForbiddenError();
    }

    // payload
    const payload = rawPayload as JwtPayload;

    // roles
    const roles = this.reflector.get(Roles, context.getHandler());
    if (roles && !roles.some(role => payload.user.roles.includes(role))) {
      throw new AccessForbiddenError();
    }

    // store in request
    const request = context.switchToHttp().getRequest();
    request.user = payload.user;
    
    // log user
    const correlationId = (request as any).correlationId;
    getLogger().debug('HTTP request user', {
      correlationId,
      user: {
        id: payload.user.id,
        roles: payload.user.roles,
      },
    });
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    this.authorize(context, (request.cookies ?? {})[ACCESS_TOKEN_COOKIE_NAME]);
    return true;
  }
}
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { getLogger } from '@mealz/backend-logger';
import { generateCorrelationId } from '@mealz/backend-core';
import { ACCESS_TOKEN_COOKIE_NAME } from '@mealz/backend-api';
import { requireStrEnv } from '@mealz/backend-common';
import { JwtPayload, JWT_SECRET_ENV_NAME } from '@mealz/backend-gateway-core';
import { AccessForbiddenError } from '@mealz/backend-gateway-common';

import { SOCKET_CORRELATION_ID_PREFIX } from '../consts';

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      cookies[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
    }
  }
  return cookies;
}

@Injectable()
export class SocketAuthMiddleware {
  private readonly jwtSecret: string;

  public constructor() {
    this.jwtSecret = requireStrEnv(JWT_SECRET_ENV_NAME);
  }

  public createMiddleware(): (
    socket: Socket,
    next: (err?: Error) => void,
  ) => void {
    return (socket: Socket, next: (err?: Error) => void): void => {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) {
        next(new AccessForbiddenError());
        return;
      }

      const cookies = parseCookies(cookieHeader);
      const accessToken = cookies[ACCESS_TOKEN_COOKIE_NAME];
      if (!accessToken) {
        next(new AccessForbiddenError());
        return;
      }

      let rawPayload: jwt.JwtPayload | string;
      try {
        rawPayload = jwt.verify(accessToken, this.jwtSecret);
      } catch (error) {
        next(new AccessForbiddenError());
        return;
      }
      if (typeof rawPayload === 'string') {
        next(new AccessForbiddenError());
        return;
      }
    
      const payload = rawPayload as JwtPayload;
      const correlationId = generateCorrelationId(SOCKET_CORRELATION_ID_PREFIX);

      // keep information in the socket data
      socket.data.user = payload.user;
      socket.data.correlationId = correlationId;

      getLogger().debug('Socket authenticated', {
        correlationId,
        socketId: socket.id,
        user: {
          id: payload.user.id,
          roles: payload.user.roles,
        },
      });

      next();
    };
  }
}

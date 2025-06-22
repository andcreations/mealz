import { Response } from 'express';
import { FastifyReply } from 'fastify';
import { isExpress, isFastify } from '#mealz/backend-common';

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'none' | 'strict' | boolean;
  maxAge?: number;
  domain?: string;
  path?: string;
  priority?: 'low' | 'medium' | 'high';
}

export function setCookie(
  response: Response | FastifyReply,
  name: string,
  value: string,
  options: CookieOptions,
) {
  if (isFastify()) {
    const fastifyResponse = response as FastifyReply;
    fastifyResponse.setCookie(name, value, options);
    return;
  }
  
  if (isExpress()) {
    const expressResponse = response as Response;
    expressResponse.cookie(name, value, options);
    return;
  }

  throw new Error('Invalid response type when setting cookie');
}
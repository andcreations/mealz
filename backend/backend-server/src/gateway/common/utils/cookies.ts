import { Response } from 'express';

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
  response: Response,
  name: string,
  value: string,
  options: CookieOptions,
) {
  response.cookie(name, value, options);
}
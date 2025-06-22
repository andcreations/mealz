import * as jwt from 'jsonwebtoken';
import { AuthUser } from './AuthUser';

export interface JwtPayload extends jwt.JwtPayload {
  user: AuthUser;
}
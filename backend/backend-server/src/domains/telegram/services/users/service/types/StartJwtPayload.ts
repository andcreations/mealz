import * as jwt from 'jsonwebtoken';

export interface StartJwtPayloadUser {
  userId: string;
}

export interface StartJwtPayload extends jwt.JwtPayload {
  user: StartJwtPayloadUser;
}
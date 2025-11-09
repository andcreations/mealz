import { 
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Response } from 'express';
import { ACCESS_TOKEN_COOKIE_NAME, UserRole } from '@mealz/backend-api';
import { Context } from '@mealz/backend-core';
import { isSecure } from '@mealz/backend-common';
import { AuthUser } from '@mealz/backend-gateway-core';
import {
  Auth,
  GWContext,
  GWUser,
  Roles,
  setCookie,
} from '@mealz/backend-gateway-common';
import { USERS_AUTH_URL } from '@mealz/backend-users-auth-gateway-api';

import {
  UserAuthGWRequestV1Impl,
  UserAuthGWResponseV1Impl,
  CheckUserAuthGWResponseV1Impl,
} from '../dtos';
import { ACCESS_TOKEN_COOKIE_MAX_AGE } from '../consts';
import { UserAuthGWService } from '../services';

@Controller(USERS_AUTH_URL)
export class UserAuthGWController {
  public constructor(
    private readonly userAuthGWService: UserAuthGWService,
  ) {}

  @Post('v1')
  @HttpCode(HttpStatus.OK)
  public async signInV1(
    @Body() gwRequest: UserAuthGWRequestV1Impl,
    @GWContext() context: Context,
    @Res({ passthrough: true }) response: Response | FastifyReply,
  ): Promise<UserAuthGWResponseV1Impl> {
    const authResponse = await this.userAuthGWService.userAuthV1(
      gwRequest,
      context,
    );
    
    setCookie(
      response,
      ACCESS_TOKEN_COOKIE_NAME,
      authResponse.accessToken,
      {
        path: '/',
        httpOnly: true,
        secure: isSecure(),
        sameSite: 'strict',
        maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
      },
    ); 
   
    return authResponse;
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Delete('v1')
  @HttpCode(HttpStatus.OK)
  public async signOutV1(
    @Res({ passthrough: true }) response: Response | FastifyReply,
  ): Promise<void> {
    setCookie(
      response,
      ACCESS_TOKEN_COOKIE_NAME,
      '',
      {
        path: '/',
        httpOnly: true,
        secure: isSecure(),
        sameSite: 'strict',
        maxAge: 0,
      },
    ); 
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Get('check/v1')
  @HttpCode(HttpStatus.OK)
  public async checkV1(
    @GWUser() gwUser: AuthUser,
  ): Promise<CheckUserAuthGWResponseV1Impl> {
    return { userId: gwUser.id };
  }
}
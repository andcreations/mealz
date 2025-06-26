import { 
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Response } from 'express';
import { ACCESS_TOKEN_COOKIE_NAME, UserRole } from '#mealz/backend-api';
import { Context } from '#mealz/backend-core';
import { daysToMs, isSecure } from '#mealz/backend-common';
import {
  Auth,
  GWContext,
  Roles,
  setCookie,
} from '#mealz/backend-gateway-common';
import { USERS_AUTH_URL } from '#mealz/backend-users-auth-gateway-api';

import { UserAuthGWRequestV1Impl, UserAuthGWResponseV1Impl } from '../dtos';
import { UserAuthGWService } from '../services';

@Controller(USERS_AUTH_URL)
export class UserAuthGWController {
  public constructor(
    private readonly userAuthGWService: UserAuthGWService,
  ) {}

  @Post('v1')
  @HttpCode(200)
  public async authUserV1(
    @Body() body: UserAuthGWRequestV1Impl,
    @GWContext() context: Context,
    @Res({ passthrough: true }) response: Response | FastifyReply,
  ): Promise<UserAuthGWResponseV1Impl> {
    const authResponse = await this.userAuthGWService.userAuth(body, context);
    
    setCookie(
      response,
      ACCESS_TOKEN_COOKIE_NAME,
      authResponse.accessToken,
      {
        path: '/',
        httpOnly: true,
        secure: isSecure(),
        sameSite: 'strict',
        maxAge: daysToMs(365),
      },
    ); 
   
    return authResponse;
  }

  @Auth()
  @Roles([UserRole.USER, UserRole.ADMIN])
  @Delete('v1')
  @HttpCode(200)
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
  @HttpCode(200)
  public async checkV1(): Promise<void> {
    // Nothing here, just to check if the user is logged in.
  }
}
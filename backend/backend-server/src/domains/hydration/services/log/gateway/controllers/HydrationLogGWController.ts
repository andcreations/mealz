import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { AuthUser } from '@mealz/backend-gateway-core';
import { UserRole } from '@mealz/backend-api';
import { Auth, GWContext, GWUser, Roles } from '@mealz/backend-gateway-common';
import {
  HYDRATION_LOG_V1_URL,
} from '../../gateway-api';

import { HydrationLogGWService } from '../services';

@Controller(HYDRATION_LOG_V1_URL)
export class HydrationLogGWController {
  public constructor(
    private readonly hydrationLogGWService: HydrationLogGWService,
  ) {}
}
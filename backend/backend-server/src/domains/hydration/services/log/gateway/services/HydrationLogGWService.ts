import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  HydrationLogTransporter,
} from '@mealz/backend-hydration-log-service-api';

@Injectable()
export class HydrationLogGWService {

  public constructor(
    private readonly hydrationLogTransporter: HydrationLogTransporter,
  ) {}
}
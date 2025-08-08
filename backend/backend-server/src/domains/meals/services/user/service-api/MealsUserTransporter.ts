import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Transporter } from '@mealz/backend-transport';

import { MEALS_USER_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsUserTopics } from './MealsUserTopics';
import {
  CreateUserMealRequestV1,
  CreateUserMealResponseV1,
  UpsertUserMealRequestV1,
} from './dtos';

@Injectable()
export class MealsUserTransporter {
  public constructor(
    @Inject(MEALS_USER_TRANSPORTER_TOKEN)
    private readonly transporter: Transporter,
  ) {}

  public async createUserMealV1(
    request: CreateUserMealRequestV1,
    context: Context,
  ): Promise<CreateUserMealResponseV1> {
    return this.transporter.sendRequest<
    CreateUserMealRequestV1, CreateUserMealResponseV1
    >(
      MealsUserTopics.CreateUserMealV1,
      request,
      context,
    );
  }

  public async upsertUserMealV1(
    request: UpsertUserMealRequestV1,
    context: Context,
  ): Promise<void> {
    return this.transporter.sendRequest<
      UpsertUserMealRequestV1, void
    >(
      MealsUserTopics.UpsertUserMealV1,
      request,
      context,
    );
  }
}
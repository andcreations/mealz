import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { MEALS_USER_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsUserTopics } from './MealsUserTopics';
import {
  ReadManyUserMealsRequestV1,
  ReadManyUserMealsResponseV1,
  CreateUserMealRequestV1,
  CreateUserMealResponseV1,
  UpsertUserMealRequestV1,
} from './dtos';

@Injectable()
export class MealsUserTransporter {
  public constructor(
    @Inject(MEALS_USER_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async readManyV1(
    request: ReadManyUserMealsRequestV1,
    context: Context,
  ): Promise<ReadManyUserMealsResponseV1> {
    return this.transporter.sendRequest<
    ReadManyUserMealsRequestV1, ReadManyUserMealsResponseV1
    >(
      MealsUserTopics.ReadManyV1,
      request,
      context,
    );
  }

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
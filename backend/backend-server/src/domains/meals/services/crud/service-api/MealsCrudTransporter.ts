import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { Transporter } from '@mealz/backend-transport';

import { MEALS_CRUD_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsCrudTopics } from './MealsCrudTopics';
import {
  ReadMealByIdRequestV1,
  ReadMealByIdResponseV1,
  CreateMealRequestV1,
  CreateMealResponseV1,
  UpsertMealRequestV1,
  DeleteMealByIdRequestV1,
} from './dtos';

@Injectable()
export class MealsCrudTransporter {
  public constructor(
    @Inject(MEALS_CRUD_TRANSPORTER_TOKEN)
    private readonly transporter: Transporter,
  ) {}

  public async readMealByIdV1(
    request: ReadMealByIdRequestV1,
    context: Context,
  ): Promise<ReadMealByIdResponseV1> {
    return this.transporter.sendRequest<
      ReadMealByIdRequestV1, ReadMealByIdResponseV1
    >(
      MealsCrudTopics.ReadMealByIdV1,
      request,
      context,
    );
  }

  public async createMealV1(
    request: CreateMealRequestV1,
    context: Context,
  ): Promise<CreateMealResponseV1> {
    return this.transporter.sendRequest<
    CreateMealRequestV1, CreateMealResponseV1
    >(
      MealsCrudTopics.CreateMealV1,
      request,
      context,
    );
  }

  public async upsertMealV1(
    request: UpsertMealRequestV1,
    context: Context,
  ): Promise<void> {
    return this.transporter.sendRequest<
      UpsertMealRequestV1, void
    >(
      MealsCrudTopics.UpsertMealV1,
      request,
      context,
    );
  }

  public async deleteMealByIdRequestV1(
    request: DeleteMealByIdRequestV1,
    context: Context,
  ): Promise<void> {
    return this.transporter.sendRequest<
    DeleteMealByIdRequestV1, void
    >(
      MealsCrudTopics.DeleteMealByIdV1,
      request,
      context,
    );
  }
}
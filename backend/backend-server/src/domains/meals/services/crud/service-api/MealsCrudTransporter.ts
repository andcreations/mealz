import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  RequestTransporter,
  VoidTransporterResponse,
} from '@mealz/backend-transport';

import { MEALS_CRUD_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsCrudRequestTopics } from './MealsCrudRequestTopics';
import {
  ReadMealByIdRequestV1,
  ReadMealByIdResponseV1,
  ReadMealsByIdRequestV1,
  ReadMealsByIdResponseV1,
  CreateMealRequestV1,
  CreateMealResponseV1,
  UpsertMealRequestV1,
  UpsertMealResponseV1,
  DeleteMealByIdRequestV1,
} from './dtos';

@Injectable()
export class MealsCrudTransporter {
  public constructor(
    @Inject(MEALS_CRUD_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async readMealByIdV1(
    request: ReadMealByIdRequestV1,
    context: Context,
  ): Promise<ReadMealByIdResponseV1> {
    return this.transporter.sendRequest<
      ReadMealByIdRequestV1, ReadMealByIdResponseV1
    >(
      MealsCrudRequestTopics.ReadMealByIdV1,
      request,
      context,
    );
  }

  public async readMealsByIdV1(
    request: ReadMealsByIdRequestV1,
    context: Context,
  ): Promise<ReadMealsByIdResponseV1> {
    return this.transporter.sendRequest<
      ReadMealsByIdRequestV1, ReadMealsByIdResponseV1
    >(
      MealsCrudRequestTopics.ReadMealsByIdV1,
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
      MealsCrudRequestTopics.CreateMealV1,
      request,
      context,
    );
  }

  public async upsertMealV1(
    request: UpsertMealRequestV1,
    context: Context,
  ): Promise<UpsertMealResponseV1> {
    return this.transporter.sendRequest<
      UpsertMealRequestV1, UpsertMealResponseV1
    >(
      MealsCrudRequestTopics.UpsertMealV1,
      request,
      context,
    );
  }

  public async deleteMealByIdV1(
    request: DeleteMealByIdRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.transporter.sendRequest<
      DeleteMealByIdRequestV1, VoidTransporterResponse
    >(
      MealsCrudRequestTopics.DeleteMealByIdV1,
      request,
      context,
    );
  }
}
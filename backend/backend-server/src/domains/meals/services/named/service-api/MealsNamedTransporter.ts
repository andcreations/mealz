import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { MEALS_NAMED_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsNamedRequestTopics } from './MealsNamedRequestTopics';
import {
  CreateNamedMealRequestV1,
  CreateNamedMealResponseV1,
  DeleteNamedMealRequestV1,
  ReadNamedMealByIdRequestV1,
  ReadNamedMealByIdResponseV1,
  ReadNamedMealsFromLastRequestV1,
  ReadNamedMealsFromLastResponseV1,
  UpdateNamedMealRequestV1,
} from './dtos';

@Injectable()
export class MealsNamedTransporter {
  public constructor(
    @Inject(MEALS_NAMED_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async readNamedMealByIdV1(
    request: ReadNamedMealByIdRequestV1,
    context: Context,
  ): Promise<ReadNamedMealByIdResponseV1> {
    return await this.transporter.sendRequest<
      ReadNamedMealByIdRequestV1, ReadNamedMealByIdResponseV1
    >(
      MealsNamedRequestTopics.ReadNamedMealByIdV1,
      request, context,
    );
  }

  public async readNamedMealsFromLastV1(
    request: ReadNamedMealsFromLastRequestV1,
    context: Context,
  ): Promise<ReadNamedMealsFromLastResponseV1> {
    return await this.transporter.sendRequest(
      MealsNamedRequestTopics.ReadNamedMealsFromLastV1,
      request,
      context,
    );
  }

  public async createNamedMealV1(
    request: CreateNamedMealRequestV1,
    context: Context,
  ): Promise<CreateNamedMealResponseV1> {
    return await this.transporter.sendRequest<
      CreateNamedMealRequestV1, CreateNamedMealResponseV1
    >(
      MealsNamedRequestTopics.CreateNamedMealV1,
      request,
      context,
    );
  }

  public async updateNamedMealV1(
    request: UpdateNamedMealRequestV1,
    context: Context,
  ): Promise<void> {
    return await this.transporter.sendRequest<
      UpdateNamedMealRequestV1, void
    >(
      MealsNamedRequestTopics.UpdateNamedMealV1,
      request,
      context,
    );
  }

  public async deleteNamedMealV1(
    request: DeleteNamedMealRequestV1,
    context: Context,
  ): Promise<void> {
    return await this.transporter.sendRequest<
      DeleteNamedMealRequestV1, void
    >(
      MealsNamedRequestTopics.DeleteNamedMealV1,
      request,
      context,
    );
  }
}
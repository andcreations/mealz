import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestController, RequestHandler } from '@mealz/backend-transport';
import {
  ReadByUserIdAndPropertyIdRequestV1,
  ReadByUserIdAndPropertyIdResponseV1,
  UpsertUserPropertiesRequestV1,
  UpsertUserPropertiesResponseV1,
  UsersPropertiesRequestTopics,
} from '@mealz/backend-users-properties-service-api';

import { UsersPropertiesService } from '../services';

@Injectable()
@RequestController()
export class UsersPropertiesRequestController {
  public constructor(
    private readonly usersPropertiesService: UsersPropertiesService,
  ) {}

  @RequestHandler(UsersPropertiesRequestTopics.ReadByUserIdAndPropertyIdV1)
  public async readByUserIdAndPropertyIdV1(
    request: ReadByUserIdAndPropertyIdRequestV1,
    context: Context,
  ): Promise<ReadByUserIdAndPropertyIdResponseV1> {
    return this.usersPropertiesService.readByUserIdAndPropertyIdV1(
      request,
      context,
    );
  }

  @RequestHandler(UsersPropertiesRequestTopics.UpsertUserPropertiesV1)
  public async upsertUserPropertiesV1(
    request: UpsertUserPropertiesRequestV1,
    context: Context,
  ): Promise<UpsertUserPropertiesResponseV1> {
    return this.usersPropertiesService.upsertUserPropertiesV1(
      request,
      context,
    );
  }
}

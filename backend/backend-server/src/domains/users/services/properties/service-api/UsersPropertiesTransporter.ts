import { Inject } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { USERS_PROPERTIES_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { UsersPropertiesRequestTopics } from './UsersPropertiesRequestTopics';
import {
  ReadByUserIdAndPropertyIdRequestV1,
  ReadByUserIdAndPropertyIdResponseV1,
  UpsertUserPropertiesRequestV1,
  UpsertUserPropertiesResponseV1,
} from './dtos';

export class UsersPropertiesTransporter {
  public constructor(
    @Inject(USERS_PROPERTIES_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async readByUserIdAndPropertyIdV1(
    request: ReadByUserIdAndPropertyIdRequestV1,
    context: Context,
  ): Promise<ReadByUserIdAndPropertyIdResponseV1> {
    return this.transporter.sendRequest<
      ReadByUserIdAndPropertyIdRequestV1,
      ReadByUserIdAndPropertyIdResponseV1
    >(
      UsersPropertiesRequestTopics.ReadByUserIdAndPropertyIdV1,
      request,
      context,
    );
  }

  public async upsertUserPropertiesV1(
    request: UpsertUserPropertiesRequestV1,
    context: Context,
  ): Promise<UpsertUserPropertiesResponseV1> {
    return this.transporter.sendRequest<
      UpsertUserPropertiesRequestV1,
      UpsertUserPropertiesResponseV1
    >(UsersPropertiesRequestTopics.UpsertUserPropertiesV1, request, context);
  }
}

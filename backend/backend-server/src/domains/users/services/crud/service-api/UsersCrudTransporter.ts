import { Inject } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { USERS_CRUD_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { UsersCrudRequestTopics } from './UsersCrudRequestTopics';
import {
  ReadUserByIdRequestV1,
  ReadUserByIdResponseV1,
  ReadUsersFromLastRequestV1,
  ReadUsersFromLastResponseV1,
} from './dtos';

export class UsersCrudTransporter {
  public constructor(
    @Inject(USERS_CRUD_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}

  public async readUserByIdV1(
    request: ReadUserByIdRequestV1,
    context: Context,
  ): Promise<ReadUserByIdResponseV1> {
    return this.transporter.sendRequest<
      ReadUserByIdRequestV1, ReadUserByIdResponseV1
    >(
      UsersCrudRequestTopics.ReadUserByIdV1,
      request, context,
    );
  }

  public async readUsersFromLastV1(
    request: ReadUsersFromLastRequestV1,
    context: Context,
  ): Promise<ReadUsersFromLastResponseV1> {
    return this.transporter.sendRequest<
      ReadUsersFromLastRequestV1, ReadUsersFromLastResponseV1
    >(
      UsersCrudRequestTopics.ReadUsersFromLastV1,
      request, context,
    );
  }
}
import { RequestController, RequestHandler } from '@mealz/backend-transport';
import { Context } from '@mealz/backend-core';
import {
  ReadUserByIdRequestV1,
  ReadUserByIdResponseV1,
  UsersCrudRequestTopics,
} from '@mealz/backend-users-crud-service-api';

import { UsersCrudService } from '../services';

@RequestController()
export class UsersCrudRequestController {
  public constructor(
    private readonly usersCrudService: UsersCrudService,
  ) {}

  @RequestHandler(UsersCrudRequestTopics.ReadUserByIdV1)
  public async readUserByIdV1(
    request: ReadUserByIdRequestV1,
    context: Context,
  ): Promise<ReadUserByIdResponseV1> {
    return this.usersCrudService.readUserByIdV1(request, context);
  }
}
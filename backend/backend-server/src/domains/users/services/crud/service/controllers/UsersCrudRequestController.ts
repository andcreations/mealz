import { Context } from '@mealz/backend-core';
import {
  RequestController, 
  RequestHandler, 
  VoidTransporterResponse,
} from '@mealz/backend-transport';
import {
  CreateUserRequestV1,
  ReadUserByIdRequestV1,
  ReadUserByIdResponseV1,
  ReadUsersFromLastRequestV1,
  ReadUsersFromLastResponseV1,
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

  @RequestHandler(UsersCrudRequestTopics.ReadUsersFromLastV1)
  public async readUsersFromLastV1(
    request: ReadUsersFromLastRequestV1,
    context: Context,
  ): Promise<ReadUsersFromLastResponseV1> {
    return this.usersCrudService.readUsersFromLastV1(request, context);
  }

  @RequestHandler(UsersCrudRequestTopics.CreateUserV1)
  public async createUserV1(
    request: CreateUserRequestV1,
    context: Context,
  ): Promise<VoidTransporterResponse> {
    return this.usersCrudService.createUserV1(request, context);
  }
}
import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  ReadUserByIdRequestV1,
  ReadUserByIdResponseV1,
  ReadUsersFromLastRequestV1,
  ReadUsersFromLastResponseV1,
} from '@mealz/backend-users-crud-service-api';

import { UserByIdNotFoundError } from '../errors';
import { UsersCrudRepository } from '../repositories';

@Injectable()
export class UsersCrudService {
  public constructor(
    private readonly usersCrudRepository: UsersCrudRepository,
  ) {}

  public async readUserByIdV1(
    request: ReadUserByIdRequestV1,
    context: Context,
  ): Promise<ReadUserByIdResponseV1> {
    const user = await this.usersCrudRepository.readUserById(
      request.id,
      context,
    );
    if (!user) {
      throw new UserByIdNotFoundError(request.id);
    }
    return { user };
  }

  public async readUsersFromLastV1(
    request: ReadUsersFromLastRequestV1,
    context: Context,
  ): Promise<ReadUsersFromLastResponseV1> {
    const users = await this.usersCrudRepository.readUsersFromLast(
      request.lastId,
      request.limit,
      context,
    );
    return { users };
  }
}

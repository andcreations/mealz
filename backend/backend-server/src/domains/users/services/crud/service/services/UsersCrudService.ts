import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  ReadUserByIdRequestV1,
  ReadUserByIdResponseV1,
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
}

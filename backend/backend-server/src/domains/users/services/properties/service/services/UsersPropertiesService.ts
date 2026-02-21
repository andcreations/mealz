import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  ReadByUserIdAndPropertyIdRequestV1,
  ReadByUserIdAndPropertyIdResponseV1,
  UpsertUserPropertiesRequestV1,
  UpsertUserPropertiesResponseV1,
} from '@mealz/backend-users-properties-service-api';

import { UsersPropertiesRepository } from '../repositories';

@Injectable()
export class UsersPropertiesService {
  constructor(
    private readonly usersPropertiesRepository: UsersPropertiesRepository,
  ) {}

  public async readByUserIdAndPropertyIdV1(
    request: ReadByUserIdAndPropertyIdRequestV1,
    context: Context,
  ): Promise<ReadByUserIdAndPropertyIdResponseV1> {
    const userProperties =
      await this.usersPropertiesRepository.readByUserIdAndPropertyId(
        request.userId,
        request.propertyId,
        context,
      );
    return { userProperties };
  }

  public async upsertUserPropertiesV1(
    request: UpsertUserPropertiesRequestV1,
    context: Context,
  ): Promise<UpsertUserPropertiesResponseV1> {
    const { id } = await this.usersPropertiesRepository.upsertUserProperties(
      request.userProperties,
      context,
    );
    return { id };
  }
}
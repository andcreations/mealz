import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import {
  ReadByUserIdAndPropertyIdRequestV1,
  ReadByUserIdAndPropertyIdResponseV1,
  UpsertUserPropertiesRequestV1,
  UpsertUserPropertiesResponseV1,
  UsersPropertiesTransporter,
} from '@mealz/backend-users-properties-service-api';
import {
  ReadUserPropertiesByPropertyIdGWResponseV1,
  UpsertUserPropertiesByPropertyIdGWRequestV1,
  UpsertUserPropertiesByPropertyIdGWResponseV1,
} from '@mealz/backend-users-properties-gateway-api';

import { GWUserPropertiesMapper } from './GWUserPropertiesMapper';

@Injectable()
export class UsersPropertiesGWService {
  public constructor(
    private readonly usersPropertiesTransporter: UsersPropertiesTransporter,
    private readonly gWUserPropertiesMapper: GWUserPropertiesMapper,
  ) {}

  public async readByPropertyIdV1(
    propertyId: string,
    userId: string,
    context: Context,
  ): Promise<ReadUserPropertiesByPropertyIdGWResponseV1> {
    const request: ReadByUserIdAndPropertyIdRequestV1 = {
      userId,
      propertyId,
    };
    const response: ReadByUserIdAndPropertyIdResponseV1 =
      await this.usersPropertiesTransporter.readByUserIdAndPropertyIdV1(
        request,
        context,
      );
    return {
      userProperties: this.gWUserPropertiesMapper.toGWUserProperties(
        response.userProperties,
      )
    };
  }

  public async upsertByPropertyIdV1(
    gwRequest: UpsertUserPropertiesByPropertyIdGWRequestV1,
    propertyId: string,
    userId: string,
    context: Context,
  ): Promise<UpsertUserPropertiesByPropertyIdGWResponseV1> {
    const request: UpsertUserPropertiesRequestV1 = {
      userProperties: {
        id: gwRequest.id,
        userId,
        propertyId,
        data: gwRequest.data,
      },
    };
    const response: UpsertUserPropertiesResponseV1 =
      await this.usersPropertiesTransporter.upsertUserPropertiesV1(
        request,
        context,
      );
    return { id: response.id };
  }
}

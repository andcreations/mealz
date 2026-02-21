import { Injectable } from '@nestjs/common';
import { UserProperties } from '@mealz/backend-users-properties-service-api';
import { GWUserProperties } from '@mealz/backend-users-properties-gateway-api';

@Injectable()
export class GWUserPropertiesMapper {
  public toGWUserProperties(
    userProperties?: UserProperties,
  ): GWUserProperties | undefined {
    if (!userProperties) {
      return undefined;
    }
    return {
      id: userProperties.id,
      userId: userProperties.userId,
      propertyId: userProperties.propertyId,
      data: userProperties.data,
      modifiedAt: userProperties.modifiedAt,
    };
  }
}
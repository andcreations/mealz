import { Injectable } from '@nestjs/common';
import { UserProperties } from '@mealz/backend-users-properties-service-api';

import { UserPropertiesDBEntity } from '../entities';

@Injectable()
export class UserPropertiesDBMapper {
  public toEntity(userProperties: UserProperties): UserPropertiesDBEntity {
    return {
      id: userProperties.id,
      user_id: userProperties.userId,
      property_id: userProperties.propertyId,
      data: JSON.stringify(userProperties.data),
      modified_at: userProperties.modifiedAt,
    };
  }

  public fromEntity(
    entity: UserPropertiesDBEntity | undefined,
  ): UserProperties | undefined {
    if (!entity) {
      return undefined;
    }
    return {
      id: entity.id,
      userId: entity.user_id,
      propertyId: entity.property_id,
      data: JSON.parse(entity.data),
      modifiedAt: entity.modified_at,
    };
  }

  public fromEntities(
    entities: UserPropertiesDBEntity[],
  ): UserProperties[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}

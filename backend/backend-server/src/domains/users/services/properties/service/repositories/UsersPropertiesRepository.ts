import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';
import {
  InjectDBRepository,
  DBRepository,
  Where,
} from '@mealz/backend-db';
import { 
  UserProperties, 
  UserPropertiesForUpsert,
} from '@mealz/backend-users-properties-service-api';

import {
  USERS_PROPERTIES_DB_NAME,
  USER_PROPERTIES_DB_ENTITY_NAME,
  UserPropertiesDBEntity,
  UserPropertiesDBMapper,
} from '../db';

@Injectable()
export class UsersPropertiesRepository {
  public constructor(
    @InjectDBRepository(
      USERS_PROPERTIES_DB_NAME,
      USER_PROPERTIES_DB_ENTITY_NAME,
    )
    private readonly repository: DBRepository<UserPropertiesDBEntity>,
    private readonly mapper: UserPropertiesDBMapper,
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
  ) {}

  public async readByUserIdAndPropertyId(
    userId: string,
    propertyId: string,
    context: Context,
  ): Promise<UserProperties | undefined> {
    const query: Where<UserPropertiesDBEntity> = {
      user_id: { $eq: userId },
      property_id: { $eq: propertyId },
    };
    const entity = await this.repository.findOne(
      this.opName('readByUserIdAndPropertyId'),
      query,
      {},
      context,
    );
    return this.mapper.fromEntity(entity);
  }

  public async upsertUserProperties(
    userProperties: UserPropertiesForUpsert,
    context: Context,
  ): Promise<Pick<UserProperties, 'id'>> {
    const id = userProperties.id ?? this.idGenerator();
    const entity = this.mapper.toEntity({
      ...userProperties,
      id,
      modifiedAt: Date.now(),
    });
    console.log('entity', entity);
    await this.repository.upsert(
      this.opName('upsertUserProperties'),
      entity,
      context,
    );
    return { id };
  }

  private opName(name: string): string {
    return `${UsersPropertiesRepository.name}.${name}`;
  }
}

import { Context } from '@mealz/backend-core';
import { InjectDBRepository, DBRepository } from '@mealz/backend-db';
import { UserWithoutPassword } from '@mealz/backend-users-common';
import {
  USERS_DB_NAME,
  USER_DB_ENTITY_NAME,
  UserDBEntity,
  UserDBMapper,
} from '@mealz/backend-users-db';

export class UsersCrudRepository {
  public constructor(
    @InjectDBRepository(USERS_DB_NAME, USER_DB_ENTITY_NAME)
    private readonly repository: DBRepository<UserDBEntity>,
    private readonly mapper: UserDBMapper,
  ) {}

  public async readUserById(
    id: string,
    context: Context,
  ): Promise<UserWithoutPassword> {
    const entity = await this.repository.findOne(
      { id: { $eq: id } },
      {},
      context,
    );
    return this.mapper.fromEntity(
      entity,
      ['id', 'firstName', 'lastLame', 'email', 'roles'],
    );  
  }
}

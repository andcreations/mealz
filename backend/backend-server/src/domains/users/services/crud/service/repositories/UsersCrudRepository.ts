import { Context } from '@mealz/backend-core';
import { InjectDBRepository, DBRepository, Where } from '@mealz/backend-db';
import { UserWithoutPassword } from '@mealz/backend-users-common';
import {
  USERS_DB_NAME,
  USER_DB_ENTITY_NAME,
  USER_FIELDS_WITHOUT_PASSWORD,
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
      USER_FIELDS_WITHOUT_PASSWORD,
    );  
  }

  public async readUsersFromLast(
    lastId: string | undefined,
    limit: number,
    context: Context,
  ): Promise<UserWithoutPassword[]> {
    const query: Where<UserDBEntity> = {};
    if (lastId) {
      query.id = { $gt: lastId };
    }
    const entities = await this.repository.find(
      query,
      { 
        limit,
        sort: [
          { id: 'asc' },
        ],
      },
      context,
    );
    return this.mapper.fromEntities(
      entities,
      USER_FIELDS_WITHOUT_PASSWORD,
    );
  }
}

import { Context } from '@mealz/backend-core';
import { IdGenerator, InjectIdGenerator } from '@mealz/backend-common';
import { UserRole } from '@mealz/backend-api';
import { 
  InjectDBRepository, 
  DBRepository, 
  Where, 
  CreateObject,
} from '@mealz/backend-db';
import { User, UserWithoutPassword } from '@mealz/backend-users-common';
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
    @InjectIdGenerator()
    private readonly idGenerator: IdGenerator,
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

  public async createUser(
    user: CreateObject<User, 'id'>,
    context: Context,
  ): Promise<void> {
    const entity = this.mapper.toEntity({
      ...user,
      id: this.idGenerator(),
      roles: user.roles ?? [UserRole.USER],
    });
    await this.repository.insert(entity, context);
  }
}

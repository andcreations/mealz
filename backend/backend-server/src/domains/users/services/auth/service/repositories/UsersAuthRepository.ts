import { Context } from '@mealz/backend-core';
import { InjectDBRepository, DBRepository } from '@mealz/backend-db';
import { User } from '@mealz/backend-users-common';
import {
  USERS_DB_NAME,
  USER_DB_ENTITY_NAME,
  UserDBEntity,
  UserDBMapper,
} from '@mealz/backend-users-db';

export class UsersAuthRepository {
  public constructor(
    @InjectDBRepository(USERS_DB_NAME, USER_DB_ENTITY_NAME)
    private readonly repository: DBRepository<UserDBEntity>,
    private readonly mapper: UserDBMapper,
  ) {}

  public async findUserByEmailForAuth(
    email: string,
    context: Context,
  ): Promise<Pick<User, 'id' | 'password' | 'roles'> | undefined> {
    const entity = await this.repository.findOne<
      'id' | 'password' | 'roles'
    >(
      { email: { $eq: email } },
      { projection: ['id', 'password', 'roles'] },
      context,
    );
    return this.mapper.fromEntity(entity, ['id', 'password', 'roles']);
  }
}

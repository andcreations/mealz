import { Context } from '#mealz/backend-core';
import { InjectDBRepository, DBRepository } from '#mealz/backend-db';
import { User } from '#mealz/backend-users-common';
import {
  USERS_DB_NAME,
  USER_DB_ENTITY_NAME,
  UserDBEntity,
  mapUserDBEntityToUser,
} from '#mealz/backend-users-db';

export class UsersAuthRepository {
  public constructor(
    @InjectDBRepository(USERS_DB_NAME, USER_DB_ENTITY_NAME)
    private readonly usersRepository: DBRepository<UserDBEntity>,
  ) {}

  public async findUserByEmailForAuth(
    email: string,
    context: Context,
  ): Promise<Pick<User, 'id' | 'password' | 'roles'> | undefined> {
    const entity = await this.usersRepository.findOne<'id' | 'password' | 'roles'>(
      { email: { $eq: email } },
      { projection: ['id', 'password', 'roles'] },
      context,
    );
    return mapUserDBEntityToUser(entity, ['id', 'password', 'roles']);
  }
}

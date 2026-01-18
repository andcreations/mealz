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
      this.opName('findUserByEmailForAuth'),
      { email: { $eq: email } },
      { projection: ['id', 'password', 'roles'] },
      context,
    );
    return this.mapper.fromEntity(entity, ['id', 'password', 'roles']);
  }

  public async readPasswordByUserId(
    userId: string,
    context: Context,
  ): Promise<string | undefined> {
    const entity = await this.repository.findOne<
      'password'
    >(
      this.opName('readPasswordByUserId'),
      { id: { $eq: userId } },
      { projection: ['password'] },
      context,
    );
    return entity?.password;
  }

  public async updatePasswordByUserId(
    userId: string,
    hashedPassword: string,
    context: Context,
  ): Promise<void> {
    await this.repository.update(
      this.opName('updatePasswordByUserId'),
      { id: { $eq: userId } }, 
      { password: { $set: hashedPassword } },
      context,
    );
  }

  private opName(name: string): string {
    return `${UsersAuthRepository.name}.${name}`;
  }
}

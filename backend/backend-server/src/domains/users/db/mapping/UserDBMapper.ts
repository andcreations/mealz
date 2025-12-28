import { Injectable } from '@nestjs/common';
import { User } from '@mealz/backend-users-common';

import { UserDBEntity } from '../entities';

@Injectable()
export class UserDBMapper {
  public fromEntity<
    K extends keyof UserDBEntity,
    U extends keyof User
  >(
    entity: Pick<UserDBEntity, K> | undefined,
    projection: U[],
  ): Pick<User, U> | undefined {
    if (!entity) {
      return undefined;
    }
    const user: Partial<User> = {};
    projection.forEach(field => {
      switch (field) {
        case 'id':
          user.id = (entity as any).id;
          break;
        case 'firstName':
          user.firstName = (entity as any).first_name;
          break;
        case 'lastName':
          user.lastName = (entity as any).last_name;
          break;
        case 'email':
          user.email = (entity as any).email;
          break;
        case 'password':
          user.password = (entity as any).password;
          break;
        case 'roles':
          user.roles = (entity as any).roles.split(',');
          break;
      }
    });
    return user as Pick<User, U>;
  } 

  public fromEntities<
    K extends keyof UserDBEntity,
    U extends keyof User
  >(
    entities: Array<Pick<UserDBEntity, K> | undefined>,
    projection: U[],
  ): Array<Pick<User, U>> {
    return entities
      .map(entity => this.fromEntity(entity, projection))
      .filter(user => user !== undefined);
  }

  public toEntity(user: User): UserDBEntity {
    return {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      password: user.password,
      roles: user.roles?.join(','),
    };
  }
}

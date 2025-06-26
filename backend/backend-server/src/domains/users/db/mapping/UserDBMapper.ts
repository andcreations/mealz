import { Injectable } from '@nestjs/common';
import { User } from '#mealz/backend-users-common';

import { UserDBEntity } from '../entities';

@Injectable()
export class UserDBMapper {
  public fromEntity<
    K extends keyof UserDBEntity,
    U extends keyof User
  >(
    entity: Pick<UserDBEntity, K> | undefined,
    projection: U[],
  ): Pick<User, U> | undefined{
    if (!entity) {
      return undefined;
    }
    const user: Partial<User> = {};
    projection.forEach(field => {
      switch (field) {
        case 'id':
          user.id = (entity as any).id;
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
}

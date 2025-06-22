import { User } from '#mealz/backend-users-common';
import { UserDBEntity } from '../entities/UserDBEntity';

/**
 * Map a UserDBEntity to a User.
 * @param entity - The UserDBEntity to map.
 * @param projection - The projection of the User to map.
 * @returns The mapped User.
 */
export function mapUserDBEntityToUser<
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
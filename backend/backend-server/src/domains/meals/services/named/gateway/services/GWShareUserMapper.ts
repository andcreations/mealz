import { Injectable } from '@nestjs/common';
import { ShareUser } from '@mealz/backend-meals-named-service-api';
import { GWShareUser } from '@mealz/backend-meals-named-gateway-api';

@Injectable()
export class GWShareUserMapper {
  public fromShareUser(shareUser: ShareUser): GWShareUser {
    return {
      id: shareUser.id,
      firstName: shareUser.firstName,
    };
  }

  public fromShareUsers(shareUsers: ShareUser[]): GWShareUser[] {
    return shareUsers.map(shareUser => {
      return this.fromShareUser(shareUser);
    });
  }
}
import { ApiProperty } from '@nestjs/swagger';
import {
  ListShareUsersGWResponseV1,
} from '@mealz/backend-meals-named-gateway-api';

import { GWShareUserImpl } from '../types';

export class ListShareUsersGWResponseV1Impl implements ListShareUsersGWResponseV1 {
  @ApiProperty({
    description: 'Users who can be shared named meals with',
  })
  public shareUsers: GWShareUserImpl[];
}
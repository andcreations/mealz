import {
  UpsertUserMealGWResponseV1,
} from '@mealz/backend-meals-user-gateway-api';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertUserMealGWResponseV1Impl
  implements UpsertUserMealGWResponseV1
{
  @ApiProperty({
    description: 'User meal identifier'
  })
  public id: string;
}
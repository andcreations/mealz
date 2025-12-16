import { ApiProperty } from '@nestjs/swagger';
import {
  CreateNamedMealGWResponseV1,
} from '@mealz/backend-meals-named-gateway-api';

export class CreateNamedMealGWResponseV1Impl
  implements CreateNamedMealGWResponseV1
{
  @ApiProperty({
    description: 'Named meal identifier',
  })
  public id: string;
}
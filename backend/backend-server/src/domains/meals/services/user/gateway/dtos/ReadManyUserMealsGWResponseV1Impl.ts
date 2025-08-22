
import { 
  GWUserMeal,
  ReadManyUserMealsGWResponseV1,
} from '@mealz/backend-meals-user-gateway-api';
import { ApiProperty } from '@nestjs/swagger';

export class ReadManyUserMealsGWResponseV1Impl
  implements ReadManyUserMealsGWResponseV1
{
  @ApiProperty({
    description: 'Read user meals'
  })
  public userMeals: GWUserMeal[];
}
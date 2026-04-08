import { GWNamedMealSharedBy } from '@mealz/backend-meals-named-gateway-api';
import { ApiProperty } from '@nestjs/swagger';

export class GWNamedMealSharedByImpl implements GWNamedMealSharedBy {
  @ApiProperty({
    description: 'User first name',
  })
  public firstName: string;
}
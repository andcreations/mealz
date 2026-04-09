import { ApiProperty } from '@nestjs/swagger';
import { GWShareUser } from '@mealz/backend-meals-named-gateway-api';

export class GWShareUserImpl implements GWShareUser {
  @ApiProperty({
    description: 'User identifier',
  })
  public id: string;

  @ApiProperty({
    description: 'User first name',
  })
  public firstName: string;
}
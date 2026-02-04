import { ApiProperty } from '@nestjs/swagger';
import { GWProduct } from '@mealz/backend-ingredients-gateway-api';

export class GWProductImpl implements GWProduct {
  @ApiProperty({
    description: 'Product brand'
  })
  public brand: string;
}
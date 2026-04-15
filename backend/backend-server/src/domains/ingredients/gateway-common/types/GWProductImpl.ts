import { ApiProperty } from '@nestjs/swagger';
import { IsBrand } from '@mealz/backend-gateway-common';
import { GWProduct } from '@mealz/backend-ingredients-gateway-api';

export class GWProductImpl implements GWProduct {
  @ApiProperty({
    description: 'Product brand'
  })
  @IsBrand()
  public brand: string;
}
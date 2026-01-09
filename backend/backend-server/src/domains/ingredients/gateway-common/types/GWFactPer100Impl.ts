import { ApiProperty } from '@nestjs/swagger';
import { 
  GWFactId,
  GWFactUnit,
  GWFactPer100,
} from '@mealz/backend-ingredients-gateway-api';

export class GWFactPer100Impl implements GWFactPer100 {
  @ApiProperty({
    description: 'Fact identifier'
  })
  public id: GWFactId;

  @ApiProperty({
    description: 'Fact unit'
  })
  public unit: GWFactUnit;
  public amount: number;
}
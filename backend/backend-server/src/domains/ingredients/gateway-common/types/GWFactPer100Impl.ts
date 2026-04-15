import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { IsAmount } from '@mealz/backend-gateway-common';
import { 
  GWFactId,
  GWFactUnit,
  GWFactPer100,
} from '@mealz/backend-ingredients-gateway-api';

export class GWFactPer100Impl implements GWFactPer100 {
  @ApiProperty({
    description: 'Fact identifier'
  })
  @IsEnum(GWFactId)
  public id: GWFactId;

  @ApiProperty({
    description: 'Fact unit'
  })
  @IsEnum(GWFactUnit)
  public unit: GWFactUnit;

  @ApiProperty({
    description: 'Fact amount'
  })
  @IsAmount()
  public amount: number;
}
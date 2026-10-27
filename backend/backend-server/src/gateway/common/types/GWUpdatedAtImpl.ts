import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { GWUpdatedAt } from '@mealz/backend-gateway-api';

export class GWUpdatedAtImpl implements GWUpdatedAt {
  @ApiProperty({
    description: 'Timestamp (UTC) when the entity was updated',
  })
  @IsNumber()
  @IsNotEmpty() 
  updatedAt: number;
}
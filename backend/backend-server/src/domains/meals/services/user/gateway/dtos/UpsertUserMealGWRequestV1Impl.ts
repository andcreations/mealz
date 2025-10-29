import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GWMealWithoutIdImpl } from '@mealz/backend-meals-gateway-common';
import { IsId } from '@mealz/backend-gateway-common';
import {
  UpsertUserMealGWRequestV1,
} from '@mealz/backend-meals-user-gateway-api';

export class UpsertUserMealGWRequestV1Impl
  implements UpsertUserMealGWRequestV1
{
  @ApiProperty({
    description: 'User meal identifier if updating',
  })
  @IsOptional()
  @IsId()
  public id?: string;

  @ApiProperty({
    description: `User meal type. It can be anything to distinguish different
      use cases.`,
  })
  @IsString()
  public typeId: string;

  @ApiProperty({
    description: 'Meal'
  })
  @ValidateNested()
  @Type(() => GWMealWithoutIdImpl)
  public meal: GWMealWithoutIdImpl;
}
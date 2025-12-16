import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GWMealWithoutIdImpl } from '@mealz/backend-meals-gateway-common';
import {
  UpdateNamedMealGWRequestV1,
} from '@mealz/backend-meals-named-gateway-api';

export class UpdateNamedMealGWRequestV1Impl
  implements UpdateNamedMealGWRequestV1
{
  @ApiProperty({
    description: 'Name of the named meal',
  })
  @IsString()
  @IsNotEmpty()
  public mealName: string;

  @ApiProperty({
    description: 'Meal',
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => GWMealWithoutIdImpl)
  public meal: GWMealWithoutIdImpl;
}
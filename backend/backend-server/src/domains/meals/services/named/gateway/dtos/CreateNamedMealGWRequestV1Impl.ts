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
  CreateNamedMealGWRequestV1,
} from '@mealz/backend-meals-named-gateway-api';

export class CreateNamedMealGWRequestV1Impl
  implements CreateNamedMealGWRequestV1
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
import { Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { 
  MealsNamedV1APIReadManyFromLastParams,
} from '@mealz/backend-meals-named-gateway-api';
import { MealsNamedTransporter } from '@mealz/backend-meals-named-service-api';

import { ReadNamedMealsFromLastGWResponseV1Impl } from '../dtos';

@Injectable()
export class MealsNamedPlanGWService {
  public constructor(
    private readonly mealsNamedTransporter: MealsNamedTransporter,
  ) {}

  public async readFromLastV1(
    gwParams: MealsNamedV1APIReadManyFromLastParams,
    userId: string,
    context: Context,
  ): Promise<ReadNamedMealsFromLastGWResponseV1Impl> {
    return { namedMeals: [] };
  }
}
import { Inject, Injectable } from '@nestjs/common';
import { Context } from '@mealz/backend-core';
import { RequestTransporter } from '@mealz/backend-transport';

import { MEALS_NAMED_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';
import { MealsNamedRequestTopics } from './MealsNamedRequestTopics';

@Injectable()
export class MealsNamedTransporter {
  public constructor(
    @Inject(MEALS_NAMED_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}
}
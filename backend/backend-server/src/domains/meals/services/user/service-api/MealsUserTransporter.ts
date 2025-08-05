import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from '@mealz/backend-transport';

import { MEALS_USER_TRANSPORTER_TOKEN } from './inject-tokens';

@Injectable()
export class MealsUserTransporter {
  public constructor(
    @Inject(MEALS_USER_TRANSPORTER_TOKEN)
    private readonly transporter: Transporter,
  ) {}
}
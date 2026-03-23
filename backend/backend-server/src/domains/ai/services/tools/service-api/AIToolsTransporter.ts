import { Inject } from '@nestjs/common';
import { RequestTransporter } from '@mealz/backend-transport';

import { AI_TOOLS_REQUEST_TRANSPORTER_TOKEN } from './inject-tokens';

export class AIToolsTransporter {
  public constructor(
    @Inject(AI_TOOLS_REQUEST_TRANSPORTER_TOKEN)
    private readonly transporter: RequestTransporter,
  ) {}
}

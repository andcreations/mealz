import { RequestController } from '@mealz/backend-transport';

import { AIToolsService } from '../services';

@RequestController()
export class AIToolsRequestController {
  public constructor(
    private readonly aiToolsService: AIToolsService,
  ) {}
}

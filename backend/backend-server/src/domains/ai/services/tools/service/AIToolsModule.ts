import { Module } from '@nestjs/common';

import { AIToolsService } from './services';
import { AIToolsRequestController } from './controllers';

@Module({
  providers: [
    AIToolsService,
    AIToolsRequestController,
  ],
})
export class AIToolsModule {}

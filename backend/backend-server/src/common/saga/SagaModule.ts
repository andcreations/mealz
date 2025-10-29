import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';

import { SagaService } from './services';

@Module({
  imports: [LoggerModule],
  providers: [SagaService],
  exports: [SagaService],
})
export class SagaModule { 
}
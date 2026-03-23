import { Module } from '@nestjs/common';
import { AIToolsModule } from './services/tools';

@Module({
  imports: [
    AIToolsModule,
  ],
})
export class AIDomainModule {}
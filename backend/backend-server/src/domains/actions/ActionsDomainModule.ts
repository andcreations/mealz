import { Module } from '@nestjs/common';
import { ActionsManagerModule } from './services/manager';

@Module({
  imports: [ ActionsManagerModule ],
})
export class ActionsDomainModule {}
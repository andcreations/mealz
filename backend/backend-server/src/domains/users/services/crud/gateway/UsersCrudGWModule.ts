import { Module } from '@nestjs/common';
import { UsersCrudAPIModule } from '@mealz/backend-users-crud-service-api';

import { UsersCrudGWService } from './services';
import { UsersCrudGWController } from './controllers';

@Module({
  imports: [UsersCrudAPIModule.forRoot({})],
  providers: [UsersCrudGWService],
  controllers: [UsersCrudGWController],
})
export class UsersCrudGWModule {}
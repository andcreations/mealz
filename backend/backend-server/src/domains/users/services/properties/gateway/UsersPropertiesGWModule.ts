import { Module } from '@nestjs/common';
import { 
  UsersPropertiesAPIModule,
} from '@mealz/backend-users-properties-service-api';

import { GWUserPropertiesMapper, UsersPropertiesGWService } from './services';
import { UsersPropertiesGWController } from './controllers';

@Module({
  imports: [UsersPropertiesAPIModule.forRoot({})],
  providers: [GWUserPropertiesMapper, UsersPropertiesGWService],
  controllers: [UsersPropertiesGWController],
})
export class UsersPropertiesGWModule {}

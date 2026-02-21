import { Module } from '@nestjs/common';

import { UserPropertiesDBMapper } from './mapping';

@Module({
  providers: [
    UserPropertiesDBMapper,
  ],
  exports: [
    UserPropertiesDBMapper,
  ],
})
export class UsersPropertiesDBModule {}

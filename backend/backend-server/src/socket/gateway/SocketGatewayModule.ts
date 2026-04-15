import { Module } from '@nestjs/common';
import { LoggerModule } from '@mealz/backend-logger';

import { 
  SocketGatewayController,
  SocketGatewayRequestController,
} from './controllers';
import { SocketAuthMiddleware } from './middlewares';
import { SocketGatewayService } from './services';

@Module({
  imports: [
    LoggerModule,
  ],
  providers: [
    SocketGatewayController,
    SocketGatewayRequestController,
    SocketAuthMiddleware, 
    SocketGatewayService,
  ],
  exports: [SocketGatewayService],
})
export class SocketGatewayModule {}

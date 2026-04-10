import { Module } from '@nestjs/common';

import { SocketGatewayController } from './controllers';
import { SocketAuthMiddleware } from './middlewares';
import { SocketGatewayService } from './services';

@Module({
  providers: [SocketGatewayController, SocketAuthMiddleware, SocketGatewayService],
  exports: [SocketGatewayService],
})
export class SocketGatewayModule {}

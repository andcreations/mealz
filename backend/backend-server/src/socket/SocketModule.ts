import { Module } from '@nestjs/common';
import { SocketGatewayModule } from './gateway';

@Module({
  imports: [
    SocketGatewayModule,
  ],
})
export class SocketModule {}
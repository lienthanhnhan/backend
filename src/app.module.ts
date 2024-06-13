import { Module } from '@nestjs/common';
import { ServerService } from './service/server.service';
import { ServerController } from './controller/server.controller';

@Module({
  imports: [],
  controllers: [ServerController],
  providers: [ServerService],
})
export class AppModule {}

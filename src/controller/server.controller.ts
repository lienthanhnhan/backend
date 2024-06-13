import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ServerService } from '../service/server.service';
import { Server } from '../interface/server.interface';

@ApiTags('servers')
@Controller('servers')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Get('findOnlineServer')
  @ApiResponse({
    status: 200,
    description: 'The server with the lowest priority that is online.',
  })
  @ApiResponse({ status: 404, description: 'No servers are online' })
  async findOnlineServer(): Promise<Server | NotFoundException> {
    try {
      return await this.serverService.findServer();
    } catch (error) {
      throw new NotFoundException('No servers are online');
    }
  }
}

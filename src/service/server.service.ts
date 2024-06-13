import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Server } from '../interface/server.interface';
import { ServerPriority, ServerURL } from 'src/interface/server.enum';

const servers: Server[] = [
  { url: ServerURL.DoesNotWorkPerfumeNew, priority: ServerPriority.Low },
  { url: ServerURL.GitLab, priority: ServerPriority.Highest },
  { url: ServerURL.AppScntMe, priority: ServerPriority.High },
  { url: ServerURL.OfflineScentronixCom, priority: ServerPriority.Medium },
];

@Injectable()
export class ServerService {
  private async checkServer(server: Server): Promise<boolean> {
    try {
      const response = await axios.get(server.url, { timeout: 5000 });
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      return false;
    }
  }

  async findServer(): Promise<Server> {
    // Sort servers by priority
    const sortedServers = servers.sort((a, b) => a.priority - b.priority);

    // Check all servers in parallel
    const checkPromises = sortedServers.map(async (server) => {
      const isOnline = await this.checkServer(server);
      return { ...server, isOnline };
    });

    const results = await Promise.all(checkPromises);

    // Find the first online server
    const onlineServer = results.find((server) => server.isOnline);

    if (onlineServer) {
      return onlineServer;
    } else {
      throw new Error('No servers are online');
    }
  }
}

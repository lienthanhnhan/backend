import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'src/interface/server.interface';
import { ServerController } from './server.controller';
import { ServerService } from '../../src/service/server.service';
import { ServerPriority, ServerURL } from '../../src/interface/server.enum';

describe('ServerController', () => {
  let controller: ServerController;
  let service: ServerService;

  const mockResult: Server = {
    url: ServerURL.AppScntMe,
    priority: ServerPriority.High,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerController],
      providers: [
        {
          provide: ServerService,
          useValue: {
            findServer: jest.fn().mockResolvedValue(mockResult),
          },
        },
      ],
    }).compile();

    controller = module.get<ServerController>(ServerController);
    service = module.get<ServerService>(ServerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the online server with the lowest priority', async () => {
    const result = await controller.findOnlineServer();
    expect(result).toEqual(mockResult);
    expect(service.findServer).toHaveBeenCalled();
  });

  it('should throw an error if no servers are online', async () => {
    jest
      .spyOn(service, 'findServer')
      .mockRejectedValueOnce(new Error('No servers are online'));

    await expect(controller.findOnlineServer()).rejects.toThrow(
      'No servers are online',
    );
  });
});

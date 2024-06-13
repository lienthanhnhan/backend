import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { ServerService } from 'src/service/server.service';
import * as request from 'supertest';

describe('ServerController (e2e)', () => {
  let app: INestApplication;
  let serverService: ServerService;

  const mockResult = { url: 'http://app.scnt.me', priority: 3 };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ServerService)
      .useValue({
        findServer: jest.fn().mockResolvedValue(mockResult),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    serverService = moduleFixture.get<ServerService>(ServerService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/servers/findOnlineServer (GET) - should return the online server with the lowest priority', async () => {
    const response = await request(app.getHttpServer())
      .get('/servers/findOnlineServer')
      .expect(200);

    expect(response.body).toEqual(mockResult);
  });

  it('/servers/findOnlineServer (GET) - should return 404 if no servers are online', async () => {
    jest
      .spyOn(serverService, 'findServer')
      .mockRejectedValueOnce(new Error('No servers are online'));

    const response = await request(app.getHttpServer())
      .get('/servers/findOnlineServer')
      .expect(404);

    expect(response.body.message).toBe('No servers are online');
  });
});

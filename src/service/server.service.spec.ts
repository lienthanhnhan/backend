import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ServerService } from './server.service';

describe('ServerService', () => {
  let service: ServerService;
  let mock: MockAdapter;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerService],
    }).compile();

    service = module.get<ServerService>(ServerService);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should return the online server with the lowest priority', async () => {
    mock.onGet('https://does-not-work.perfume.new').timeout();
    mock.onGet('https://gitlab.com').reply(200);
    mock.onGet('http://app.scnt.me').reply(200);
    mock.onGet('https://offline.scentronix.com').timeout();

    const result = await service.findServer();
    expect(result).toEqual(
      expect.objectContaining({ url: 'http://app.scnt.me', priority: 3 }),
    );
  });

  it('should throw an error if no servers are online', async () => {
    mock.onGet('https://does-not-work.perfume.new').timeout();
    mock.onGet('https://gitlab.com').timeout();
    mock.onGet('http://app.scnt.me').timeout();
    mock.onGet('https://offline.scentronix.com').timeout();

    await expect(service.findServer()).rejects.toThrow('No servers are online');
  });

  it('should handle servers with mixed responses correctly', async () => {
    mock.onGet('https://does-not-work.perfume.new').timeout();
    mock.onGet('https://gitlab.com').reply(503);
    mock.onGet('http://app.scnt.me').reply(200);
    mock.onGet('https://offline.scentronix.com').reply(200);

    const result = await service.findServer();
    expect(result).toEqual(
      expect.objectContaining({
        url: 'https://offline.scentronix.com',
        priority: 2,
      }),
    );
  });
});

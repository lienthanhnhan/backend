import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should start the application and respond to /api with Swagger UI', async () => {
    const response = await request(app.getHttpServer()).get('/api');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Swagger UI');
  });

  it('should start the application and respond to / with status 404', async () => {
    await request(app.getHttpServer()).get('/').expect(404);
  });
});

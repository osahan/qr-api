import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import v1Routes from '../src/v1/routes.js';

describe('API Authentication', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    await app.register(v1Routes, { prefix: '/v1' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 401 when no API key is provided', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/v1/qr?data=test',
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.payload)).toEqual({
      error: 'API key is required',
      message: 'Please provide an API key in the X-API-Key header or Authorization header',
    });
  });

  it('should return 401 when invalid API key is provided', async () => {
    // Set environment variable for test
    process.env.API_KEY = 'valid-api-key';

    const response = await app.inject({
      method: 'GET',
      url: '/v1/qr?data=test',
      headers: {
        'X-API-Key': 'invalid-key',
      },
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.payload)).toEqual({
      error: 'Invalid API key',
      message: 'The provided API key is invalid',
    });
  });

  it('should accept API key via X-API-Key header', async () => {
    // Set environment variable for test
    process.env.API_KEY = 'test-api-key';

    const response = await app.inject({
      method: 'GET',
      url: '/v1/qr?data=test',
      headers: {
        'X-API-Key': 'test-api-key',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('image/svg+xml');
    expect(response.payload).toContain('<svg');
  });

  it('should accept API key via Authorization header with Bearer', async () => {
    // Set environment variable for test
    process.env.API_KEY = 'test-api-key';

    const response = await app.inject({
      method: 'GET',
      url: '/v1/qr?data=test',
      headers: {
        'Authorization': 'Bearer test-api-key',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('image/svg+xml');
    expect(response.payload).toContain('<svg');
  });
}); 
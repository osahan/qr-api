import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export default async function swaggerPlugin(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: { 
        title: 'QR-Code API', 
        version: '1.0.0',
        description: 'A secure API for generating QR codes. All endpoints require API key authentication.',
      },
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'X-API-Key',
            in: 'header',
            description: 'API key for authentication. You can also use the Authorization header with Bearer token.',
          },
        },
      },
      security: [
        {
          apiKey: [],
        },
      ],
    },
  });
  await app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
      persistAuthorization: true,
    },
  });
}

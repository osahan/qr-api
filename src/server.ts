import 'dotenv/config';
import Fastify from 'fastify';
import v1Routes from './v1/routes.js';
import swaggerPlugin from './swagger.js';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Register Swagger plugin
await server.register(swaggerPlugin);

// Health check endpoint
server.get(
  '/healthz',
  {
    schema: {
      response: {
        200: {
          description: 'Health check response',
          type: 'string',
        },
      },
    },
  },
  async (request, reply) => {
    return reply.type('text/plain').send('ok');
  }
);

// Register v1 API routes
server.register(v1Routes, { prefix: '/v1' });

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = '0.0.0.0';

    await server.listen({ port, host });
    server.log.info(`Server listening on ${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

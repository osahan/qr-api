import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { generateQRCode } from '../encode.js';
import crypto from 'crypto';

interface QRRequestQuery {
  data: string;
  margin?: string;
}

export default async function routes(fastify: FastifyInstance) {
  fastify.get<{ Querystring: QRRequestQuery }>(
    '/qr',
    {
      schema: {
        tags: ['qr'],
        querystring: {
          type: 'object',
          required: ['data'],
          properties: {
            data: {
              type: 'string',
              minLength: 1,
              description: 'Text or URL to encode',
            },
            margin: { type: 'integer', minimum: 0, maximum: 10, default: 4 },
          },
        },
        response: {
          200: {
            description: 'SVG image.',
            type: 'string',
          },
        },
      },
    },
    async (request, reply) => {
      const { data, margin = '4' } = request.query;

      if (!data) {
        return reply.status(400).send({
          error: 'Missing required parameter: data',
        });
      }

      // Validate margin parameter
      const marginNum = parseInt(margin, 10);
      if (isNaN(marginNum) || marginNum < 0 || marginNum > 10) {
        return reply.status(400).send({
          error: 'Invalid margin parameter. Must be a number between 0 and 10.',
        });
      }

      try {
        // Generate canonical query string for ETag
        const canonicalQuery = new URLSearchParams({
          data,
          margin: marginNum.toString(),
        }).toString();

        // Generate ETag from canonical query string
        const etag = crypto
          .createHash('sha1')
          .update(canonicalQuery)
          .digest('hex');

        // Check if client has cached version
        const ifNoneMatch = request.headers['if-none-match'];
        if (ifNoneMatch === `"${etag}"`) {
          return reply.status(304).send();
        }

        // Generate QR code
        const svg = await generateQRCode(data, {
          margin: marginNum,
          errorCorrectionLevel: 'M',
        });

        // Set response headers
        reply.header('Content-Type', 'image/svg+xml');
        reply.header('ETag', `"${etag}"`);
        reply.header('Cache-Control', 'public, max-age=31536000, immutable');

        return reply.send(svg);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: 'Failed to generate QR code',
        });
      }
    }
  );
}

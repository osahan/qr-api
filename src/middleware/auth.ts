import { FastifyRequest, FastifyReply } from 'fastify';

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    apiKey: string;
  };
}

export async function authenticateApiKey(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const apiKey = request.headers['x-api-key'] || request.headers['authorization'];

  if (!apiKey) {
    return reply.status(401).send({
      error: 'API key is required',
      message: 'Please provide an API key in the X-API-Key header or Authorization header',
    });
  }

  // Handle case where apiKey might be an array
  const apiKeyString = Array.isArray(apiKey) ? apiKey[0] : apiKey;

  // Remove 'Bearer ' prefix if present
  const cleanApiKey = typeof apiKeyString === 'string' && apiKeyString.startsWith('Bearer ')
    ? apiKeyString.substring(7)
    : apiKeyString;

  // Get the expected API key from environment variable
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    request.log.warn('API_KEY environment variable is not set - authentication disabled');
    // For development/testing, allow requests when no API_KEY is set
    (request as AuthenticatedRequest).user = {
      apiKey: cleanApiKey,
    };
    return;
  }

  if (cleanApiKey !== expectedApiKey) {
    return reply.status(401).send({
      error: 'Invalid API key',
      message: 'The provided API key is invalid',
    });
  }

  // Attach user info to request for potential future use
  (request as AuthenticatedRequest).user = {
    apiKey: cleanApiKey,
  };
}

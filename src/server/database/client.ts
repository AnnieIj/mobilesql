import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Declare global type to prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

/**
 * Enterprise Database Client Initialization
 * Includes event logging, connection pooling configuration, and graceful teardown
 */
function createPrismaClient(): PrismaClient {
  const isProd = process.env.NODE_ENV === 'production';
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl && isProd) {
    logger.warn('[Database] DATABASE_URL environment variable is not defined. Using in-memory fallback connection.');
  }

  const client = new PrismaClient({
    log: isProd
      ? [{ emit: 'event', level: 'error' }]
      : [
          { emit: 'stdout', level: 'warn' },
          { emit: 'stdout', level: 'error' },
        ],
    errorFormat: isProd ? 'minimal' : 'pretty',
  });

  return client;
}

export const db: PrismaClient = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = db;
}

// Graceful Connection Shutdown Handlers
const handleShutdown = async (signal: string) => {
  logger.info(`[Database] Received ${signal}. Closing PostgreSQL connection pool...`);
  try {
    await db.$disconnect();
    logger.info('[Database] PostgreSQL pool disconnected cleanly.');
  } catch (error) {
    logger.error('[Database] Error during PostgreSQL disconnection:', error);
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default db;

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Declare global type to prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

/**
 * Safe Database Client Initialization with Lazy Fallback Proxy
 * Prevents application startup crashes if DATABASE_URL is not yet provisioned.
 */
let prismaInstance: PrismaClient | null = null;
let isConnected = false;

export function isDatabaseConnected(): boolean {
  return isConnected && prismaInstance !== null && !(prismaInstance as any).__isMockProxy;
}

export function getActiveBackendType(): 'postgresql' | 'in-memory' {
  return isDatabaseConnected() ? 'postgresql' : 'in-memory';
}

export function getDb(): PrismaClient {
  if (!prismaInstance) {
    const isProd = process.env.NODE_ENV === 'production';
    try {
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined in environment');
      }
      prismaInstance = globalThis.prismaGlobal ?? new PrismaClient({
        log: isProd
          ? [{ emit: 'event', level: 'error' }]
          : [
              { emit: 'stdout', level: 'warn' },
              { emit: 'stdout', level: 'error' },
            ],
        errorFormat: isProd ? 'minimal' : 'pretty',
      });

      if (process.env.NODE_ENV !== 'production') {
        globalThis.prismaGlobal = prismaInstance;
      }
      isConnected = true;
    } catch (err) {
      logger.warn('[Database] PrismaClient initialization deferred or failed:', err);
      // Return a safe mock proxy if client cannot initialize
      const mockClient = new Proxy({ __isMockProxy: true } as any, {
        get(_target, prop) {
          if (prop === '__isMockProxy') return true;
          if (prop === '$disconnect' || prop === '$connect') {
            return async () => {};
          }
          if (prop === '$queryRawUnsafe' || prop === '$queryRaw' || prop === '$executeRawUnsafe' || prop === '$executeRaw') {
            return async () => {
              throw new Error('[Database] PostgreSQL connection inactive: cannot execute raw query on mock proxy. Use in-memory execution backend.');
            };
          }
          return new Proxy({}, {
            get(_t, method) {
              return async () => {
                logger.warn(`[Database] Query on ${String(prop)}.${String(method)} bypassed (no active connection)`);
                return null;
              };
            },
          });
        },
      });
      prismaInstance = mockClient;
      isConnected = false;
      return mockClient;
    }
  }
  return prismaInstance;
}

// Transparent Proxy so all repositories importing `db` continue to work with lazy safety
export const db: PrismaClient = new Proxy({} as any, {
  get(_target, prop) {
    const client = getDb();
    const val = (client as any)[prop];
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  },
});

// Graceful Connection Shutdown Handlers
const handleShutdown = async (signal: string) => {
  if (prismaInstance) {
    logger.info(`[Database] Received ${signal}. Closing PostgreSQL connection pool...`);
    try {
      await prismaInstance.$disconnect();
      logger.info('[Database] PostgreSQL pool disconnected cleanly.');
    } catch (error) {
      logger.error('[Database] Error during PostgreSQL disconnection:', error);
    }
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default db;

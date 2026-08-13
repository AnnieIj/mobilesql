import { PrismaClient, Prisma } from '@prisma/client';
import db from './client';
import { handleDatabaseError } from './dbErrors';
import { logger } from '../utils/logger';

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export interface TransactionOptions {
  maxWait?: number;
  timeout?: number;
  isolationLevel?: Prisma.TransactionIsolationLevel;
  maxRetries?: number;
}

/**
 * Executes a callback function inside an ACID PostgreSQL transaction.
 * Includes automatic retry on transient serialization failures or deadlocks.
 */
export async function runTransaction<T>(
  action: (tx: TransactionClient) => Promise<T>,
  options: TransactionOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    try {
      return await db.$transaction(
        async (tx: any) => {
          return await action(tx as TransactionClient);
        },
        {
          maxWait: options.maxWait ?? 5000,
          timeout: options.timeout ?? 10000,
          isolationLevel: options.isolationLevel ?? Prisma.TransactionIsolationLevel.ReadCommitted,
        }
      );
    } catch (error: any) {
      const isTransientError =
        error &&
        typeof error === 'object' &&
        (error.code === 'P2034' || error.code === 'P2028');

      if (isTransientError && attempt < maxRetries) {
        logger.warn(
          `[Transaction] Transient failure detected on attempt ${attempt}/${maxRetries}. Retrying in ${
            attempt * 200
          }ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, attempt * 200));
        continue;
      }

      throw handleDatabaseError(error, 'Transaction');
    }
  }

  throw new Error('Transaction failed after maximum retry attempts.');
}

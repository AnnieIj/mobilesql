import { Prisma } from '@prisma/client';
import {
  AppError,
  ConflictError,
  NotFoundError,
  BadRequestError,
} from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Handles Prisma Known Request Errors and transforms them into standard AppError instances
 */
export function handleDatabaseError(error: unknown, entityName: string = 'Record'): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const err = error as any;

  if (err && typeof err === 'object' && err.code && typeof err.code === 'string' && err.code.startsWith('P')) {
    logger.error(`[Database Error] Code ${err.code} on ${entityName}:`, err.message);

    switch (err.code) {
      case 'P2002': {
        // Unique constraint violation
        const targets = (err.meta?.target as string[]) || [];
        const fieldName = targets.join(', ') || 'field';
        return new ConflictError(`A ${entityName.toLowerCase()} with this ${fieldName} already exists.`);
      }
      case 'P2025': {
        // Record to update or delete not found
        return new NotFoundError(`${entityName} not found or has already been removed.`);
      }
      case 'P2003': {
        // Foreign key constraint failed
        const field = (err.meta?.field_name as string) || 'relation';
        return new BadRequestError(`Invalid reference: Foreign key constraint failed on ${field}.`);
      }
      case 'P2014': {
        // Relation constraint violation
        return new BadRequestError(`The change violates a required relational constraint for ${entityName}.`);
      }
      case 'P2024': {
        // Connection pool timeout
        return new AppError('Database connection timed out under heavy load. Please retry.', 503);
      }
      default:
        return new AppError(`Database operation failed: ${err.message}`, 500);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    logger.error(`[Database Validation Error] ${entityName}:`, (error as Error).message);
    return new BadRequestError(`Database query validation failed. Invalid data structure provided.`);
  }

  if (error instanceof Error) {
    logger.error(`[Unhandled Error] ${entityName}:`, error.message);
    return new AppError(error.message, 500);
  }

  return new AppError('An unexpected database error occurred.', 500);
}

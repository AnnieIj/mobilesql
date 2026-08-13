import { Response } from 'express';
import { ApiResponse, PaginatedResult } from '../types';

export class ApiResponseBuilder {
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Operation completed successfully.',
    statusCode: number = 200,
    meta?: Record<string, any>
  ) {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  static paginated<T>(
    res: Response,
    result: PaginatedResult<T>,
    message: string = 'Data retrieved successfully.',
    statusCode: number = 200
  ) {
    const payload: ApiResponse<T[]> = {
      success: true,
      message,
      data: result.data,
      meta: {
        pagination: result.pagination,
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    errorMessage: string = 'An unexpected server error occurred.',
    statusCode: number = 500,
    details?: any
  ) {
    const payload: ApiResponse = {
      success: false,
      error: errorMessage,
      meta: details ? { details } : undefined,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }
}

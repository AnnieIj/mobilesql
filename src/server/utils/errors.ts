export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request or invalid parameters.') {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Requested resource not found.') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required or token expired.') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'You do not have permission to access this resource.') {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  public readonly errors?: any;

  constructor(message: string = 'Invalid input validation error.', errors?: any) {
    super(message, 400);
    this.errors = errors;
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict or duplicate record already exists.') {
    super(message, 409);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests. Please try again later.') {
    super(message, 429);
  }
}

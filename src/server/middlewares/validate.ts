import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issueMap = error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        }));
        return next(new ValidationError('Request validation failed.', issueMap));
      }
      next(error);
    }
  };
};

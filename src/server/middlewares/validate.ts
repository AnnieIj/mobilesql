import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodObject } from 'zod';
import { ValidationError } from '../utils/errors';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const shape = schema instanceof ZodObject ? schema.shape : null;
      const isRequestWrapper =
        shape &&
        ((shape.body && shape.body instanceof ZodObject) ||
          (shape.params && shape.params instanceof ZodObject) ||
          (shape.query && shape.query instanceof ZodObject));

      if (isRequestWrapper) {
        schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });
      } else {
        const parsed = schema.parse(req.body);
        req.body = parsed;
      }
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

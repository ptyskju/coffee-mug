import { NextFunction, Request, Response } from 'express';
import { ApplicationError } from './application-error';
import { ValidationChain, validationResult } from 'express-validator';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  if (err instanceof ApplicationError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }

  next(err);
}

export function validate(checks: ValidationChain[]) {
  return [
    ...checks,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        return next();
      }

      res.status(422).json({ errors: errors.array() }).send();
    },
  ];
}

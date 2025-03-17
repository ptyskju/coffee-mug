import { ApplicationError } from './application-error';

export class ForbiddenError extends ApplicationError {
  public readonly statusCode = 403;
}

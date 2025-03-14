import { ApplicationError } from './application-error';

export class NotFoundError extends ApplicationError {
  public readonly statusCode = 404;
}

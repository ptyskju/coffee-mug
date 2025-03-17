import { ApplicationError } from './application-error';

export class UnprocessableEntityError extends ApplicationError {
  public readonly statusCode = 422;
}

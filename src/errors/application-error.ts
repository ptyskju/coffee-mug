export class ApplicationError extends Error {
  public readonly statusCode: number = 500;
  constructor(public readonly message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

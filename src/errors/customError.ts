export class customError extends Error {
  public name: string;
  public error: string;
  public cause?: Error;
  constructor(name: string, error: string, cause?: Error) {
    super(error);
    this.name = name;
    this.error = error;
    this.cause = cause;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, customError.prototype);
  }
}

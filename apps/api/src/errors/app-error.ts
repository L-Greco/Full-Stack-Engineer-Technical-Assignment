export type AppErrorOptions = {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  expose?: boolean;
};

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;
  readonly expose: boolean;

  constructor({
    statusCode,
    code,
    message,
    details,
    expose = true
  }: AppErrorOptions) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.expose = expose;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, AppError);
  }
}

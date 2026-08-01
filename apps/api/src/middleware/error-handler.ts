import type { NextFunction, Request, Response } from "express";

import { normalizeError } from "../errors/normalize-error.js";

type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response<ApiErrorResponse>,
  next: NextFunction
): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  const normalizedError = normalizeError(error);

  if (normalizedError.statusCode >= 500) {
    console.error("Unhandled request error", {
      error,
      method: req.method,
      path: req.originalUrl
    });
  }

  res.status(normalizedError.statusCode).json({
    error: {
      code: normalizedError.code,
      message: normalizedError.expose
        ? normalizedError.message
        : "An unexpected error occurred.",
      ...(normalizedError.details !== undefined
        ? { details: normalizedError.details }
        : {})
    }
  });
}

import { AppError } from "./app-error.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isInvalidJsonError(error: unknown): boolean {
  if (!isObject(error)) {
    return false;
  }

  return error.type === "entity.parse.failed" && (error.status === 400 || error.statusCode === 400);
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isInvalidJsonError(error)) {
    return new AppError({
      statusCode: 400,
      code: "INVALID_JSON",
      message: "The request body contains invalid JSON."
    });
  }

  return new AppError({
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
    expose: false
  });
}

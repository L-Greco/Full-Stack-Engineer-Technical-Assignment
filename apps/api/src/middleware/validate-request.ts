import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ValidationError, type Schema } from "yup";

import { AppError } from "../errors/app-error.js";

type RequestTarget = "body" | "params" | "query";

type ValidationLocals = {
  validatedBody?: unknown;
  validatedParams?: unknown;
  validatedQuery?: unknown;
};

function getValidationKey(target: RequestTarget): keyof ValidationLocals {
  switch (target) {
    case "body":
      return "validatedBody";
    case "params":
      return "validatedParams";
    case "query":
      return "validatedQuery";
  }
}

function getValidationInput(req: Request, target: RequestTarget): unknown {
  switch (target) {
    case "body":
      return req.body;
    case "params":
      return req.params;
    case "query":
      return req.query;
  }
}

function formatValidationError(
  error: ValidationError
): Array<{ field: string; message: string }> {
  const issues = error.inner.length > 0 ? error.inner : [error];

  return issues.map((issue) => ({
    field: issue.path ?? "root",
    message: issue.message
  }));
}

export function validateRequest<TSchemaOutput>(
  schema: Schema<TSchemaOutput>,
  target: RequestTarget
): RequestHandler {
  return async function requestValidationMiddleware(
    req: Request,
    res: Response<unknown, ValidationLocals>,
    next: NextFunction
  ): Promise<void> {
    try {
      const input = getValidationInput(req, target);
      const result = await schema.validate(input, {
        abortEarly: false,
        stripUnknown: true
      });

      res.locals[getValidationKey(target)] = result;
      next();
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        next(
          new AppError({
            statusCode: 400,
            code: "VALIDATION_ERROR",
            message: "The request contains invalid input.",
            details: formatValidationError(error)
          })
        );
        return;
      }

      next(
        new AppError({
          statusCode: 500,
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred.",
          expose: false
        })
      );
    }
  };
}

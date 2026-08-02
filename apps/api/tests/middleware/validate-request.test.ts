import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as yup from "yup";

import { AppError } from "../../src/errors/app-error.js";
import { validateRequest } from "../../src/middleware/validate-request.js";

void describe("validateRequest", () => {
  void it("stores the validated body and strips unknown fields when validation succeeds", async () => {
    //Arrange
    const schema = yup
      .object({
        name: yup.string().required()
      })
      .required();
    const middleware = validateRequest(schema, "body");
    const req = {
      body: {
        name: "Athens Sensor",
        ignored: "remove-me"
      }
    };
    const res = {
      locals: {}
    };
    let nextError: unknown;

    const next = (error?: unknown) => {
      nextError = error;
    };

    //Act
    await middleware(req as never, res as never, next);

    //Assert
    assert.equal(nextError, undefined);
    assert.deepEqual(res.locals, {
      validatedBody: {
        name: "Athens Sensor"
      }
    });
  });

  void it("passes a validation error to next when the request body is invalid", async () => {
    //Arrange
    const schema = yup
      .object({
        name: yup.string().required()
      })
      .required();
    const middleware = validateRequest(schema, "body");
    const req = {
      body: {}
    };
    const res = {
      locals: {}
    };
    let nextError: unknown;

    const next = (error?: unknown) => {
      nextError = error;
    };

    //Act
    await middleware(req as never, res as never, next);

    //Assert
    assert.ok(nextError instanceof AppError);
    assert.equal(nextError.statusCode, 400);
    assert.equal(nextError.code, "VALIDATION_ERROR");
    assert.equal(nextError.message, "The request contains invalid input.");
    assert.deepEqual(nextError.details, [
      {
        field: "name",
        message: "name is a required field"
      }
    ]);
  });
});

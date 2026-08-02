import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AppError } from "../../src/errors/app-error.js";
import { normalizeError } from "../../src/errors/normalize-error.js";

void describe("normalizeError", () => {
  void it("returns the same app error instance when one is already provided", () => {
    //Arrange
    const error = new AppError({
      statusCode: 404,
      code: "ASSET_NOT_FOUND",
      message: "Asset was not found."
    });

    //Act
    const result = normalizeError(error);

    //Assert
    assert.equal(result, error);
  });

  void it("maps invalid JSON parsing failures to a client-facing invalid json error", () => {
    //Arrange
    const error = {
      type: "entity.parse.failed",
      status: 400
    };

    //Act
    const result = normalizeError(error);

    //Assert
    assert.ok(result instanceof AppError);
    assert.equal(result.statusCode, 400);
    assert.equal(result.code, "INVALID_JSON");
    assert.equal(result.message, "The request body contains invalid JSON.");
    assert.equal(result.expose, true);
  });

  void it("falls back to an internal server error for unexpected failures", () => {
    //Arrange
    const error = new Error("boom");

    //Act
    const result = normalizeError(error);

    //Assert
    assert.ok(result instanceof AppError);
    assert.equal(result.statusCode, 500);
    assert.equal(result.code, "INTERNAL_SERVER_ERROR");
    assert.equal(result.message, "An unexpected error occurred.");
    assert.equal(result.expose, false);
  });
});

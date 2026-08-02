import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  listAssetsQuerySchema,
  toListAssetsQuery,
  updateAssetBodySchema
} from "../../../src/modules/assets/asset.schemas.js";

void describe("asset.schemas", () => {
  void it("rejects list filters when only part of the bounding box is provided", async () => {
    //Arrange
    const query = {
      minLat: "10",
      maxLat: "20",
      minLng: "30"
    };

    //Act
    const result = listAssetsQuerySchema.validate(query, {
      abortEarly: false,
      stripUnknown: true
    });

    //Assert
    await assert.rejects(result, (error: unknown) => {
      assert.equal(error instanceof Error, true);
      assert.equal(
        (error as Error).message.includes(
          "Bounding box filters require minLat, maxLat, minLng, and maxLng together."
        ),
        true
      );
      return true;
    });
  });

  void it("rejects list filters when the latitude range is inverted", async () => {
    //Arrange
    const query = {
      minLat: "20",
      maxLat: "10",
      minLng: "30",
      maxLng: "40"
    };

    //Act
    const result = listAssetsQuerySchema.validate(query, {
      abortEarly: false,
      stripUnknown: true
    });

    //Assert
    await assert.rejects(result, (error: unknown) => {
      assert.equal(error instanceof Error, true);
      assert.equal((error as Error).message.includes("minLat must be less than maxLat."), true);
      return true;
    });
  });

  void it("builds a bounding box only when all validated bounds are present", () => {
    //Arrange
    const input = {
      page: 2,
      limit: 10,
      status: "warning" as const,
      minLat: 10,
      maxLat: 20,
      minLng: 30,
      maxLng: 40
    };

    //Act
    const result = toListAssetsQuery(input);

    //Assert
    assert.deepEqual(result, {
      page: 2,
      limit: 10,
      status: "warning",
      boundingBox: {
        minLat: 10,
        maxLat: 20,
        minLng: 30,
        maxLng: 40
      }
    });
  });

  void it("rejects an update request when no fields are provided", async () => {
    //Arrange
    const input = {};

    //Act
    const result = updateAssetBodySchema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    });

    //Assert
    await assert.rejects(result, (error: unknown) => {
      assert.equal(error instanceof Error, true);
      assert.equal(
        (error as Error).message.includes("At least one field must be provided."),
        true
      );
      return true;
    });
  });
});

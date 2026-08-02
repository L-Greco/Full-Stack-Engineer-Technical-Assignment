import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  toAssetFormValues,
  toAssetWriteInput
} from "../../src/lib/asset-form.js";

import type { Asset, AssetFormValues } from "../../src/types/assets.js";

const ASSET: Asset = {
  id: "asset-1",
  name: "Hydrant Alpha",
  type: "hydrant",
  status: "critical",
  lat: 37.97,
  lng: 23.71,
  installed_at: "2024-05-01",
  last_inspected_at: null,
  notes: "Replace cap"
};

void describe("asset form helpers", () => {
  void it("maps a missing inspected date to an empty form field when editing an asset", () => {
    //Arrange
    const asset = ASSET;

    //Act
    const result = toAssetFormValues(asset);

    //Assert
    assert.deepEqual(result, {
      name: "Hydrant Alpha",
      type: "hydrant",
      status: "critical",
      lat: 37.97,
      lng: 23.71,
      installed_at: "2024-05-01",
      last_inspected_at: "",
      notes: "Replace cap"
    });
  });

  void it("returns a write payload with trimmed strings and a null inspected date when the field is blank", () => {
    //Arrange
    const values: AssetFormValues = {
      name: "  Hydrant Alpha  ",
      type: "hydrant",
      status: "critical",
      lat: 37.97,
      lng: 23.71,
      installed_at: "2024-05-01",
      last_inspected_at: "   ",
      notes: "  Replace cap  "
    };

    //Act
    const result = toAssetWriteInput(values);

    //Assert
    assert.deepEqual(result, {
      name: "Hydrant Alpha",
      type: "hydrant",
      status: "critical",
      lat: 37.97,
      lng: 23.71,
      installed_at: "2024-05-01",
      last_inspected_at: null,
      notes: "Replace cap"
    });
  });
});

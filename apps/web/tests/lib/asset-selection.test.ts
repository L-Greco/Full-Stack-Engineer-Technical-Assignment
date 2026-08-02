import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getActiveSelectedAssetId,
  getSelectedAsset
} from "../../src/lib/asset-selection.js";

import type { Asset } from "../../src/types/assets.js";

const ASSETS: Asset[] = [
  {
    id: "asset-1",
    name: "Pipe One",
    type: "pipe",
    status: "ok",
    lat: 37.98,
    lng: 23.72,
    installed_at: "2024-01-10",
    last_inspected_at: "2026-06-20",
    notes: ""
  },
  {
    id: "asset-2",
    name: "Sensor Two",
    type: "sensor",
    status: "warning",
    lat: 37.99,
    lng: 23.73,
    installed_at: "2024-02-11",
    last_inspected_at: null,
    notes: "Needs attention"
  }
];

void describe("asset selection helpers", () => {
  void it("keeps the selected asset id when it still exists in the current asset list", () => {
    //Arrange
    const selectedAssetId = "asset-2";

    //Act
    const result = getActiveSelectedAssetId(ASSETS, selectedAssetId);

    //Assert
    assert.equal(result, "asset-2");
  });

  void it("falls back to the first asset id when the current selection is no longer available", () => {
    //Arrange
    const selectedAssetId = "missing-asset";

    //Act
    const result = getActiveSelectedAssetId(ASSETS, selectedAssetId);

    //Assert
    assert.equal(result, "asset-1");
  });

  void it("returns null when no active selection exists in an empty asset list", () => {
    //Arrange
    const activeSelectedAssetId = null;

    //Act
    const result = getSelectedAsset(activeSelectedAssetId, []);

    //Assert
    assert.equal(result, null);
  });

  void it("returns the selected asset when the active selection matches an asset id", () => {
    //Arrange
    const activeSelectedAssetId = "asset-2";

    //Act
    const result = getSelectedAsset(activeSelectedAssetId, ASSETS);

    //Assert
    assert.deepEqual(result, ASSETS[1]);
  });
});

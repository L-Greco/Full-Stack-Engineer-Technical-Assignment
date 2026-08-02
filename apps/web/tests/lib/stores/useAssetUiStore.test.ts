import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { useAssetUiStore } from "../../../src/lib/stores/useAssetUiStore.js";

afterEach(() => {
  useAssetUiStore.setState({
    draftLocation: null,
    isPickingLocation: false,
    panelMode: "view",
    selectedAssetId: null
  });
});

void describe("useAssetUiStore", () => {
  void it("opens the create panel with a cleared selection and location draft", () => {
    //Arrange
    useAssetUiStore.setState({
      draftLocation: {
        lat: 37.98,
        lng: 23.72
      },
      isPickingLocation: true,
      panelMode: "edit",
      selectedAssetId: "asset-1"
    });

    //Act
    useAssetUiStore.getState().openCreatePanel();

    //Assert
    assert.deepEqual(useAssetUiStore.getState(), {
      draftLocation: null,
      isPickingLocation: false,
      panelMode: "create",
      selectedAssetId: null,
      closePanel: useAssetUiStore.getState().closePanel,
      openCreatePanel: useAssetUiStore.getState().openCreatePanel,
      openEditPanel: useAssetUiStore.getState().openEditPanel,
      selectAsset: useAssetUiStore.getState().selectAsset,
      setDraftLocation: useAssetUiStore.getState().setDraftLocation,
      setPickingLocation: useAssetUiStore.getState().setPickingLocation
    });
  });

  void it("opens the edit panel for the requested asset id", () => {
    //Arrange
    const assetId = "asset-2";

    //Act
    useAssetUiStore.getState().openEditPanel(assetId);

    //Assert
    assert.equal(useAssetUiStore.getState().panelMode, "edit");
    assert.equal(useAssetUiStore.getState().selectedAssetId, "asset-2");
    assert.equal(useAssetUiStore.getState().isPickingLocation, false);
    assert.equal(useAssetUiStore.getState().draftLocation, null);
  });

  void it("closes the panel and clears transient creation state", () => {
    //Arrange
    useAssetUiStore.setState({
      draftLocation: {
        lat: 37.99,
        lng: 23.73
      },
      isPickingLocation: true,
      panelMode: "create",
      selectedAssetId: null
    });

    //Act
    useAssetUiStore.getState().closePanel();

    //Assert
    assert.equal(useAssetUiStore.getState().panelMode, "view");
    assert.equal(useAssetUiStore.getState().isPickingLocation, false);
    assert.equal(useAssetUiStore.getState().draftLocation, null);
  });
});

import { create } from "zustand";

import type { AssetLocation } from "../../types/assets";

type AssetPanelMode = "view" | "create" | "edit";

interface AssetUiState {
  draftLocation: AssetLocation | null;
  isPickingLocation: boolean;
  panelMode: AssetPanelMode;
  selectedAssetId: string | null;
  closePanel: () => void;
  openCreatePanel: () => void;
  openEditPanel: (assetId: string) => void;
  selectAsset: (assetId: string | null) => void;
  setDraftLocation: (location: AssetLocation | null) => void;
  setPickingLocation: (isPickingLocation: boolean) => void;
}

export const useAssetUiStore = create<AssetUiState>((set) => ({
  draftLocation: null,
  isPickingLocation: false,
  panelMode: "view",
  selectedAssetId: null,
  closePanel: () => {
    set({
      draftLocation: null,
      isPickingLocation: false,
      panelMode: "view"
    });
  },
  openCreatePanel: () => {
    set({
      draftLocation: null,
      isPickingLocation: false,
      panelMode: "create",
      selectedAssetId: null
    });
  },
  openEditPanel: (assetId) => {
    set({
      draftLocation: null,
      isPickingLocation: false,
      panelMode: "edit",
      selectedAssetId: assetId
    });
  },
  selectAsset: (assetId) => {
    set({
      draftLocation: null,
      isPickingLocation: false,
      panelMode: "view",
      selectedAssetId: assetId
    });
  },
  setDraftLocation: (draftLocation) => {
    set({ draftLocation });
  },
  setPickingLocation: (isPickingLocation) => {
    set({ isPickingLocation });
  }
}));

export function selectClosePanel(state: AssetUiState) {
  return state.closePanel;
}

export function selectDraftLocation(state: AssetUiState) {
  return state.draftLocation;
}

export function selectIsPickingLocation(state: AssetUiState) {
  return state.isPickingLocation;
}

export function selectOpenCreatePanel(state: AssetUiState) {
  return state.openCreatePanel;
}

export function selectOpenEditPanel(state: AssetUiState) {
  return state.openEditPanel;
}

export function selectPanelMode(state: AssetUiState) {
  return state.panelMode;
}

export function selectSelectAsset(state: AssetUiState) {
  return state.selectAsset;
}

export function selectSelectedAssetId(state: AssetUiState) {
  return state.selectedAssetId;
}

export function selectSetDraftLocation(state: AssetUiState) {
  return state.setDraftLocation;
}

export function selectSetPickingLocation(state: AssetUiState) {
  return state.setPickingLocation;
}

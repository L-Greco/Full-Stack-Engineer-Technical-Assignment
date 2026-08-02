import { create } from "zustand";

type AssetPanelMode = "view" | "create" | "edit";

interface AssetUiState {
  panelMode: AssetPanelMode;
  selectedAssetId: string | null;
  selectAsset: (assetId: string | null) => void;
  setPanelMode: (panelMode: AssetPanelMode) => void;
}

export const useAssetUiStore = create<AssetUiState>((set) => ({
  panelMode: "view",
  selectedAssetId: null,
  selectAsset: (assetId) => {
    set({
      panelMode: "view",
      selectedAssetId: assetId
    });
  },
  setPanelMode: (panelMode) => {
    set({ panelMode });
  }
}));

export function selectPanelMode(state: AssetUiState) {
  return state.panelMode;
}

export function selectSelectAsset(state: AssetUiState) {
  return state.selectAsset;
}

export function selectSelectedAssetId(state: AssetUiState) {
  return state.selectedAssetId;
}

export function selectSetPanelMode(state: AssetUiState) {
  return state.setPanelMode;
}

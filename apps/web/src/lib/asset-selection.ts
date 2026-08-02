import type { Asset } from "../types/assets";

export function getActiveSelectedAssetId(
  assets: Asset[],
  selectedAssetId: string | null
): string | null {
  return selectedAssetId !== null && assets.some((asset) => asset.id === selectedAssetId)
    ? selectedAssetId
    : assets[0]?.id ?? null;
}

export function getSelectedAsset(
  activeSelectedAssetId: string | null,
  assets: Asset[]
): Asset | null {
  return activeSelectedAssetId === null
    ? null
    : assets.find((asset) => asset.id === activeSelectedAssetId) ?? null;
}

import type { AssetListResult, ListAssetsQuery } from "./asset.types.js";
import * as assetRepository from "./asset.repository.js";

export function listAssets(query: ListAssetsQuery): AssetListResult {
  return assetRepository.listAssets(query);
}

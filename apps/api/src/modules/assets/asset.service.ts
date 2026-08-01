import type { AssetListResult, ListAssetsQuery } from "./asset.types.js";
import * as assetRepository from "./asset.repository.js";

export async function listAssets(query: ListAssetsQuery): Promise<AssetListResult> {
  return assetRepository.listAssets(query);
}

/**
 * Role: Holds the asset business behavior, including ID generation and domain-level not-found handling.
 */
import { randomUUID } from "node:crypto";

import { AppError } from "../../errors/app-error.js";
import type {
  Asset,
  AssetListResult,
  CreateAssetInput,
  ListAssetsQuery,
  UpdateAssetInput
} from "./asset.types.js";
import * as assetRepository from "./asset.repository.js";

export async function listAssets(query: ListAssetsQuery): Promise<AssetListResult> {
  return assetRepository.listAssets(query);
}

export async function createAsset(input: CreateAssetInput): Promise<Asset> {
  return assetRepository.createAsset(randomUUID(), input);
}

export async function updateAsset(
  assetId: string,
  input: UpdateAssetInput
): Promise<Asset> {
  const asset = await assetRepository.updateAsset(assetId, input);

  if (!asset) {
    throw new AppError({
      statusCode: 404,
      code: "ASSET_NOT_FOUND",
      message: `Asset ${assetId} was not found.`
    });
  }

  return asset;
}

export async function deleteAsset(assetId: string): Promise<void> {
  const deleted = await assetRepository.deleteAsset(assetId);

  if (!deleted) {
    throw new AppError({
      statusCode: 404,
      code: "ASSET_NOT_FOUND",
      message: `Asset ${assetId} was not found.`
    });
  }
}

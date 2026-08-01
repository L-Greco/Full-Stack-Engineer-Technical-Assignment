import { readFile } from "node:fs/promises";

import { AppError } from "../../errors/app-error.js";
import { assetSeedListSchema } from "./asset.schemas.js";
import type { Asset, AssetListResult, ListAssetsQuery } from "./asset.types.js";

let assets: Asset[] = [];

function sortAssets(items: readonly Asset[]): Asset[] {
  return [...items].sort(
    (left, right) => left.name.localeCompare(right.name) || left.id.localeCompare(right.id)
  );
}

function matchesBoundingBox(asset: Asset, query: ListAssetsQuery): boolean {
  if (!query.boundingBox) {
    return true;
  }

  const { minLat, maxLat, minLng, maxLng } = query.boundingBox;

  return asset.lat >= minLat && asset.lat <= maxLat && asset.lng >= minLng && asset.lng <= maxLng;
}

export async function seedAssetsIfEmpty(seedFilePath: string): Promise<void> {
  if (assets.length > 0) {
    return;
  }

  try {
    const rawSeed = await readFile(seedFilePath, "utf8");
    const parsedSeed = JSON.parse(rawSeed) as unknown;
    const validatedSeed = await assetSeedListSchema.validate(parsedSeed, {
      abortEarly: false,
      stripUnknown: false
    });
    assets = sortAssets(validatedSeed);
  } catch (error) {
    throw new AppError({
      statusCode: 500,
      code: "SEED_LOAD_FAILED",
      message: "The asset seed file could not be loaded.",
      details:
        error instanceof Error
          ? { message: error.message }
          : { message: "Unknown seed loading failure." },
      expose: false
    });
  }
}

export function listAssets(query: ListAssetsQuery): AssetListResult {
  const filteredAssets = assets.filter((asset) => {
    if (query.type && asset.type !== query.type) {
      return false;
    }

    if (query.status && asset.status !== query.status) {
      return false;
    }

    return matchesBoundingBox(asset, query);
  });

  const total = filteredAssets.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);
  const offset = (query.page - 1) * query.limit;

  return {
    items: filteredAssets.slice(offset, offset + query.limit),
    total,
    page: query.page,
    limit: query.limit,
    totalPages
  };
}

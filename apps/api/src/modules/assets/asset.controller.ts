import type { Request, Response } from "express";

import * as assetService from "./asset.service.js";
import { toListAssetsQuery } from "./asset.schemas.js";
import type {
  Asset,
  AssetListResult,
  AssetRouteParams,
  CreateAssetInput,
  ListAssetsQueryInput,
  UpdateAssetInput
} from "./asset.types.js";

type ListAssetsResponse = {
  data: AssetListResult["items"];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ListAssetsLocals = {
  validatedQuery: ListAssetsQueryInput;
};

type AssetResponse = {
  data: Asset;
};

type CreateAssetLocals = {
  validatedBody: CreateAssetInput;
};

type UpdateAssetLocals = {
  validatedBody: UpdateAssetInput;
  validatedParams: AssetRouteParams;
};

type DeleteAssetLocals = {
  validatedParams: AssetRouteParams;
};

export async function listAssets(
  _req: Request,
  res: Response<ListAssetsResponse, ListAssetsLocals>
): Promise<void> {
  const result = await assetService.listAssets(
    toListAssetsQuery(res.locals.validatedQuery)
  );

  res.status(200).json({
    data: result.items,
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    }
  });
}

export async function createAsset(
  _req: Request,
  res: Response<AssetResponse, CreateAssetLocals>
): Promise<void> {
  const asset = await assetService.createAsset(res.locals.validatedBody);

  res.status(201).json({
    data: asset
  });
}

export async function updateAsset(
  _req: Request,
  res: Response<AssetResponse, UpdateAssetLocals>
): Promise<void> {
  const asset = await assetService.updateAsset(
    res.locals.validatedParams.assetId,
    res.locals.validatedBody
  );

  res.status(200).json({
    data: asset
  });
}

export async function deleteAsset(
  _req: Request,
  res: Response<undefined, DeleteAssetLocals>
): Promise<void> {
  await assetService.deleteAsset(res.locals.validatedParams.assetId);
  res.status(204).send();
}

import type { Request, Response } from "express";

import * as assetService from "./asset.service.js";
import { toListAssetsQuery } from "./asset.schemas.js";
import type { AssetListResult, ListAssetsQueryInput } from "./asset.types.js";

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

export function listAssets(
  _req: Request,
  res: Response<ListAssetsResponse, ListAssetsLocals>
): void {
  const result = assetService.listAssets(
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

import { Router } from "express";

import { validateRequest } from "../../middleware/validate-request.js";
import {
  createAsset,
  deleteAsset,
  listAssets,
  updateAsset
} from "./asset.controller.js";
import {
  assetIdParamsSchema,
  createAssetBodySchema,
  listAssetsQuerySchema,
  updateAssetBodySchema
} from "./asset.schemas.js";

export const assetRouter = Router();

assetRouter.get("/", validateRequest(listAssetsQuerySchema, "query"), listAssets);
assetRouter.post("/", validateRequest(createAssetBodySchema, "body"), createAsset);
assetRouter.patch(
  "/:assetId",
  validateRequest(assetIdParamsSchema, "params"),
  validateRequest(updateAssetBodySchema, "body"),
  updateAsset
);
assetRouter.delete(
  "/:assetId",
  validateRequest(assetIdParamsSchema, "params"),
  deleteAsset
);

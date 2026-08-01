import { Router } from "express";

import { validateRequest } from "../../middleware/validate-request.js";
import { listAssets } from "./asset.controller.js";
import { listAssetsQuerySchema } from "./asset.schemas.js";

export const assetRouter = Router();

assetRouter.get("/", validateRequest(listAssetsQuerySchema, "query"), listAssets);

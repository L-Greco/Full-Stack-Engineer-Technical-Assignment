import cors from "cors";
import express from "express";

import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found-handler.js";
import { assetRouter } from "./modules/assets/asset.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ ok: true });
});

app.use("/api/assets", assetRouter);

app.use(notFoundHandler);
app.use(errorHandler);

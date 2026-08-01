import { app } from "./app.js";
import { env } from "./config/env.js";
import { seedAssetsIfEmpty } from "./modules/assets/asset.repository.js";

export async function startServer(): Promise<void> {
  await seedAssetsIfEmpty(env.seedFilePath);

  const server = app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });

  const shutdown = (signal: NodeJS.Signals) => {
    console.log(`Received ${signal}, shutting down API.`);
    server.close(() => {
      process.exit(0);
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

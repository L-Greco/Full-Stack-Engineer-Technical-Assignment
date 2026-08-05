/**
 * Role: Starts infrastructure dependencies, seeds the database when needed, and wires graceful shutdown.
 */
import { app } from "./app.js";
import { env } from "./config/env.js";
import { closeDatabase, connectToDatabase, initializeDatabase } from "./database/database.js";
import { seedAssetsIfEmpty } from "./modules/assets/asset.repository.js";

export async function startServer(): Promise<void> {
  // TODO: Log errors on each of the steps below.
  await connectToDatabase();
  await initializeDatabase();
  await seedAssetsIfEmpty(env.seedFilePath);

  const server = app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });

  const shutdown = (signal: NodeJS.Signals) => {
    console.log(`Received ${signal}, shutting down API.`);
    server.close(() => {
      void closeDatabase().finally(() => {
        process.exit(0);
      });
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

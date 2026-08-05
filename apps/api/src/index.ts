/**
 * Role: Entry point that boots the API server and fails fast if startup initialization throws.
 */
import { startServer } from "./server.js";

startServer().catch((error: unknown) => {
  console.error("Failed to start API", error);
  process.exit(1);
});

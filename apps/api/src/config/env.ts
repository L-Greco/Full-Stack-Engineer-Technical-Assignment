import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

export const env = {
  port: Number(process.env.PORT ?? 3001),
  seedFilePath: path.resolve(currentDirectory, "../../data/seed.json")
};

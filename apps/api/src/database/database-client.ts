import { Pool, type PoolConfig } from "pg";

import { env } from "../config/env.js";

const databaseConfig: PoolConfig = {
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.database
};

export const database: Pool = new Pool(databaseConfig);

export async function connectToDatabase(): Promise<void> {
  const client = await database.connect();
  client.release();
}

export async function closeDatabase(): Promise<void> {
  await database.end();
}

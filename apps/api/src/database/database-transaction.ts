import type { PoolClient } from "pg";

import { database } from "./database-client.js";

export type DatabaseClient = PoolClient;

export async function withDatabaseTransaction<T>(
  callback: (client: DatabaseClient) => Promise<T>
): Promise<T> {
  const client = await database.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error: unknown) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

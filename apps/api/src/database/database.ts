import { Pool, type PoolClient, type PoolConfig } from "pg";

import { env } from "../config/env.js";

const databaseConfig: PoolConfig = {
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.database
};

export const database: Pool = new Pool(databaseConfig);

export type DatabaseClient = PoolClient;

export async function connectToDatabase(): Promise<void> {
  const client = await database.connect();
  client.release();
}

export async function initializeDatabase(): Promise<void> {
  try {
    await database.query("CREATE EXTENSION IF NOT EXISTS postgis");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown PostGIS initialization failure.";

    throw new Error(
      `Failed to enable PostGIS. Make sure the database container uses a PostGIS image. ${errorMessage}`
    );
  }

  await database.query(`
    CREATE TABLE IF NOT EXISTS assets (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      type text NOT NULL CHECK (type IN ('pipe', 'hydrant', 'sensor', 'valve')),
      status text NOT NULL CHECK (status IN ('ok', 'warning', 'critical')),
      installed_at date NOT NULL,
      last_inspected_at date,
      notes text NOT NULL,
      location geometry(Point, 4326) NOT NULL
    )
  `);

  await database.query(`
    CREATE INDEX IF NOT EXISTS assets_location_gix
    ON assets
    USING GIST (location)
  `);
}

export async function closeDatabase(): Promise<void> {
  await database.end();
}

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

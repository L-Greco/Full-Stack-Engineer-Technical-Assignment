/**
 * Role: Ensures required database capabilities, schema objects, and indexes exist before serving requests.
 */
import { database } from "./database-client.js";

// SRID 4326 is the standard WGS84 latitude/longitude coordinate system used by GPS and web maps.
const wgs84Srid = 4326;

const createAssetsTableSql = `
  CREATE TABLE IF NOT EXISTS assets (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL CHECK (type IN ('pipe', 'hydrant', 'sensor', 'valve')),
    status text NOT NULL CHECK (status IN ('ok', 'warning', 'critical')),
    installed_at date NOT NULL,
    last_inspected_at date,
    notes text NOT NULL,
    location geometry(Point, ${wgs84Srid}) NOT NULL
  )
`;

const createAssetsLocationIndexSql = `
  CREATE INDEX IF NOT EXISTS assets_location_gix
  ON assets
  USING GIST (location)
`;

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

  await database.query(createAssetsTableSql);
  await database.query(createAssetsLocationIndexSql);
}

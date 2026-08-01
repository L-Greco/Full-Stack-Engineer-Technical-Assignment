import { readFile } from "node:fs/promises";

import {
  database,
  withDatabaseTransaction
} from "../../database/database.js";
import { AppError } from "../../errors/app-error.js";
import { assetSeedListSchema } from "./asset.schemas.js";
import type { Asset, AssetListResult, ListAssetsQuery } from "./asset.types.js";

type QueryParameter = string | number | null;

type AssetRow = {
  id: string;
  name: string;
  type: Asset["type"];
  status: Asset["status"];
  lat: number;
  lng: number;
  installed_at: string;
  last_inspected_at: string | null;
  notes: string;
};

function mapAssetRow(row: AssetRow): Asset {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    status: row.status,
    lat: row.lat,
    lng: row.lng,
    installed_at: row.installed_at,
    last_inspected_at: row.last_inspected_at,
    notes: row.notes
  };
}

function buildListAssetsWhereClause(
  query: ListAssetsQuery
): { clause: string; parameters: QueryParameter[] } {
  const conditions: string[] = [];
  const parameters: QueryParameter[] = [];

  if (query.type) {
    parameters.push(query.type);
    conditions.push(`type = $${parameters.length}`);
  }

  if (query.status) {
    parameters.push(query.status);
    conditions.push(`status = $${parameters.length}`);
  }

  if (query.boundingBox) {
    parameters.push(
      query.boundingBox.minLng,
      query.boundingBox.minLat,
      query.boundingBox.maxLng,
      query.boundingBox.maxLat
    );
    conditions.push(`
      ST_Within(
        location,
        ST_MakeEnvelope(
          $${parameters.length - 3},
          $${parameters.length - 2},
          $${parameters.length - 1},
          $${parameters.length},
          4326
        )
      )
    `);
  }

  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    parameters
  };
}

export async function seedAssetsIfEmpty(seedFilePath: string): Promise<void> {
  try {
    const existingAssetsResult = await database.query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM assets"
    );

    if (Number(existingAssetsResult.rows[0]?.count ?? "0") > 0) {
      return;
    }

    const rawSeed = await readFile(seedFilePath, "utf8");
    const parsedSeed = JSON.parse(rawSeed) as unknown;
    const validatedSeed: Asset[] = await assetSeedListSchema.validate(parsedSeed, {
      abortEarly: false,
      stripUnknown: false
    });

    await withDatabaseTransaction(async (client) => {
      for (const asset of validatedSeed) {
        await client.query(
          `
            INSERT INTO assets (
              id,
              name,
              type,
              status,
              installed_at,
              last_inspected_at,
              notes,
              location
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5::date,
              $6::date,
              $7,
              ST_SetSRID(ST_MakePoint($8, $9), 4326)
            )
          `,
          [
            asset.id,
            asset.name,
            asset.type,
            asset.status,
            asset.installed_at,
            asset.last_inspected_at,
            asset.notes,
            asset.lng,
            asset.lat
          ]
        );
      }
    });
  } catch (error) {
    throw new AppError({
      statusCode: 500,
      code: "SEED_LOAD_FAILED",
      message: "The asset seed file could not be loaded.",
      details:
        error instanceof Error
          ? { message: error.message }
          : { message: "Unknown seed loading failure." },
      expose: false
    });
  }
}

export async function listAssets(query: ListAssetsQuery): Promise<AssetListResult> {
  const { clause, parameters } = buildListAssetsWhereClause(query);
  const offset = (query.page - 1) * query.limit;

  const totalResult = await database.query<{ total: string }>(
    `SELECT COUNT(*)::text AS total FROM assets ${clause}`,
    parameters
  );

  const total = Number(totalResult.rows[0]?.total ?? "0");
  const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);

  const dataParameters = [...parameters, query.limit, offset];
  const assetsResult = await database.query<AssetRow>(
    `
      SELECT
        id,
        name,
        type,
        status,
        ST_Y(location)::float8 AS lat,
        ST_X(location)::float8 AS lng,
        installed_at::text AS installed_at,
        last_inspected_at::text AS last_inspected_at,
        notes
      FROM assets
      ${clause}
      ORDER BY name ASC, id ASC
      LIMIT $${dataParameters.length - 1}
      OFFSET $${dataParameters.length}
    `,
    dataParameters
  );

  return {
    items: assetsResult.rows.map(mapAssetRow),
    total,
    page: query.page,
    limit: query.limit,
    totalPages
  };
}

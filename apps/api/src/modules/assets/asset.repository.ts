/**
 * Role: Encapsulates asset persistence, SQL construction, row mapping, and initial seed loading.
 */
import { readFile } from "node:fs/promises";

import { database, withDatabaseTransaction } from "../../database/database.js";
import { AppError } from "../../errors/app-error.js";
import { assetSeedListSchema } from "./asset.schemas.js";

import type {
  Asset,
  AssetListResult,
  CreateAssetInput,
  ListAssetsQuery,
  UpdateAssetInput
} from "./asset.types.js";

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

type SqlStatement = {
  text: string;
  parameters: QueryParameter[];
};

const assetSelectClause = `
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
`;

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

function buildListAssetsWhereClause(query: ListAssetsQuery): SqlStatement {
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
    text: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    parameters
  };
}

function buildListAssetsCountStatement(query: ListAssetsQuery): SqlStatement {
  const whereClause = buildListAssetsWhereClause(query);

  return `
    SELECT COUNT(*)::text AS total FROM assets ${whereClause.text}
  `
    ? {
        text: `SELECT COUNT(*)::text AS total FROM assets ${whereClause.text}`,
        parameters: whereClause.parameters
      }
    : {
        text: "SELECT COUNT(*)::text AS total FROM assets",
        parameters: whereClause.parameters
      };
}

function buildListAssetsSelectStatement(query: ListAssetsQuery): SqlStatement {
  const whereClause = buildListAssetsWhereClause(query);
  const offset = (query.page - 1) * query.limit;
  const parameters = [...whereClause.parameters, query.limit, offset];
  const limitParameterIndex = parameters.length - 1;
  const offsetParameterIndex = parameters.length;

  return {
    text: `
      ${assetSelectClause}
      ${whereClause.text}
      ORDER BY name ASC, id ASC
      LIMIT $${limitParameterIndex}
      OFFSET $${offsetParameterIndex}
    `,
    parameters
  };
}

function addUpdateAssignment(
  assignments: string[],
  parameters: QueryParameter[],
  column: string,
  value: QueryParameter,
  cast?: "::date"
): void {
  parameters.push(value);
  assignments.push(`${column} = $${parameters.length}${cast ?? ""}`);
}

function addLocationUpdateAssignment(
  assignments: string[],
  parameters: QueryParameter[],
  input: UpdateAssetInput
): void {
  if (input.lng === undefined && input.lat === undefined) {
    return;
  }

  parameters.push(input.lng ?? null);
  const lngIndex = parameters.length;
  parameters.push(input.lat ?? null);
  const latIndex = parameters.length;
  assignments.push(`
    location = ST_SetSRID(
      ST_MakePoint(
        COALESCE($${lngIndex}, ST_X(location)),
        COALESCE($${latIndex}, ST_Y(location))
      ),
      4326
    )
  `);
}

function buildUpdateAssetStatement(
  assetId: string,
  input: UpdateAssetInput
): SqlStatement {
  const parameters: QueryParameter[] = [assetId];
  const assignments: string[] = [];

  if (input.name !== undefined) {
    addUpdateAssignment(assignments, parameters, "name", input.name);
  }

  if (input.type !== undefined) {
    addUpdateAssignment(assignments, parameters, "type", input.type);
  }

  if (input.status !== undefined) {
    addUpdateAssignment(assignments, parameters, "status", input.status);
  }

  if (input.installed_at !== undefined) {
    addUpdateAssignment(
      assignments,
      parameters,
      "installed_at",
      input.installed_at,
      "::date"
    );
  }

  if (input.last_inspected_at !== undefined) {
    addUpdateAssignment(
      assignments,
      parameters,
      "last_inspected_at",
      input.last_inspected_at,
      "::date"
    );
  }

  if (input.notes !== undefined) {
    addUpdateAssignment(assignments, parameters, "notes", input.notes);
  }

  addLocationUpdateAssignment(assignments, parameters, input);

  return {
    text: `
      UPDATE assets
      SET ${assignments.join(", ")}
      WHERE id = $1
      RETURNING
        id,
        name,
        type,
        status,
        ST_Y(location)::float8 AS lat,
        ST_X(location)::float8 AS lng,
        installed_at::text AS installed_at,
        last_inspected_at::text AS last_inspected_at,
        notes
    `,
    parameters
  };
}

function isDatabaseErrorCode(
  error: unknown,
  code: string
): error is { code: string; detail?: string } {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
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
  const totalStatement = buildListAssetsCountStatement(query);
  const listStatement = buildListAssetsSelectStatement(query);

  const totalResult = await database.query<{ total: string }>(
    totalStatement.text,
    totalStatement.parameters
  );

  const total = Number(totalResult.rows[0]?.total ?? "0");
  const totalPages = total === 0 ? 0 : Math.ceil(total / query.limit);

  const assetsResult = await database.query<AssetRow>(
    listStatement.text,
    listStatement.parameters
  );

  return {
    items: assetsResult.rows.map(mapAssetRow),
    total,
    page: query.page,
    limit: query.limit,
    totalPages
  };
}

export async function createAsset(assetId: string, input: CreateAssetInput): Promise<Asset> {
  try {
    const result = await database.query<AssetRow>(
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
        RETURNING
          id,
          name,
          type,
          status,
          ST_Y(location)::float8 AS lat,
          ST_X(location)::float8 AS lng,
          installed_at::text AS installed_at,
          last_inspected_at::text AS last_inspected_at,
          notes
      `,
      [
        assetId,
        input.name,
        input.type,
        input.status,
        input.installed_at,
        input.last_inspected_at,
        input.notes,
        input.lng,
        input.lat
      ]
    );

    return mapAssetRow(result.rows[0]);
  } catch (error: unknown) {
    if (isDatabaseErrorCode(error, "23505")) {
      throw new AppError({
        statusCode: 409,
        code: "ASSET_CONFLICT",
        message: "An asset with the same identifier already exists."
      });
    }

    throw error;
  }
}

export async function updateAsset(assetId: string, input: UpdateAssetInput): Promise<Asset | null> {
  const statement = buildUpdateAssetStatement(assetId, input);

  const result = await database.query<AssetRow>(
    statement.text,
    statement.parameters
  );

  const updatedRow = result.rows[0];
  return updatedRow ? mapAssetRow(updatedRow) : null;
}

export async function deleteAsset(assetId: string): Promise<boolean> {
  const result = await database.query("DELETE FROM assets WHERE id = $1", [assetId]);

  return result.rowCount === 1;
}

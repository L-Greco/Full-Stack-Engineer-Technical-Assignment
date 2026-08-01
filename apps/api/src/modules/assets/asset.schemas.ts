import * as yup from "yup";

import type { ListAssetsQuery, ListAssetsQueryInput } from "./asset.types.js";
import { assetStatuses, assetTypes } from "./asset.types.js";

function isIsoDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function toOptionalFiniteNumber(
  _value: unknown,
  originalValue: unknown
): number | undefined {
  if (originalValue === undefined || originalValue === null || originalValue === "") {
    return undefined;
  }

  if (Array.isArray(originalValue)) {
    return Number.NaN;
  }

  const parsedValue =
    typeof originalValue === "number" ? originalValue : Number(originalValue);

  return Number.isFinite(parsedValue) ? parsedValue : Number.NaN;
}

function toOptionalString(
  _value: unknown,
  originalValue: unknown
): string | undefined {
  if (originalValue === undefined || originalValue === null || originalValue === "") {
    return undefined;
  }

  if (Array.isArray(originalValue) || typeof originalValue !== "string") {
    return "";
  }

  return originalValue;
}

const requiredIsoDateString = yup
  .string()
  .required()
  .test("iso-date", "Must be a valid ISO date string.", (value) =>
    value !== undefined ? isIsoDateString(value) : false
  );

const optionalIsoDateString = yup
  .string()
  .nullable()
  .defined()
  .test("iso-date", "Must be a valid ISO date string.", (value) =>
    value === null || value === undefined ? true : isIsoDateString(value)
  );

const optionalNumberSchema = yup
  .number()
  .transform(toOptionalFiniteNumber)
  .optional()
  .typeError("Must be a valid number.");

export const assetSeedSchema = yup
  .object({
    id: yup.string().uuid().required(),
    name: yup.string().trim().required().min(1),
    type: yup.mixed<(typeof assetTypes)[number]>().oneOf(assetTypes).required(),
    status: yup
      .mixed<(typeof assetStatuses)[number]>()
      .oneOf(assetStatuses)
      .required(),
    lat: yup.number().required().min(-90).max(90),
    lng: yup.number().required().min(-180).max(180),
    installed_at: requiredIsoDateString,
    last_inspected_at: optionalIsoDateString,
    notes: yup.string().defined()
  })
  .required();

export const assetSeedListSchema = yup.array(assetSeedSchema).required();

export const listAssetsQuerySchema: yup.ObjectSchema<ListAssetsQueryInput> = yup
  .object({
    page: yup
      .number()
      .transform((_value, originalValue) => {
        if (originalValue === undefined || originalValue === null || originalValue === "") {
          return undefined;
        }

        return toOptionalFiniteNumber(undefined, originalValue);
      })
      .default(1)
      .integer()
      .min(1),
    limit: yup
      .number()
      .transform((_value, originalValue) => {
        if (originalValue === undefined || originalValue === null || originalValue === "") {
          return undefined;
        }

        return toOptionalFiniteNumber(undefined, originalValue);
      })
      .default(25)
      .integer()
      .min(1)
      .max(100),
    type: yup.string().transform(toOptionalString).optional().oneOf(assetTypes),
    status: yup
      .string()
      .transform(toOptionalString)
      .optional()
      .oneOf(assetStatuses),
    minLat: optionalNumberSchema,
    maxLat: optionalNumberSchema,
    minLng: optionalNumberSchema,
    maxLng: optionalNumberSchema
  })
  .test("bounding-box-complete", function validateBoundingBoxCompleteness(value) {
    if (!value) {
      return true;
    }

    const bounds = [value.minLat, value.maxLat, value.minLng, value.maxLng];
    const providedBoundsCount = bounds.filter((bound) => bound !== undefined).length;

    if (providedBoundsCount > 0 && providedBoundsCount < 4) {
      return this.createError({
        path: "minLat",
        message:
          "Bounding box filters require minLat, maxLat, minLng, and maxLng together."
      });
    }

    return true;
  })
  .test("bounding-box-lat-order", function validateLatitudeBounds(value) {
    if (!value) {
      return true;
    }

    if (
      value.minLat !== undefined &&
      value.maxLat !== undefined &&
      value.minLat >= value.maxLat
    ) {
      return this.createError({
        path: "minLat",
        message: "minLat must be less than maxLat."
      });
    }

    return true;
  })
  .test("bounding-box-lng-order", function validateLongitudeBounds(value) {
    if (!value) {
      return true;
    }

    if (
      value.minLng !== undefined &&
      value.maxLng !== undefined &&
      value.minLng >= value.maxLng
    ) {
      return this.createError({
        path: "minLng",
        message: "minLng must be less than maxLng."
      });
    }

    return true;
  })
  .required();

export function toListAssetsQuery(value: ListAssetsQueryInput): ListAssetsQuery {
  const query: ListAssetsQuery = {
    page: value.page,
    limit: value.limit
  };

  if (value.type !== undefined) {
    query.type = value.type;
  }

  if (value.status !== undefined) {
    query.status = value.status;
  }

  if (
    value.minLat !== undefined &&
    value.maxLat !== undefined &&
    value.minLng !== undefined &&
    value.maxLng !== undefined
  ) {
    query.boundingBox = {
      minLat: value.minLat,
      maxLat: value.maxLat,
      minLng: value.minLng,
      maxLng: value.maxLng
    };
  }

  return query;
}

import * as yup from "yup";

import type {
  AssetRouteParams,
  CreateAssetInput,
  ListAssetsQuery,
  ListAssetsQueryInput,
  UpdateAssetInput
} from "./asset.types.js";
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

const optionalPatchIsoDateString = yup
  .string()
  .transform(toOptionalString)
  .optional()
  .test("iso-date", "Must be a valid ISO date string.", (value) =>
    value === undefined ? true : isIsoDateString(value)
  );

const optionalPatchNullableIsoDateString = yup
  .string()
  .nullable()
  .transform((_value, originalValue) => {
    if (originalValue === undefined || originalValue === "") {
      return undefined;
    }

    if (originalValue === null) {
      return null;
    }

    if (typeof originalValue === "string") {
      return `${originalValue}`;
    }

    return "";
  })
  .optional()
  .test("iso-date", "Must be a valid ISO date string.", (value) =>
    value === undefined || value === null ? true : isIsoDateString(value)
  );

const optionalNumberSchema = yup
  .number()
  .transform(toOptionalFiniteNumber)
  .optional()
  .typeError("Must be a valid number.");

const assetIdParamsSchema: yup.ObjectSchema<AssetRouteParams> = yup
  .object({
    assetId: yup.string().uuid().required()
  })
  .required();

const nameSchema = yup.string().trim().required().min(1);
const optionalNameSchema = yup.string().trim().optional().min(1);
const assetTypeSchema = yup.mixed<(typeof assetTypes)[number]>().oneOf(assetTypes).required();
const optionalAssetTypeSchema = yup
  .string()
  .optional()
  .oneOf(assetTypes);
const assetStatusSchema = yup
  .mixed<(typeof assetStatuses)[number]>()
  .oneOf(assetStatuses)
  .required();
const optionalAssetStatusSchema = yup
  .string()
  .optional()
  .oneOf(assetStatuses);
const latitudeSchema = yup.number().required().min(-90).max(90);
const longitudeSchema = yup.number().required().min(-180).max(180);
const optionalLatitudeSchema = yup.number().optional().min(-90).max(90);
const optionalLongitudeSchema = yup.number().optional().min(-180).max(180);

export const assetSeedSchema = yup
  .object({
    id: yup.string().uuid().required(),
    name: nameSchema,
    type: assetTypeSchema,
    status: assetStatusSchema,
    lat: latitudeSchema,
    lng: longitudeSchema,
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

export const createAssetBodySchema: yup.ObjectSchema<CreateAssetInput> = yup
  .object({
    name: nameSchema,
    type: assetTypeSchema,
    status: assetStatusSchema,
    lat: latitudeSchema,
    lng: longitudeSchema,
    installed_at: requiredIsoDateString,
    last_inspected_at: optionalIsoDateString,
    notes: yup.string().defined()
  })
  .required();

export const updateAssetBodySchema: yup.ObjectSchema<UpdateAssetInput> = yup
  .object({
    name: optionalNameSchema,
    type: optionalAssetTypeSchema,
    status: optionalAssetStatusSchema,
    lat: optionalLatitudeSchema,
    lng: optionalLongitudeSchema,
    installed_at: optionalPatchIsoDateString,
    last_inspected_at: optionalPatchNullableIsoDateString,
    notes: yup.string().optional()
  })
  .test("non-empty-update", "At least one field must be provided.", (value) => {
    if (!value) {
      return false;
    }

    return Object.values(value).some((fieldValue) => fieldValue !== undefined);
  })
  .required();

export { assetIdParamsSchema };

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

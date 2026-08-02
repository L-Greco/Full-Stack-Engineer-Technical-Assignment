import * as yup from "yup";

import type { Asset, AssetFormValues, AssetWriteInput } from "../types/assets";
import { assetStatuses, assetTypes } from "../types/assets";

export const ASSET_FORM_SCHEMA: yup.ObjectSchema<AssetFormValues> = yup
  .object({
    name: yup.string().trim().required("Name is required."),
    type: yup.mixed<(typeof assetTypes)[number]>().oneOf(assetTypes).required(),
    status: yup.mixed<(typeof assetStatuses)[number]>().oneOf(assetStatuses).required(),
    lat: yup.number().required("Latitude is required.").min(-90).max(90),
    lng: yup.number().required("Longitude is required.").min(-180).max(180),
    installed_at: yup
      .string()
      .required("Installed date is required.")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD."),
    last_inspected_at: yup
      .string()
      .defined()
      .test("iso-date", "Use YYYY-MM-DD.", (value) =>
        value === "" ? true : /^\d{4}-\d{2}-\d{2}$/.test(value)
      ),
    notes: yup.string().defined()
  })
  .required();

const DEFAULT_DATE = new Date().toISOString().slice(0, 10);

const DEFAULT_FORM_VALUES: AssetFormValues = {
  name: "",
  type: "pipe",
  status: "ok",
  lat: 37.9838,
  lng: 23.7275,
  installed_at: DEFAULT_DATE,
  last_inspected_at: "",
  notes: ""
};

export function toAssetFormValues(asset: Asset | null): AssetFormValues {
  if (asset === null) {
    return DEFAULT_FORM_VALUES;
  }

  return {
    name: asset.name,
    type: asset.type,
    status: asset.status,
    lat: asset.lat,
    lng: asset.lng,
    installed_at: asset.installed_at,
    last_inspected_at: asset.last_inspected_at ?? "",
    notes: asset.notes
  };
}

export function toAssetWriteInput(values: AssetFormValues): AssetWriteInput {
  return {
    name: values.name.trim(),
    type: values.type,
    status: values.status,
    lat: values.lat,
    lng: values.lng,
    installed_at: values.installed_at,
    last_inspected_at: values.last_inspected_at.trim() || null,
    notes: values.notes.trim()
  };
}

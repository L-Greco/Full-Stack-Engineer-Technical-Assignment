import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { ChevronDownIcon } from "./ChevronDownIcon";
import FormErrorMessage from "./FormErrorMessage";

import { assetStatuses, assetTypes } from "../types/assets";
import type { AssetFormValues } from "../types/assets";

interface ComponentProps {
  errors: FieldErrors<AssetFormValues>;
  isEditing: boolean;
  isPickingLocation: boolean;
  isSubmitting: boolean;
  mutationError: string | null;
  onCancel: () => void;
  onTogglePickingLocation: () => void;
  register: UseFormRegister<AssetFormValues>;
}

export function AssetFormFields({
  errors,
  isEditing,
  isPickingLocation,
  isSubmitting,
  mutationError,
  onCancel,
  onTogglePickingLocation,
  register
}: ComponentProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-teal-700">
            Asset form
          </p>
          <h2 className="m-0 text-[clamp(1.7rem,2.5vw,2.4rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-slate-900">
            {isEditing ? "Edit asset" : "Create asset"}
          </h2>
        </div>
        <button
          className={`cursor-pointer rounded-2xl px-4 py-3 text-sm font-medium transition ${
            isPickingLocation
              ? "bg-teal-700 text-white hover:bg-teal-800"
              : "bg-slate-200 text-slate-900 hover:bg-slate-300"
          }`}
          onClick={onTogglePickingLocation}
          type="button"
        >
          {isPickingLocation ? "Picking on map" : "Pick on map"}
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600" htmlFor="asset-name">
            Name
          </label>
          <input className="selectField w-full px-3.5 py-3" id="asset-name" {...register("name")} />
          <FormErrorMessage message={errors.name?.message} />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600" htmlFor="asset-type">
              Type
            </label>
            <div className="relative">
              <select className="selectField w-full px-3.5 py-3 pr-11" id="asset-type" {...register("type")}>
                {assetTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600" htmlFor="asset-status">
              Status
            </label>
            <div className="relative">
              <select className="selectField w-full px-3.5 py-3 pr-11" id="asset-status" {...register("status")}>
                {assetStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600" htmlFor="asset-lat">
              Latitude
            </label>
            <input
              className="selectField w-full px-3.5 py-3"
              id="asset-lat"
              step="any"
              type="number"
              {...register("lat", { valueAsNumber: true })}
            />
            <FormErrorMessage message={errors.lat?.message} />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600" htmlFor="asset-lng">
              Longitude
            </label>
            <input
              className="selectField w-full px-3.5 py-3"
              id="asset-lng"
              step="any"
              type="number"
              {...register("lng", { valueAsNumber: true })}
            />
            <FormErrorMessage message={errors.lng?.message} />
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/90 px-4 py-3 text-sm text-slate-600">
          Click <span className="font-semibold text-slate-900">Pick on map</span> and choose a location directly on the map to fill the coordinates.
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600" htmlFor="asset-installed-at">
              Installed at
            </label>
            <input className="selectField w-full px-3.5 py-3" id="asset-installed-at" type="date" {...register("installed_at")} />
            <FormErrorMessage message={errors.installed_at?.message} />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600" htmlFor="asset-last-inspected-at">
              Last inspected at
            </label>
            <input className="selectField w-full px-3.5 py-3" id="asset-last-inspected-at" type="date" {...register("last_inspected_at")} />
            <FormErrorMessage message={errors.last_inspected_at?.message} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600" htmlFor="asset-notes">
            Notes
          </label>
          <textarea className="selectField min-h-28 w-full resize-y px-3.5 py-3" id="asset-notes" {...register("notes")} />
        </div>

        {mutationError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {mutationError}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="cursor-pointer rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create asset"}
          </button>
          <button
            className="cursor-pointer rounded-2xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

import { assetStatuses, assetTypes } from "../types/assets";

import { ChevronDownIcon } from "./ChevronDownIcon";

import type { AssetStatus, AssetType } from "../types/assets";

interface ComponentProps {
  selectedStatus: AssetStatus | "all";
  selectedType: AssetType | "all";
  onReset: () => void;
  onStatusChange: (status: AssetStatus | "all") => void;
  onTypeChange: (type: AssetType | "all") => void;
}

export function AssetFilters({
  selectedStatus,
  selectedType,
  onReset,
  onStatusChange,
  onTypeChange
}: ComponentProps) {
  return (
    <section className="rounded-3xl border border-slate-900/8 bg-white/92 p-5 mainShadow">
      <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="mb-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-teal-700">
            Filters
          </p>
          <h2 className="m-0 text-[clamp(2rem,3vw,3.6rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-slate-900">
            Refine the asset list
          </h2>
        </div>
        <button
          className="cursor-pointer rounded-2xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
          onClick={onReset}
          type="button"
        >
          Clear
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm font-semibold text-slate-600">Type</span>
          <div className="relative">
            <select
              className="selectField w-full px-3.5 py-3 pr-11"
              value={selectedType}
              onChange={(event) =>
                onTypeChange(event.target.value as AssetType | "all")
              }
            >
              <option value="all">All asset types</option>
              {assetTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500"
            >
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm font-semibold text-slate-600">Status</span>
          <div className="relative">
            <select
              className="selectField w-full px-3.5 py-3 pr-11"
              value={selectedStatus}
              onChange={(event) =>
                onStatusChange(event.target.value as AssetStatus | "all")
              }
            >
              <option value="all">All statuses</option>
              {assetStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500"
            >
              <ChevronDownIcon />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

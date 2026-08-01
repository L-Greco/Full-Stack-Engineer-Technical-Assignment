import { useState } from "react";

import { AssetFilters } from "./components/AssetFilters";
import { AssetList } from "./components/AssetList/AssetList";
import { AssetSummary } from "./components/AssetSummary";
import ErrorMessage from "./components/AssetList/ErrorMessage";

import { useAssetListQuery } from "./lib/hooks/useAssetListQuery";

import type { AssetStatus, AssetType, ListAssetsParams } from "./types/assets";

const DEFAULT_FILTERS: ListAssetsParams = {
  page: 1,
  limit: 25
};

export default function App() {
  const [filters, setFilters] = useState<ListAssetsParams>(DEFAULT_FILTERS);
  const { data, error, isLoading, refetch } = useAssetListQuery(filters);

  const assets = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const errorMessage = error instanceof Error ? error.message : null;

  function handleTypeChange(type: AssetType | "all") {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page: 1,
      type: type === "all" ? undefined : type
    }));
  }

  function handleStatusChange(status: AssetStatus | "all") {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page: 1,
      status: status === "all" ? undefined : status
    }));
  }

  function handleResetFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  function handleRetry() {
    void refetch();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(71,125,255,0.18),transparent_28%),linear-gradient(180deg,#f4f7fb_0%,#e7edf5_100%)] px-4 py-5 text-slate-900 sm:px-8 sm:py-8">
      <section className="mx-auto max-w-7xl rounded-[28px] border border-slate-900/8 bg-white/92 p-6 mainShadow sm:p-8">
        <p className="mb-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-teal-700">
          Asset Operations
        </p>
        <h1 className="m-0 text-[clamp(2rem,3vw,3.6rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-slate-900">
          Asset tracker
        </h1>
        <p className="mt-4 max-w-170 text-[1.05rem] leading-7 text-slate-600">
          Start with the operational overview: filter by asset type and status, scan recent
          inspections, and prepare the map workflow for the next step.
        </p>
      </section>

      <section className="mx-auto mt-5 max-w-7xl rounded-[28px] border border-slate-900/8 bg-white/92 p-4 mainShadow sm:p-6">
        <AssetFilters
          selectedStatus={filters.status ?? "all"}
          selectedType={filters.type ?? "all"}
          onReset={handleResetFilters}
          onStatusChange={handleStatusChange}
          onTypeChange={handleTypeChange}
        />

        <AssetSummary assetCount={assets.length} isLoading={isLoading} total={total} />

        {errorMessage ? (
          <ErrorMessage errorMessage={errorMessage} onRetry={handleRetry} />
        ) : (
          <AssetList assets={assets} isLoading={isLoading} />
        )}
      </section>
    </main>
  );
}

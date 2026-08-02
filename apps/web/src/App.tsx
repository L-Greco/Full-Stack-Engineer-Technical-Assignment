import { AssetDetailPanel } from "./components/AssetDetailPanel";
import { AssetFilters } from "./components/AssetFilters";
import { AssetFormPanel } from "./components/AssetFormPanel";
import { AssetList } from "./components/AssetList/AssetList";
import { AssetSummary } from "./components/AssetSummary";
import ErrorMessage from "./components/AssetList/ErrorMessage";
import { AssetMap } from "./components/AssetMap";

import { useAssetOverview } from "./lib/hooks/useAssetOverview";

export default function App() {
  const {
    assets,
    currentPage,
    errorMessage,
    filters,
    handlePageChange,
    handleResetFilters,
    handleRetry,
    handleStatusChange,
    handleTypeChange,
    isEditing,
    isLoading,
    panelMode,
    selectedAsset,
    total,
    totalPages
  } = useAssetOverview();

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
          <section className="mt-5 flex flex-col-reverse gap-5 xl:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <AssetMap assets={assets} />
              <AssetList
                assets={assets}
                currentPage={currentPage}
                isLoading={isLoading}
                onPageChange={handlePageChange}
                totalPages={totalPages}
              />
            </div>

            <div className="w-full xl:max-w-sm xl:flex-none">
              {panelMode === "view" ? (
                <AssetDetailPanel asset={selectedAsset} />
              ) : (
                <AssetFormPanel asset={isEditing ? selectedAsset : null} isEditing={isEditing} />
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

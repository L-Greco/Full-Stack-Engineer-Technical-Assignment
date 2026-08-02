import { formatDate } from "../../lib/utils";
import { selectSelectedAssetId, selectSelectAsset, useAssetUiStore } from "../../lib/stores/useAssetUiStore";

import { StatusBadge } from "../StatusBadge";
import AssetPagination from "./AssetPagination";
import LoadingAssets from "./LoadingAssets";
import ZeroAssets from "./ZeroAssets";

import type { Asset } from "../../types/assets";

interface ComponentProps {
  assets: Asset[];
  currentPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export function AssetList({
  assets,
  currentPage,
  isLoading,
  onPageChange,
  totalPages
}: ComponentProps) {
  const selectedAssetId = useAssetUiStore(selectSelectedAssetId);
  const selectAsset = useAssetUiStore(selectSelectAsset);

  function handleSelectAsset(assetId: string) {
    selectAsset(assetId);

    const assetMap = document.getElementById(`asset-map`);
    if (assetMap) {
      assetMap.scrollIntoView({ behavior: "smooth" });
    }
  }

  if (isLoading) {
    return <LoadingAssets />;
  }

  if (assets.length === 0) {
    return <ZeroAssets />;
  }

  return (
    <section className="mt-5 rounded-3xl border border-slate-900/8 bg-white/92 p-5 mainShadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-teal-700">
            List view
          </p>
          <h2 className="m-0 text-[clamp(2rem,3vw,3.6rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-slate-900">
            Assets
          </h2>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4" role="list">
        {assets.map((asset) => (
          <article
            className={`rounded-3xl border bg-white/92 p-5 mainShadow transition ${
              asset.id === selectedAssetId
                ? "border-slate-900/24 ring-2 ring-slate-900/12"
                : "border-slate-900/8"
            }`}
            key={asset.id}
            role="listitem"
          >
            <button
              className="w-full cursor-pointer text-left"
              onClick={() => handleSelectAsset(asset.id)}
              type="button"
            >
              <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h3 className="m-0 text-xl font-semibold text-slate-900">
                    {asset.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600">
                    {asset.type} · Installed {formatDate(asset.installed_at)}
                  </p>
                </div>
                <StatusBadge status={asset.status} />
              </div>

              <dl className="mt-4.5 flex flex-col gap-3.5 md:flex-row md:flex-wrap">
                <div className="flex-1 basis-50">
                  <dt className="text-[0.84rem] font-bold uppercase tracking-[0.08em] text-slate-600">
                    Coordinates
                  </dt>
                  <dd className="mt-1.5 text-[0.96rem] text-slate-600">
                    {asset.lat.toFixed(4)}, {asset.lng.toFixed(4)}
                  </dd>
                </div>
                <div className="flex-1 basis-50">
                  <dt className="text-[0.84rem] font-bold uppercase tracking-[0.08em] text-slate-600">
                    Last inspection
                  </dt>
                  <dd className="mt-1.5 text-[0.96rem] text-slate-600">
                    {formatDate(asset.last_inspected_at)}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 leading-6 text-slate-600">
                {asset.notes.trim().length > 0 ? asset.notes : "No notes recorded."}
              </p>
            </button>
          </article>
        ))}
      </div>

      <AssetPagination
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />
    </section>
  );
}

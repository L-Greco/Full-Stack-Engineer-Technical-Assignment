import {
  selectOpenCreatePanel,
  selectOpenEditPanel,
  useAssetUiStore
} from "../lib/stores/useAssetUiStore";
import { formatDate } from "../lib/utils";

import { StatusBadge } from "./StatusBadge";
import NullAsset from "./NullAsset";

import type { Asset } from "../types/assets";

interface ComponentProps {
  asset: Asset | null;
}

export function AssetDetailPanel({ asset }: ComponentProps) {
  const openCreatePanel = useAssetUiStore(selectOpenCreatePanel);
  const openEditPanel = useAssetUiStore(selectOpenEditPanel);

  function handleEditAsset() {
    if (!asset) return;
    openEditPanel(asset.id);
  }

  if (asset === null) {
    return <NullAsset />;
  }

  return (
    <section className="rounded-3xl border border-slate-900/8 bg-white/92 p-5 mainShadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-teal-700">
            Asset detail
          </p>
          <h2 className="m-0 text-[clamp(1.7rem,2.5vw,2.4rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-slate-900">
            {asset.name}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-3">
          <StatusBadge status={asset.status} />
          <div className="flex gap-2">
            <button
              className="cursor-pointer rounded-2xl bg-slate-200 px-3.5 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
              onClick={openCreatePanel}
              type="button"
            >
              New
            </button>
            <button
              className="cursor-pointer rounded-2xl bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              onClick={handleEditAsset}
              type="button"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <dl className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <dt className="text-[0.84rem] font-bold uppercase tracking-[0.08em] text-slate-600">
            Type
          </dt>
          <dd className="text-base text-slate-900">{asset.type}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[0.84rem] font-bold uppercase tracking-[0.08em] text-slate-600">
            Coordinates
          </dt>
          <dd className="text-base text-slate-900">
            {asset.lat.toFixed(4)}, {asset.lng.toFixed(4)}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[0.84rem] font-bold uppercase tracking-[0.08em] text-slate-600">
            Installed
          </dt>
          <dd className="text-base text-slate-900">{formatDate(asset.installed_at)}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-[0.84rem] font-bold uppercase tracking-[0.08em] text-slate-600">
            Last inspection
          </dt>
          <dd className="text-base text-slate-900">
            {formatDate(asset.last_inspected_at)}
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <p className="text-[0.84rem] font-bold uppercase tracking-[0.08em] text-slate-600">
          Notes
        </p>
        <p className="mt-1.5 leading-6 text-slate-600">
          {asset.notes.trim().length > 0 ? asset.notes : "No notes recorded."}
        </p>
      </div>
    </section>
  );
}

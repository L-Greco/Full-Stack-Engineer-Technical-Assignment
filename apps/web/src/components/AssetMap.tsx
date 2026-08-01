import {
  CircleMarker,
  MapContainer,
  TileLayer,
} from "react-leaflet";

import AssetMapViewport from "./AssetList/AssetMapViewPort";

import { DEFAULT_CENTER, DEFAULT_ZOOM } from "../lib/conts";

import type { Asset } from "../types/assets";


const STATUS_COLORS= {
  ok: "#10b981",
  warning: "#f59e0b",
  critical: "#f43f5e"
};

interface ComponentProps {
  assets: Asset[];
  selectedAssetId: string | null;
  onSelectAsset: (assetId: string) => void;
}

export function AssetMap({
  assets,
  selectedAssetId,
  onSelectAsset
}: ComponentProps) {
  return (
    <section id='asset-map' className="rounded-3xl border border-slate-900/8 bg-white/92 p-5 mainShadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-teal-700">
            Map view
          </p>
          <h2 className="m-0 text-[clamp(1.7rem,2.5vw,2.4rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-slate-900">
            Asset locations
          </h2>
        </div>
      </div>

      <div className="mt-5 h-105 overflow-hidden rounded-3xl border border-slate-900/8">
        <MapContainer
          center={DEFAULT_CENTER}
          className="h-full w-full"
          scrollWheelZoom
          zoom={DEFAULT_ZOOM}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AssetMapViewport assets={assets} selectedAssetId={selectedAssetId} />

          {assets.map((asset) => {
            const isSelected = asset.id === selectedAssetId;

            return (
              <CircleMarker
                center={[asset.lat, asset.lng]}
                eventHandlers={{
                  click: () => onSelectAsset(asset.id)
                }}
                fillColor={STATUS_COLORS[asset.status]}
                fillOpacity={0.9}
                key={asset.id}
                pathOptions={{
                  color: isSelected ? "#0f172a" : "#ffffff",
                  weight: isSelected ? 3 : 2
                }}
                radius={isSelected ? 10 : 8}
              />
            );
          })}
        </MapContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div className="inline-flex items-center gap-2 text-sm text-slate-600" key={status}>
            <div
              className="inline-flex h-3 w-3 rounded-full border border-white"
              style={{ backgroundColor: color }}
            />
            <span className="capitalize">{status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

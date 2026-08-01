import { useMap } from "react-leaflet";
import { useEffect } from "react";

import { DEFAULT_CENTER, DEFAULT_ZOOM } from "../../lib/conts";

import type { Asset } from "../../types/assets";

interface AssetMapViewportProps {
  assets: Asset[];
  selectedAssetId: string | null;
}

export default function AssetMapViewport({ assets, selectedAssetId }: AssetMapViewportProps) {
  const map = useMap();

  useEffect(() => {
    if (assets.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }

    if (selectedAssetId !== null) {
      const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);

      if (selectedAsset) {
        map.flyTo([selectedAsset.lat, selectedAsset.lng], Math.max(map.getZoom(), 14), {
          duration: 0.4
        });
        return;
      }
    }

    const bounds = assets.map((asset) => [asset.lat, asset.lng] as [number, number]);
    map.fitBounds(bounds, {
      padding: [32, 32]
    });
  }, [assets, map, selectedAssetId]);

  return null;
}
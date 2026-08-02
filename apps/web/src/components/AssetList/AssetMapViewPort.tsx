import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

import {
    selectIsPickingLocation,
    selectSetDraftLocation,
    useAssetUiStore
} from "../../lib/stores/useAssetUiStore";

import { DEFAULT_CENTER, DEFAULT_ZOOM } from "../../lib/conts";

import type { Asset } from "../../types/assets";

const FOCUS_ANIMATION_DURATION = 0.8;
const MINIMUM_ZOOM_LEVEL = 5;
const MAP_VIEWPORT_FIT_BOUNDS_PADDING: [number, number] = [32, 32];

interface ComponentProps {
  assets: Asset[];
  selectedAssetId: string | null;
}

export default function AssetMapViewport({ assets, selectedAssetId }: ComponentProps) {
  const isPickingLocation = useAssetUiStore(selectIsPickingLocation);
  const setDraftLocation = useAssetUiStore(selectSetDraftLocation);

  const map = useMapEvents({
    click(event) {
      if (!isPickingLocation) {
        return;
      }

      setDraftLocation({
        lat: event.latlng.lat,
        lng: event.latlng.lng
      });
    }
  });

  useEffect(() => {
    if (assets.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }

    if (selectedAssetId !== null) {
      const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);

      if (selectedAsset) {
        map.flyTo(
          [selectedAsset.lat, selectedAsset.lng],
          Math.max(map.getZoom(), MINIMUM_ZOOM_LEVEL),
          {
            duration: FOCUS_ANIMATION_DURATION
          }
        );
        return;
      }
    }

    const bounds = assets.map((asset) => [asset.lat, asset.lng] as [number, number]);
    map.fitBounds(bounds, {
      padding: MAP_VIEWPORT_FIT_BOUNDS_PADDING
    });
  }, [assets, map, selectedAssetId]);

  return null;
}

export const assetTypes = ["pipe", "hydrant", "sensor", "valve"] as const;
export const assetStatuses = ["ok", "warning", "critical"] as const;

export type AssetType = (typeof assetTypes)[number];
export type AssetStatus = (typeof assetStatuses)[number];

export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  lat: number;
  lng: number;
  installed_at: string;
  last_inspected_at: string | null;
  notes: string;
};

export type BoundingBox = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

export type ListAssetsQuery = {
  page: number;
  limit: number;
  type?: AssetType;
  status?: AssetStatus;
  boundingBox?: BoundingBox;
};

export type ListAssetsQueryInput = {
  page: number;
  limit: number;
  type?: AssetType;
  status?: AssetStatus;
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
};

export type AssetRouteParams = {
  assetId: string;
};

export type CreateAssetInput = {
  name: string;
  type: AssetType;
  status: AssetStatus;
  lat: number;
  lng: number;
  installed_at: string;
  last_inspected_at: string | null;
  notes: string;
};

export type UpdateAssetInput = {
  name?: string;
  type?: AssetType;
  status?: AssetStatus;
  lat?: number;
  lng?: number;
  installed_at?: string;
  last_inspected_at?: string | null;
  notes?: string;
};

export type AssetListResult = {
  items: Asset[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

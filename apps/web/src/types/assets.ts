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

export type ListAssetsParams = {
  limit: number;
  page: number;
  status?: AssetStatus;
  type?: AssetType;
};

export type AssetListResponse = {
  data: Asset[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
};

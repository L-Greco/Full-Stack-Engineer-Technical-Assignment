import { useMemo, useState } from "react";

import { getActiveSelectedAssetId, getSelectedAsset } from "../asset-selection";
import {
  selectPanelMode,
  selectSelectedAssetId,
  useAssetUiStore
} from "../stores/useAssetUiStore";
import { useAssetListQuery } from "./useAssetListQuery";

import type { Asset, AssetStatus, AssetType, ListAssetsParams } from "../../types/assets";

const DEFAULT_FILTERS: ListAssetsParams = {
  page: 1,
  limit: 25
};

const EMPTY_ASSETS: Asset[] = [];

interface UseAssetOverviewResult {
  assets: Asset[];
  currentPage: number;
  errorMessage: string | null;
  filters: ListAssetsParams;
  handlePageChange: (page: number) => void;
  handleResetFilters: () => void;
  handleRetry: () => void;
  handleStatusChange: (status: AssetStatus | "all") => void;
  handleTypeChange: (type: AssetType | "all") => void;
  isEditing: boolean;
  isLoading: boolean;
  panelMode: "view" | "create" | "edit";
  selectedAsset: Asset | null;
  total: number;
  totalPages: number;
}

export function useAssetOverview(): UseAssetOverviewResult {
  const [filters, setFilters] = useState<ListAssetsParams>(DEFAULT_FILTERS);
  const { data, error, isLoading, refetch } = useAssetListQuery(filters);
  const panelMode = useAssetUiStore(selectPanelMode);
  const selectedAssetId = useAssetUiStore(selectSelectedAssetId);

  const assets = data?.data ?? EMPTY_ASSETS;
  const currentPage = data?.meta.page ?? filters.page;
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 1;
  const errorMessage = error instanceof Error ? error.message : null;
  const isEditing = panelMode === "edit";

  const selectedAsset = useMemo(() => {
    const activeSelectedAssetId = getActiveSelectedAssetId(assets, selectedAssetId);

    return getSelectedAsset(activeSelectedAssetId, assets);
  }, [assets, selectedAssetId]);

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

  function handlePageChange(page: number) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page
    }));
  }

  return {
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
  };
}

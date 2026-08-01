import {
  keepPreviousData,
  useQuery
} from "@tanstack/react-query";

import { listAssets } from "../api/assets";

import type { ListAssetsParams } from "../../types/assets";

export function useAssetListQuery(filters: ListAssetsParams) {
  return useQuery({
    queryKey: ["assets", filters],
    queryFn: async () => listAssets(filters),
    placeholderData: keepPreviousData
  });
}

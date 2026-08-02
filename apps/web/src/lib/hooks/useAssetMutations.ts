import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAsset, updateAsset } from "../api/assets";

import type { AssetResponse, AssetWriteInput } from "../../types/assets";

interface UpdateAssetVariables {
  assetId: string;
  input: AssetWriteInput;
}

export function useCreateAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation<AssetResponse, Error, AssetWriteInput>({
    mutationFn: createAsset,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assets"] });
    }
  });
}

export function useUpdateAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation<AssetResponse, Error, UpdateAssetVariables>({
    mutationFn: ({ assetId, input }) => updateAsset(assetId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assets"] });
    }
  });
}

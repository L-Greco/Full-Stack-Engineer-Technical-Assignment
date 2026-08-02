import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ASSET_FORM_SCHEMA, toAssetFormValues, toAssetWriteInput } from "../asset-form";
import {
  selectClosePanel,
  selectDraftLocation,
  selectIsPickingLocation,
  selectSelectAsset,
  selectSetDraftLocation,
  selectSetPickingLocation,
  useAssetUiStore
} from "../stores/useAssetUiStore";
import { useCreateAssetMutation, useUpdateAssetMutation } from "./useAssetMutations";

import type { Asset, AssetFormValues } from "../../types/assets";

interface UseAssetFormPanelOptions {
  asset: Asset | null;
  isEditing: boolean;
}

interface UseAssetFormPanelResult {
  editNullAsset: boolean;
  errors: ReturnType<typeof useForm<AssetFormValues>>["formState"]["errors"];
  handleCancel: () => void;
  handleFormSubmit: (values: AssetFormValues) => Promise<void>;
  handleSubmit: ReturnType<typeof useForm<AssetFormValues>>["handleSubmit"];
  isPickingLocation: boolean;
  isSubmitting: boolean;
  mutationError: string | null;
  register: ReturnType<typeof useForm<AssetFormValues>>["register"];
  togglePickingLocation: () => void;
}

export function useAssetFormPanel({
  asset,
  isEditing
}: UseAssetFormPanelOptions): UseAssetFormPanelResult {
  const createAssetMutation = useCreateAssetMutation();
  const updateAssetMutation = useUpdateAssetMutation();
  const draftLocation = useAssetUiStore(selectDraftLocation);
  const isPickingLocation = useAssetUiStore(selectIsPickingLocation);
  const closePanel = useAssetUiStore(selectClosePanel);
  const selectAsset = useAssetUiStore(selectSelectAsset);
  const setDraftLocation = useAssetUiStore(selectSetDraftLocation);
  const setPickingLocation = useAssetUiStore(selectSetPickingLocation);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue
  } = useForm<AssetFormValues>({
    defaultValues: toAssetFormValues(asset),
    resolver: yupResolver(ASSET_FORM_SCHEMA)
  });

  const editNullAsset = isEditing && asset === null;
  const mutationError = (createAssetMutation.error ?? updateAssetMutation.error)?.message ?? null;

  function clearPanelState() {
    setDraftLocation(null);
    setPickingLocation(false);
    closePanel();
  }

  async function handleFormSubmit(values: AssetFormValues): Promise<void> {
    const input = toAssetWriteInput(values);

    if (isEditing && asset !== null) {
      const response = await updateAssetMutation.mutateAsync({
        assetId: asset.id,
        input
      });

      selectAsset(response.data.id);
      clearPanelState();
      return;
    }

    const response = await createAssetMutation.mutateAsync(input);
    selectAsset(response.data.id);
    clearPanelState();
  }

  function handleCancel() {
    clearPanelState();
  }

  function togglePickingLocation() {
    setPickingLocation(!isPickingLocation);
  }

  useEffect(() => {
    reset(toAssetFormValues(asset));
  }, [asset, isEditing, reset]);

  useEffect(() => {
    if (draftLocation === null) {
      return;
    }

    setValue("lat", Number(draftLocation.lat.toFixed(6)), {
      shouldDirty: true,
      shouldValidate: true
    });
    setValue("lng", Number(draftLocation.lng.toFixed(6)), {
      shouldDirty: true,
      shouldValidate: true
    });
  }, [draftLocation, setValue]);

  return {
    editNullAsset,
    errors,
    handleCancel,
    handleFormSubmit,
    handleSubmit,
    isPickingLocation,
    isSubmitting,
    mutationError,
    register,
    togglePickingLocation
  };
}

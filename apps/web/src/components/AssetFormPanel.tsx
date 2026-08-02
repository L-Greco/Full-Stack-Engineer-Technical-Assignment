import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { ASSET_FORM_SCHEMA, toAssetFormValues, toAssetWriteInput } from "../lib/asset-form";
import { useCreateAssetMutation, useUpdateAssetMutation } from "../lib/hooks/useAssetMutations";
import {
  selectClosePanel,
  selectDraftLocation,
  selectIsPickingLocation,
  selectSelectAsset,
  selectSetDraftLocation,
  selectSetPickingLocation,
  useAssetUiStore
} from "../lib/stores/useAssetUiStore";

import { AssetFormFields } from "./AssetFormFields";
import EditNullAsset from "./EditNullAsset";

import type { Asset, AssetFormValues } from "../types/assets";

interface ComponentProps {
  asset: Asset | null;
  isEditing: boolean;
}

export function AssetFormPanel({ asset, isEditing }: ComponentProps) {
  const createAssetMutation = useCreateAssetMutation();
  const draftLocation = useAssetUiStore(selectDraftLocation);
  const isPickingLocation = useAssetUiStore(selectIsPickingLocation);
  const updateAssetMutation = useUpdateAssetMutation();

  const closePanel = useAssetUiStore(selectClosePanel);
  const selectAsset = useAssetUiStore(selectSelectAsset);
  const setDraftLocation = useAssetUiStore(selectSetDraftLocation);
  const setPickingLocation = useAssetUiStore(selectSetPickingLocation);
  
  const editANullAsset = isEditing && asset === null;

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

  async function handleFormSubmit(values: AssetFormValues) {
    const input = toAssetWriteInput(values);

    if (isEditing && asset !== null) {
      const response = await updateAssetMutation.mutateAsync({
        assetId: asset.id,
        input
      });

      selectAsset(response.data.id);
    } else {
      const response = await createAssetMutation.mutateAsync(input);

      selectAsset(response.data.id);
    }

    setDraftLocation(null);
    setPickingLocation(false);
    closePanel();
  }

  function handleCancel() {
    setDraftLocation(null);
    setPickingLocation(false);
    closePanel();
  }

  function handleTogglePickingLocation() {
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

  if (editANullAsset) {
    return <EditNullAsset onCancel={handleCancel} />;
  }

  return (
    <section className="rounded-3xl border border-slate-900/8 bg-white/92 p-5 mainShadow">
      <form
        onSubmit={(event) => {
          void handleSubmit(handleFormSubmit)(event);
        }}
      >
        <AssetFormFields
          errors={errors}
          isEditing={isEditing}
          isPickingLocation={isPickingLocation}
          isSubmitting={isSubmitting}
          mutationError={(createAssetMutation.error ?? updateAssetMutation.error)?.message ?? null}
          onCancel={handleCancel}
          onTogglePickingLocation={handleTogglePickingLocation}
          register={register}
        />
      </form>
    </section>
  );
}

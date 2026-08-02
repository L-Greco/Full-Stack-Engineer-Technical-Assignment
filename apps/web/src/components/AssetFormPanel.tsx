import { useAssetFormPanel } from "../lib/hooks/useAssetFormPanel";

import { AssetFormFields } from "./AssetFormFields";
import EditNullAsset from "./EditNullAsset";

import type { Asset } from "../types/assets";

interface ComponentProps {
  asset: Asset | null;
  isEditing: boolean;
}

export function AssetFormPanel({ asset, isEditing }: ComponentProps) {
  const {
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
  } = useAssetFormPanel({
    asset,
    isEditing
  });

  if (editNullAsset) {
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
          mutationError={mutationError}
          onCancel={handleCancel}
          onTogglePickingLocation={togglePickingLocation}
          register={register}
        />
      </form>
    </section>
  );
}

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AssetList } from "../../src/components/AssetList/AssetList";
import { useAssetUiStore } from "../../src/lib/stores/useAssetUiStore";

import type { Asset } from "../../src/types/assets";

const ASSETS: Asset[] = [
  {
    id: "asset-1",
    name: "Pipe One",
    type: "pipe",
    status: "ok",
    lat: 37.9838,
    lng: 23.7275,
    installed_at: "2024-01-10",
    last_inspected_at: "2026-06-20",
    notes: ""
  }
];

afterEach(() => {
  act(() => {
    useAssetUiStore.setState({
      draftLocation: null,
      isPickingLocation: false,
      panelMode: "view",
      selectedAssetId: null
    });
  });
  document.body.innerHTML = "";
});

describe("AssetList", () => {
  it("shows a loading state while assets are being fetched", () => {
    //Arrange

    //Act
    render(
      <AssetList
        assets={[]}
        currentPage={1}
        isLoading
        onPageChange={vi.fn()}
        totalPages={1}
      />
    );

    //Assert
    expect(screen.getByText("Loading assets…")).toBeInTheDocument();
  });

  it("shows an empty state when no assets match the current filters", () => {
    //Arrange

    //Act
    render(
      <AssetList
        assets={[]}
        currentPage={1}
        isLoading={false}
        onPageChange={vi.fn()}
        totalPages={1}
      />
    );

    //Assert
    expect(screen.getByText("No assets match these filters")).toBeInTheDocument();
  });

  it("selects an asset when the user clicks an asset row", async () => {
    //Arrange
    const user = userEvent.setup();
    const mapElement = document.createElement("div");
    const scrollIntoViewMock = vi.fn();
    mapElement.id = "asset-map";
    mapElement.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(mapElement);

    render(
      <AssetList
        assets={ASSETS}
        currentPage={1}
        isLoading={false}
        onPageChange={vi.fn()}
        totalPages={1}
      />
    );

    //Act
    await act(async () => {
      await user.click(screen.getByRole("button", { name: /Pipe One/i }));
    });

    //Assert
    await waitFor(() => {
      expect(useAssetUiStore.getState().selectedAssetId).toBe("asset-1");
    });
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });
});

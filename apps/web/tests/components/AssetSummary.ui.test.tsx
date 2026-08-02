import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AssetSummary } from "../../src/components/AssetSummary";

describe("AssetSummary", () => {
  it("shows the visible and total counts when the summary is not loading", () => {
    //Arrange
    const assetCount = 7;
    const total = 18;

    //Act
    render(<AssetSummary assetCount={assetCount} isLoading={false} total={total} />);

    //Assert
    expect(screen.getByText("Visible now")).toBeInTheDocument();
    expect(screen.getByText("Total matches")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
  });

  it("shows loading placeholders while the summary data is still loading", () => {
    //Arrange

    //Act
    render(<AssetSummary assetCount={7} isLoading total={18} />);

    //Assert
    expect(screen.getAllByText("…")).toHaveLength(2);
  });
});

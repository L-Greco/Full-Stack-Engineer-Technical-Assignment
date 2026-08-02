import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AssetFilters } from "../../src/components/AssetFilters";

describe("AssetFilters", () => {
  it("calls the matching change handlers when the user changes the selected filters", async () => {
    //Arrange
    const user = userEvent.setup();
    const handleStatusChange = vi.fn();
    const handleTypeChange = vi.fn();

    render(
      <AssetFilters
        selectedStatus="all"
        selectedType="all"
        onReset={vi.fn()}
        onStatusChange={handleStatusChange}
        onTypeChange={handleTypeChange}
      />
    );
    const [typeSelect, statusSelect] = screen.getAllByRole("combobox");

    //Act
    await user.selectOptions(typeSelect, "sensor");
    await user.selectOptions(statusSelect, "critical");

    //Assert
    expect(handleTypeChange).toHaveBeenCalledWith("sensor");
    expect(handleStatusChange).toHaveBeenCalledWith("critical");
  });

  it("calls the reset handler when the user clears the current filters", async () => {
    //Arrange
    const user = userEvent.setup();
    const handleReset = vi.fn();

    render(
      <AssetFilters
        selectedStatus="warning"
        selectedType="pipe"
        onReset={handleReset}
        onStatusChange={vi.fn()}
        onTypeChange={vi.fn()}
      />
    );

    //Act
    await user.click(screen.getByRole("button", { name: "Clear" }));

    //Assert
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});

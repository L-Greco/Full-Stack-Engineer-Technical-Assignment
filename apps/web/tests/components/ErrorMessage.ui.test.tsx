import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ErrorMessage from "../../src/components/AssetList/ErrorMessage";

describe("ErrorMessage", () => {
  it("shows the provided error message and lets the user retry", async () => {
    //Arrange
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    render(
      <ErrorMessage
        errorMessage="The server is temporarily unavailable."
        onRetry={handleRetry}
      />
    );

    //Act
    await user.click(screen.getByRole("button", { name: "Retry" }));

    //Assert
    expect(screen.getByText("We could not load assets")).toBeInTheDocument();
    expect(
      screen.getByText("The server is temporarily unavailable.")
    ).toBeInTheDocument();
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});

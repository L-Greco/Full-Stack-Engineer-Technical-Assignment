import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getVisiblePageNumbers } from "../../src/lib/asset-pagination.js";

void describe("getVisiblePageNumbers", () => {
  void it("returns every page when the total fits within the visible window", () => {
    //Arrange
    const currentPage = 2;
    const totalPages = 4;

    //Act
    const result = getVisiblePageNumbers(currentPage, totalPages);

    //Assert
    assert.deepEqual(result, [1, 2, 3, 4]);
  });

  void it("keeps the visible window centered around the current page when possible", () => {
    //Arrange
    const currentPage = 5;
    const totalPages = 10;

    //Act
    const result = getVisiblePageNumbers(currentPage, totalPages);

    //Assert
    assert.deepEqual(result, [3, 4, 5, 6, 7]);
  });

  void it("pins the visible window to the end when the current page is near the last page", () => {
    //Arrange
    const currentPage = 10;
    const totalPages = 10;

    //Act
    const result = getVisiblePageNumbers(currentPage, totalPages);

    //Assert
    assert.deepEqual(result, [6, 7, 8, 9, 10]);
  });
});

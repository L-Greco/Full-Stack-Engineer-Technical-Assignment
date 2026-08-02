const MAX_VISIBLE_PAGE_BUTTONS = 5;

export function getVisiblePageNumbers(currentPage: number, totalPages: number): number[] {
  if (totalPages <= MAX_VISIBLE_PAGE_BUTTONS) {
    return Array.from({ length: totalPages }, (_value, index) => index + 1);
  }

  const halfWindow = Math.floor(MAX_VISIBLE_PAGE_BUTTONS / 2);
  const maxStartPage = totalPages - MAX_VISIBLE_PAGE_BUTTONS + 1;
  const startPage = Math.min(
    Math.max(currentPage - halfWindow, 1),
    maxStartPage
  );

  return Array.from(
    { length: MAX_VISIBLE_PAGE_BUTTONS },
    (_value, index) => startPage + index
  );
}

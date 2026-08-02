import { getVisiblePageNumbers } from "../../lib/asset-pagination";

interface ComponentProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export default function AssetPagination({
  currentPage,
  onPageChange,
  totalPages
}: ComponentProps) {
  const visiblePageNumbers = getVisiblePageNumbers(currentPage, totalPages);
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Asset list pagination"
      className="mt-6 flex flex-col gap-3 border-t border-slate-900/8 pt-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-slate-600">
        Page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          className="cursor-pointer rounded-2xl bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          disabled={isPreviousDisabled}
          onClick={() => onPageChange(currentPage - 1)}
          type="button"
        >
          Previous
        </button>

        {visiblePageNumbers.map((pageNumber) => (
          <button
            className={`cursor-pointer rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
              pageNumber === currentPage
                ? "bg-slate-900 text-white"
                : "bg-slate-200 text-slate-900 hover:bg-slate-300"
            }`}
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            type="button"
          >
            {pageNumber}
          </button>
        ))}

        <button
          className="cursor-pointer rounded-2xl bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          disabled={isNextDisabled}
          onClick={() => onPageChange(currentPage + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </nav>
  );
}

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// Set this to your table's background color
const TABLE_BG = "bg-[#EFEFEF]";

interface PaginationComponentProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  pageSizeOptions?: number[];
  showItemsInfo?: boolean;
  className?: string;
}

export function PaginationComponent({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 20, 50],
  showItemsInfo = true,
  className = "",
}: PaginationComponentProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const getVisiblePages = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "ellipsis", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
  };

  if (totalItems === 0 && !showItemsInfo) return null;
  if (totalPages <= 1 && !showItemsInfo) return null;

  // White buttons stand out on the table-colored bar
  const navBtn =
    "flex h-8 items-center gap-1 rounded-[10px] border border-[#D5D5D5] bg-white px-2 text-[12px] font-medium text-black transition-colors hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white";

  return (
    <div
      className={`flex w-full flex-col gap-3 border-t border-[#D5D5D5] ${TABLE_BG} px-4 py-3 font-poppins md:flex-row md:items-center md:justify-between ${className}`}
    >
      {/* Items info */}
      {showItemsInfo && (
        <p className="text-[12px] font-normal text-[#848484] sm:text-[14px]">
          {totalItems > 0
            ? `Showing ${startItem} to ${endItem} of ${totalItems} ${totalItems === 1 ? "item" : "items"}`
            : "No items found"}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          {/* Previous */}
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={isPreviousDisabled}
            className={navBtn}
          >
            <ChevronLeft className="size-4" />
            <span className="hidden md:block">Prev</span>
          </button>

          {/* Page numbers */}
          {getVisiblePages().map((page, index) =>
            page === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="px-1 text-[#848484]">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange?.(page)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-[10px] border px-2 text-[12px] font-medium transition-colors ${
                  page === currentPage
                    ? "border-primary bg-primary text-white"
                    : "border-[#D5D5D5] bg-white text-black hover:bg-[#F7F7F7]"
                }`}
              >
                {page}
              </button>
            )
          )}

          {/* Next */}
          <button
            type="button"
            aria-label="Next page"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={isNextDisabled}
            className={navBtn}
          >
            <span className="hidden md:block">Next</span>
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Items per page */}
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
          className="h-8 rounded-[10px] border border-[#D5D5D5] bg-white px-2 text-[12px] font-medium text-black focus:border-primary focus:outline-none"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
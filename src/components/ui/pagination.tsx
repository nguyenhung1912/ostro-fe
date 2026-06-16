import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  // Resolve totalPages
  const resolvedTotalPages =
    totalPages !== undefined
      ? totalPages
      : totalCount !== undefined && pageSize !== undefined
        ? Math.max(Math.ceil(totalCount / pageSize), 1)
        : 1;

  // If there's only 1 page, don't show pagination to save vertical screen space
  if (resolvedTotalPages <= 1) {
    return null;
  }

  // Calculate pagination range with ellipsis dots
  const getPaginationRange = () => {
    const totalPageNumbers = siblingCount + 5; // first + last + current + 2 * dots

    // If total pages is less than the numbers we want to show, show all page numbers
    if (totalPageNumbers >= resolvedTotalPages) {
      return range(1, resolvedTotalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      resolvedTotalPages,
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < resolvedTotalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = resolvedTotalPages;

    // Case 1: No left dots, but right dots show
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "DOTS", lastPageIndex];
    }

    // Case 2: No right dots, but left dots show
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(
        resolvedTotalPages - rightItemCount + 1,
        resolvedTotalPages,
      );
      return [firstPageIndex, "DOTS", ...rightRange];
    }

    // Case 3: Both left and right dots show
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "DOTS", ...middleRange, "DOTS", lastPageIndex];
    }

    return [];
  };

  const paginationRange = getPaginationRange();

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-border/30",
        className,
      )}
    >
      {/* Page Info / Item Count description */}
      {totalCount !== undefined && pageSize !== undefined && (
        <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
          Hiển thị{" "}
          <span className="font-semibold text-foreground">
            {Math.min((currentPage - 1) * pageSize + 1, totalCount)}
          </span>{" "}
          đến{" "}
          <span className="font-semibold text-foreground">
            {Math.min(currentPage * pageSize, totalCount)}
          </span>{" "}
          trong tổng số{" "}
          <span className="font-semibold text-foreground">{totalCount}</span>{" "}
          mục
        </div>
      )}

      {/* Pagination Controls */}
      <div
        className={cn(
          "flex items-center gap-1.5 order-1 sm:order-2",
          !totalCount && "mx-auto",
        )}
      >
        {/* Previous Page Button */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-border/40 hover:bg-secondary/10"
          title="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Number Buttons */}
        {paginationRange.map((pageNumber, idx) => {
          if (pageNumber === "DOTS") {
            return (
              <div
                key={`dots-${idx}`}
                className="flex items-center justify-center size-8 text-muted-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            );
          }

          const isCurrent = pageNumber === currentPage;

          return (
            <Button
              key={`page-${pageNumber}`}
              variant={isCurrent ? "default" : "outline"}
              size="icon-sm"
              onClick={() => onPageChange(pageNumber as number)}
              className={cn(
                "font-semibold text-xs transition-all duration-200 size-8",
                isCurrent
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 scale-105"
                  : "border-border/40 hover:bg-secondary/10 hover:text-foreground text-muted-foreground",
              )}
            >
              {pageNumber}
            </Button>
          );
        })}

        {/* Next Page Button */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === resolvedTotalPages}
          className="border-border/40 hover:bg-secondary/10"
          title="Trang sau"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}

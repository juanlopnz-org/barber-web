"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  /** Current 1-based page. */
  page: number;
  /** Rows per page. */
  pageSize: number;
  /** Total number of rows across every page. */
  total: number;
  /** Called with the new page number. */
  onPageChange: (page: number) => void;
  /** Called with the new page size. */
  onPageSizeChange?: (pageSize: number) => void;
  /** Extra classes for the wrapper. */
  className?: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

type PageItem = number | "gap";

/**
 * Build the list of page buttons to render, inserting a "gap" marker where
 * pages are skipped. Keeps the control narrow on long listings.
 */
function buildPageItems(current: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) items.push("gap");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push("gap");
  items.push(totalPages);

  return items;
}

/**
 * Pagination control shared by the barber appointments list and the admin
 * agenda. The API does the slicing; this component only owns the page
 * state and renders the controls.
 */
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const firstRow = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, total);
  const items = buildPageItems(page, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-3 text-xs text-secondary">
        <span>
          Mostrando <strong className="text-foreground">{firstRow}</strong>–
          <strong className="text-foreground">{lastRow}</strong> de{" "}
          <strong className="text-foreground">{total}</strong>
        </span>
        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            <span>Filas por página</span>
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-8 rounded-xl border border-border bg-white/82 px-2 text-xs text-foreground"
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Anterior
        </Button>

        {items.map((item, index) =>
          item === "gap" ? (
            <span
              key={`gap-${index}`}
              className="px-1 text-xs text-secondary"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              size="sm"
              variant={item === page ? "default" : "outline"}
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className="min-w-9"
            >
              {item}
            </Button>
          ),
        )}

        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Página siguiente"
        >
          Siguiente
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, totalElements, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="flex items-center justify-between px-8 py-4 text-[12px] font-medium text-[var(--ink-muted)]">
      <span>
        Showing {start}–{end} of {totalElements}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 0}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--veloce-border)] transition-colors hover:bg-[var(--stone)] disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="px-2">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--veloce-border)] transition-colors hover:bg-[var(--stone)] disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

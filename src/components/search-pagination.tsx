'use client';

import { Button } from '@/components/ui/button';

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function SearchPagination({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}: SearchPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <Button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        variant="outline"
      >
        Previous
      </Button>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <Button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
}

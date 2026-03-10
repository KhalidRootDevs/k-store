'use client';

import type { Table } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCallback, useEffect } from 'react';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalItems?: number;
}

export function DataTablePagination<TData>({
  table,
  totalItems = 0
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();

  const updateURL = useCallback(
    (newPage: number, newPageSize: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(newPage + 1));
      params.set('pageSize', String(newPageSize));
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const goToPage = useCallback(
    (newPage: number) => {
      table.setPageIndex(newPage);
      updateURL(newPage, pageSize);
    },
    [table, pageSize, updateURL]
  );

  const changePageSize = useCallback(
    (newPageSize: number) => {
      const newPageIndex = Math.floor((pageIndex * pageSize) / newPageSize);
      table.setPageSize(newPageSize);
      table.setPageIndex(newPageIndex);
      updateURL(newPageIndex, newPageSize);
    },
    [table, pageIndex, pageSize, updateURL]
  );

  useEffect(() => {
    const currentPage = Number(searchParams.get('page')) || 1;
    const currentPageSize = Number(searchParams.get('pageSize')) || 10;

    if (currentPage !== pageIndex + 1 || currentPageSize !== pageSize) {
      updateURL(pageIndex, pageSize);
    }
  }, [pageIndex, pageSize, searchParams, updateURL]);

  return (
    <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
      {/* Left section: Selected info + Rows per page */}
      <div className="flex flex-col items-center gap-4 text-sm text-gray-600 sm:flex-row sm:gap-8">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <span className="font-medium text-indigo-600">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} selected
          </span>
        ) : (
          <span>Total {totalItems} items</span>
        )}

        <div className="flex items-center space-x-2">
          <label
            htmlFor="rows-per-page"
            className="select-none font-medium text-gray-700 "
          >
            Rows per page:
          </label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => changePageSize(Number(value))}
            aria-label="Rows per page"
          >
            <SelectTrigger
              id="rows-per-page"
              className="h-8 w-[80px] rounded-full border border-gray-300 shadow-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right section: Pagination controls */}
      <div className="flex items-center space-x-2">
        <div className="min-w-[110px] text-center text-sm font-semibold text-gray-700">
          Page {pageIndex + 1} of {pageCount || 1}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            className="hidden rounded-full border border-gray-200 p-2 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 lg:flex"
            onClick={() => goToPage(0)}
            disabled={pageIndex === 0}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-5 w-5 text-gray-600 " />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border border-gray-200 p-2 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => goToPage(pageIndex - 1)}
            disabled={pageIndex === 0}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 " />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border border-gray-200 p-2 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => goToPage(pageIndex + 1)}
            disabled={pageIndex >= pageCount - 1}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 " />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hidden rounded-full border border-gray-200 p-2 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 lg:flex"
            onClick={() => goToPage(pageCount - 1)}
            disabled={pageIndex >= pageCount - 1}
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-5 w-5 text-gray-600 " />
          </Button>
        </div>
      </div>
    </div>
  );
}

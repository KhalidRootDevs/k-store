'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DataTableSingleSelectFilter } from './data-table-select-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface FilterOption {
  value: string;
  label: string;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  search: boolean;
  children?: React.ReactNode;
  searchPlaceholder?: string;
  filters?: Record<string, FilterOption[]>;
}

export function DataTableToolbar<TData>({
  table,
  search,
  children,
  searchPlaceholder,
  filters = {}
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search term state
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get('search') || ''
  );

  // Dynamic filter values state
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      Object.keys(filters).forEach((key) => {
        const value = searchParams.get(key);
        if (value) initial[key] = value;
      });
      return initial;
    }
  );

  // Update URL whenever searchTerm or filterValues change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set('search', searchTerm);

    Object.keys(filterValues).forEach((key) => {
      if (filterValues[key]) params.set(key, filterValues[key]);
    });

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchTerm, filterValues, router]);

  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    searchTerm ||
    Object.values(filterValues).some(Boolean);

  return (
    <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
      <div className="flex flex-1 items-center space-x-2">
        {search && (
          <Input
            placeholder={searchPlaceholder || 'Search...'}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-10 max-w-sm"
          />
        )}

        {/* Dynamic Filters */}
        {Object.keys(filters).map((key) => (
          <DataTableSingleSelectFilter
            key={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            options={filters[key]}
            value={filterValues[key] || ''}
            onChange={(value: string) =>
              setFilterValues((prev) => ({ ...prev, [key]: value }))
            }
            // Optional: reset table column filter as well
            onColumnFilterChange={(value: string) =>
              table.getColumn(key)?.setFilterValue(value || undefined)
            }
          />
        ))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm('');
              table.resetColumnFilters();
              setFilterValues({});
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="mr-2">{children}</div>

      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

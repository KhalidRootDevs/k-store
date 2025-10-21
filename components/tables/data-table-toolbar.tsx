"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Table } from "@tanstack/react-table";
import { Search, X, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTableSingleSelectFilter } from "./data-table-select-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface FilterOption {
  value: string;
  label: string;
}

interface RangeFilter {
  name: string;
  label: string;
  placeholder: string;
  type: "number";
}

interface SwitchFilter {
  name: string;
  value: boolean;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  search: boolean;
  children?: React.ReactNode;
  searchPlaceholder?: string;
  filters?: Array<{
    name: string;
    options: FilterOption[];
  }>;
  rangeFilters?: RangeFilter[];
  switchFilters?: SwitchFilter[];
  data?: TData[];
}

export function DataTableToolbar<TData>({
  table,
  search,
  children,
  searchPlaceholder,
  filters = [],
  rangeFilters = [],
  switchFilters = [],
  data = [],
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search term state
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );

  // Dynamic filter values state (string | boolean stored as string)
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      filters.forEach((filter) => {
        const value = searchParams.get(filter.name);
        if (value) initial[filter.name] = value;
      });
      rangeFilters.forEach((filter) => {
        const value = searchParams.get(filter.name);
        if (value) initial[filter.name] = value;
      });
      switchFilters.forEach((filter) => {
        const value = searchParams.get(filter.name);
        if (value) initial[filter.name] = value;
      });
      return initial;
    }
  );

  const updateURL = () => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);

    Object.keys(filterValues).forEach((key) => {
      if (filterValues[key]) params.set(key, filterValues[key]);
    });

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchParams.get("search")) {
      const params = new URLSearchParams(searchParams);
      params.delete("search");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    const newFilterValues = {
      ...filterValues,
      [key]: typeof value === "boolean" ? String(value) : value,
    };
    setFilterValues(newFilterValues);

    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);

    Object.keys(newFilterValues).forEach((filterKey) => {
      if (newFilterValues[filterKey]) {
        params.set(filterKey, newFilterValues[filterKey]);
      } else {
        params.delete(filterKey);
      }
    });

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    setSearchTerm("");
    table.resetColumnFilters();
    setFilterValues({});
    router.replace("?", { scroll: false });
  };

  const isFiltered =
    searchTerm ||
    Object.values(filterValues).some(Boolean) ||
    table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder || "Search..."}
                className="h-9 pl-9"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" size="sm" className="h-9">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-9"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </form>

        <div className="flex items-center gap-2">
          {children && <div className="mr-2">{children}</div>}
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Filter Options Row */}
      {(filters.length > 0 ||
        rangeFilters.length > 0 ||
        switchFilters.length > 0) && (
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          {/* Select Filters */}
          {filters.map((filter) => (
            <DataTableSingleSelectFilter
              key={filter.name}
              title={filter.name.charAt(0).toUpperCase() + filter.name.slice(1)}
              options={filter.options}
              value={filterValues[filter.name] || ""}
              onChange={(value: string) =>
                handleFilterChange(filter.name, value)
              }
              onColumnFilterChange={(value: string) =>
                table.getColumn(filter.name)?.setFilterValue(value || undefined)
              }
            />
          ))}

          {/* Range Filters */}
          {rangeFilters.map((filter) => (
            <div key={filter.name} className="flex items-center gap-2">
              <label className="text-sm font-medium">{filter.label}:</label>
              <Input
                type="number"
                placeholder={filter.placeholder}
                className="h-9 w-24"
                value={filterValues[filter.name] || ""}
                onChange={(e) =>
                  handleFilterChange(filter.name, e.target.value)
                }
              />
            </div>
          ))}

          {/* Switch Filters */}
          {switchFilters.map((filter) => (
            <div key={filter.name} className="flex items-center gap-2">
              <label className="text-sm font-medium">{filter.name}</label>
              <Switch
                checked={filterValues[filter.name] === "true"}
                onCheckedChange={(checked: boolean) =>
                  handleFilterChange(filter.name, checked)
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

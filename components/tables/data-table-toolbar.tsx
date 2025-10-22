"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Table } from "@tanstack/react-table";
import { Search, X, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { DataTableSingleSelectFilter } from "./data-table-select-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  value: string;
  label: string;
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
  data?: TData[];
}

const TableContext = createContext<Table<any> | null>(null);

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
};

export function DataTableToolbar<TData>({
  table,
  search,
  children,
  searchPlaceholder,
  filters = [],
  data = [],
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Search term state
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );

  // Dynamic filter values state
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      filters.forEach((filter) => {
        const value = searchParams.get(filter.name);
        if (value) initial[filter.name] = value;
      });
      return initial;
    }
  );

  // Remove duplicate options from filters
  const uniqueFilters = filters.map((filter) => ({
    ...filter,
    options: filter.options.filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.value === option.value)
    ),
  }));

  // Count active filters
  const activeFilterCount = Object.values(filterValues).filter(Boolean).length;

  // Convert value for Select component (empty string becomes "all")
  const getSelectValue = (value: string) => {
    return value === "" ? "all" : value;
  };

  // Convert value from Select component ("all" becomes empty string)
  const getActualValue = (selectValue: string) => {
    return selectValue === "all" ? "" : selectValue;
  };

  // Update URL with current search and filter values
  const updateURL = () => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);

    Object.keys(filterValues).forEach((key) => {
      if (filterValues[key]) params.set(key, filterValues[key]);
    });

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL();
  };

  // Handle individual search input clear
  const handleClearSearch = () => {
    setSearchTerm("");
    // If search was previously applied, update URL immediately
    if (searchParams.get("search")) {
      const params = new URLSearchParams(searchParams);
      params.delete("search");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  };

  // Update URL whenever filterValues change
  const handleFilterChange = (key: string, selectValue: string) => {
    const actualValue = getActualValue(selectValue);
    const newFilterValues = { ...filterValues, [key]: actualValue };
    setFilterValues(newFilterValues);

    // Update URL immediately for filter changes
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

  // Clear all filters
  const handleClearAllFilters = () => {
    setFilterValues({});
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);

    // Clear all filter params
    uniqueFilters.forEach((filter) => {
      params.delete(filter.name);
    });

    router.replace(`?${params.toString()}`, { scroll: false });
    setIsFilterOpen(false);
  };

  // Clear single filter
  const handleClearFilter = (filterName: string) => {
    const newFilterValues = { ...filterValues };
    delete newFilterValues[filterName];
    setFilterValues(newFilterValues);

    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);

    Object.keys(newFilterValues).forEach((filterKey) => {
      if (newFilterValues[filterKey]) {
        params.set(filterKey, newFilterValues[filterKey]);
      }
    });

    params.delete(filterName);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Get filter label for display
  const getFilterLabel = (filterName: string, value: string) => {
    const filter = uniqueFilters.find((f) => f.name === filterName);
    const option = filter?.options.find((opt) => opt.value === value);
    return option?.label || value;
  };

  // Reset all filters and search
  const handleReset = () => {
    setSearchTerm("");
    table.resetColumnFilters();
    setFilterValues({});
    // Immediately update URL after reset
    router.replace("?", { scroll: false });
  };

  const isFiltered =
    searchTerm ||
    Object.values(filterValues).some(Boolean) ||
    table.getState().columnFilters.length > 0;

  return (
    <TableContext.Provider value={table}>
      <div className="flex flex-col gap-4 mb-6">
        {/* Search Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            {search && (
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
                {searchTerm && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </form>
            )}

            {/* Dynamic Filter Button - Only shows if filters are provided */}
            {filters.length > 0 && (
              <div className="flex items-center gap-2">
                {/* Active filters badges */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(filterValues)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="flex items-center gap-1 px-2 py-1 text-xs"
                        >
                          <span className="font-medium capitalize">
                            {key.replace(/_/g, " ")}:
                          </span>
                          {getFilterLabel(key, value)}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => handleClearFilter(key)}
                          />
                        </Badge>
                      ))}
                  </div>
                )}

                {/* Filter dropdown */}
                <DropdownMenu
                  open={isFilterOpen}
                  onOpenChange={setIsFilterOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-dashed"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-1 rounded-sm px-1 font-normal"
                        >
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-60 max-h-[80vh] overflow-hidden"
                    sideOffset={5}
                    collisionPadding={16}
                  >
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <DropdownMenuLabel className="text-sm font-semibold">
                        Filters
                      </DropdownMenuLabel>
                      {activeFilterCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearAllFilters}
                          className="h-auto px-2 py-1 text-xs"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    <DropdownMenuSeparator />

                    <div className="overflow-y-auto max-h-[60vh] p-2">
                      {uniqueFilters.length > 0 ? (
                        <div className="space-y-4">
                          {uniqueFilters.map((filter) => (
                            <div key={filter.name} className="space-y-2">
                              <label className="text-sm font-medium capitalize">
                                {filter.name.replace(/_/g, " ")}
                              </label>
                              <DataTableSingleSelectFilter
                                title={
                                  filter.name.charAt(0).toUpperCase() +
                                  filter.name.slice(1)
                                }
                                options={filter.options}
                                value={getSelectValue(
                                  filterValues[filter.name] || ""
                                )}
                                onChange={(selectValue: string) => {
                                  handleFilterChange(filter.name, selectValue);
                                }}
                                onColumnFilterChange={(selectValue: string) => {
                                  const actualValue =
                                    getActualValue(selectValue);
                                  table
                                    .getColumn(filter.name)
                                    ?.setFilterValue(actualValue || undefined);
                                }}
                                variant="inline"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No filters available
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* View Options and Children */}
          <div className="flex items-center gap-2">
            {children && <div className="mr-2">{children}</div>}
            <DataTableViewOptions table={table} />
          </div>
        </div>
      </div>
    </TableContext.Provider>
  );
}

"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Table } from "@tanstack/react-table"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { DataTableSingleSelectFilter } from "./data-table-select-filter"
import { DataTableViewOptions } from "./data-table-view-options"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface FilterOption {
  value: string
  label: string
}

interface RangeFilter {
  name: string
  label: string
  placeholder: string
  type: "number" | "text"
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  search: boolean
  children?: React.ReactNode
  searchPlaceholder?: string
  filters?: Array<{
    name: string
    options: FilterOption[]
  }>
  rangeFilters?: RangeFilter[]
  data?: TData[]
}

export function DataTableToolbar<TData>({
  table,
  search,
  children,
  searchPlaceholder,
  filters = [],
  rangeFilters = [],
  data = [],
}: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Search term state
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("search") || "")

  // Dynamic filter values state
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    filters.forEach((filter) => {
      const value = searchParams.get(filter.name)
      if (value) initial[filter.name] = value
    })
    rangeFilters.forEach((filter) => {
      const value = searchParams.get(filter.name)
      if (value) initial[filter.name] = value
    })
    return initial
  })

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Update URL with current search and filter values
  const updateURL = () => {
    const params = new URLSearchParams()

    if (searchTerm) params.set("search", searchTerm)

    Object.keys(filterValues).forEach((key) => {
      if (filterValues[key]) params.set(key, filterValues[key])
    })

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL()
  }

  // Handle individual search input clear
  const handleClearSearch = () => {
    setSearchTerm("")
    if (searchParams.get("search")) {
      const params = new URLSearchParams(searchParams)
      params.delete("search")
      router.replace(`?${params.toString()}`, { scroll: false })
    }
  }

  // Update URL whenever filterValues change
  const handleFilterChange = (key: string, value: string) => {
    const newFilterValues = { ...filterValues, [key]: value }
    setFilterValues(newFilterValues)

    const params = new URLSearchParams()

    if (searchTerm) params.set("search", searchTerm)

    Object.keys(newFilterValues).forEach((filterKey) => {
      if (newFilterValues[filterKey]) {
        params.set(filterKey, newFilterValues[filterKey])
      } else {
        params.delete(filterKey)
      }
    })

    router.replace(`?${params.toString()}`, { scroll: false })
  }

  // Reset all filters and search
  const handleReset = () => {
    setSearchTerm("")
    table.resetColumnFilters()
    setFilterValues({})
    router.replace("?", { scroll: false })
  }

  const activeFilterCount = Object.entries(filterValues).filter(([key, value]) => value && value !== "all").length

  const isFiltered = searchTerm || activeFilterCount > 0 || table.getState().columnFilters.length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Section */}
        <form onSubmit={handleSearch} className="flex flex-1 gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder || "Search..."}
              className="pl-9 h-10"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button type="submit" size="default" className="h-10">
            Search
          </Button>
        </form>

        {/* Actions Section */}
        <div className="flex items-center gap-2">
          {filters.length > 0 && (
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="default" className="h-10 relative bg-transparent">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="end">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Filters</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Refine your search results</p>
                    </div>
                    {isFiltered && (
                      <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs">
                        Reset
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {filters.map((filter) => (
                      <div key={filter.name} className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {filter.name.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                        <DataTableSingleSelectFilter
                          title=""
                          options={filter.options}
                          value={filterValues[filter.name] || ""}
                          onChange={(value: string) => handleFilterChange(filter.name, value)}
                          onColumnFilterChange={(value: string) =>
                            table.getColumn(filter.name)?.setFilterValue(value || undefined)
                          }
                        />
                      </div>
                    ))}

                    {rangeFilters.length > 0 && (
                      <>
                        <Separator className="my-3" />
                        <div className="space-y-3">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Price Range
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {rangeFilters.map((filter) => (
                              <div key={filter.name} className="space-y-1.5">
                                <label className="text-xs text-muted-foreground">{filter.label}</label>
                                <Input
                                  type={filter.type}
                                  placeholder={filter.placeholder}
                                  value={filterValues[filter.name] || ""}
                                  onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                                  className="h-9"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Clear all button */}
          {isFiltered && (
            <Button variant="outline" size="default" onClick={handleReset} className="h-10 bg-transparent">
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}

          {children && <div>{children}</div>}
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {Object.entries(filterValues)
            .filter(([key, value]) => value && value !== "all")
            .map(([key, value]) => {
              const filter = filters.find((f) => f.name === key)
              const option = filter?.options.find((o) => o.value === value)
              const rangeFilter = rangeFilters.find((f) => f.name === key)

              return (
                <Badge key={key} variant="secondary" className="gap-1 pr-1 pl-2.5">
                  <span className="text-xs">
                    {filter
                      ? `${key.replace(/([A-Z])/g, " $1").trim()}: ${option?.label || value}`
                      : rangeFilter
                        ? `${rangeFilter.label}: ${value}`
                        : `${key}: ${value}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange(key, "")}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )
            })}
        </div>
      )}
    </div>
  )
}

"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Column } from "@tanstack/react-table"

interface DataTableSingleSelectFilterProps<TData> {
  column?: Column<TData, string>
  title?: string
  options: {
    label: string
    value: string
  }[]
  value: string
  onChange: (value: string) => void
  onColumnFilterChange?: (value: string) => void
}

export function DataTableSingleSelectFilter<TData>({
  column,
  title,
  options,
  value,
  onChange,
  onColumnFilterChange,
}: DataTableSingleSelectFilterProps<TData>) {
  const handleValueChange = (newValue: string) => {
    onChange(newValue)
    onColumnFilterChange?.(newValue)
  }

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full h-9">
        <SelectValue placeholder={title || "Select..."} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

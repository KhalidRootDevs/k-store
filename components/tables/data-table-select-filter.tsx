"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Column } from "@tanstack/react-table";

interface DataTableSingleSelectFilterProps<TData> {
  column?: Column<TData, string>;
  title?: string;
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  onColumnFilterChange?: (value: string) => void;
  variant?: "default" | "inline";
}

export function DataTableSingleSelectFilter<TData>({
  column,
  title,
  options,
  value,
  onChange,
  onColumnFilterChange,
  variant = "default",
}: DataTableSingleSelectFilterProps<TData>) {
  // Remove duplicate options
  const uniqueOptions = options.filter(
    (option, index, self) =>
      index === self.findIndex((o) => o.value === option.value)
  );

  const handleValueChange = (newValue: string) => {
    onChange(newValue);
    onColumnFilterChange?.(newValue);
  };

  // Get display value for SelectValue
  const getDisplayValue = () => {
    if (value === "all") return `All ${title}`;
    const option = uniqueOptions.find((opt) => opt.value === value);
    return option?.label || `All ${title}`;
  };

  // Inline variant for dropdown menu
  if (variant === "inline") {
    return (
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full h-9">
          <SelectValue>{getDisplayValue()}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {uniqueOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Default variant (original layout)
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={`${title?.toLowerCase()}-filter`}
        className="text-sm whitespace-nowrap"
      >
        {title}:
      </label>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue>{getDisplayValue()}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {uniqueOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

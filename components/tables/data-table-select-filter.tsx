'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import type { Column } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';

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
}

export function DataTableSingleSelectFilter<TData>({
  column,
  title,
  options,
  value,
  onChange,
  onColumnFilterChange
}: DataTableSingleSelectFilterProps<TData>) {
  const selectedValue = value;

  const handleSelect = (val: string) => {
    onChange(val);
    onColumnFilterChange?.(val);
  };

  const selectedLabel = options.find((opt) => opt.value === selectedValue)
    ?.label;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 border-dashed">
          <ChevronsUpDown className="mr-2 h-4 w-4" />
          {title}
          {selectedValue && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedLabel}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="flex flex-col">
          {options.map((option) => (
            <Button
              key={option.value}
              variant={option.value === selectedValue ? 'secondary' : 'ghost'}
              size="sm"
              className="justify-start rounded-none border-b last:border-b-0"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </Button>
          ))}
          {selectedValue && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 justify-center"
              onClick={() => handleSelect('')}
            >
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

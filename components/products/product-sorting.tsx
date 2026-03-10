'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { LayoutGrid, List } from 'lucide-react';

interface ProductSortingProps {
  sortBy: string;
  viewMode: 'grid' | 'list';
  sortOptions: { value: string; label: string }[];
  onSortChange: (value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ProductSorting({
  sortBy,
  viewMode,
  sortOptions,
  onSortChange,
  onViewModeChange
}: ProductSortingProps) {
  return (
    <div className="flex w-full items-center gap-4 sm:w-auto">
      <div className="flex-1 sm:flex-initial">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          className="h-9 w-9"
          onClick={() => onViewModeChange('grid')}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="sr-only">Grid view</span>
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          className="h-9 w-9"
          onClick={() => onViewModeChange('list')}
          aria-label="List view"
        >
          <List className="h-4 w-4" />
          <span className="sr-only">List view</span>
        </Button>
      </div>
    </div>
  );
}

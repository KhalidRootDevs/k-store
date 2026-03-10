'use client';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Category, Brand } from '@/lib/product-data';

interface ActiveFiltersProps {
  searchQuery: string;
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  categories: Category[];
  brands: Brand[];
  onRemoveSearchQuery: () => void;
  onRemoveCategory: (categoryId: string, checked: boolean) => void;
  onRemoveBrand: (brandId: string, checked: boolean) => void;
  onResetPriceRange: () => void;
  onResetAllFilters: () => void;
}

export function ActiveFilters({
  searchQuery,
  selectedCategories,
  selectedBrands,
  priceRange,
  categories,
  brands,
  onRemoveSearchQuery,
  onRemoveCategory,
  onRemoveBrand,
  onResetPriceRange,
  onResetAllFilters
}: ActiveFiltersProps) {
  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    selectedCategories.length +
    selectedBrands.length +
    (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0);

  if (activeFilterCount === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Active Filters:</span>

        {searchQuery && (
          <Button
            variant="secondary"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={onRemoveSearchQuery}
          >
            Search: {searchQuery}
            <X className="h-3 w-3" />
          </Button>
        )}

        {selectedCategories.map((categoryId) => {
          const category = categories.find((c) => c.id === categoryId);
          return (
            <Button
              key={categoryId}
              variant="secondary"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => onRemoveCategory(categoryId, false)}
            >
              Category: {category?.name}
              <X className="h-3 w-3" />
            </Button>
          );
        })}

        {selectedBrands.map((brandId) => {
          const brand = brands.find((b) => b.id === brandId);
          return (
            <Button
              key={brandId}
              variant="secondary"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => onRemoveBrand(brandId, false)}
            >
              Brand: {brand?.name}
              <X className="h-3 w-3" />
            </Button>
          );
        })}

        {(priceRange[0] > 0 || priceRange[1] < 200) && (
          <Button
            variant="secondary"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={onResetPriceRange}
          >
            Price: ${priceRange[0]} - ${priceRange[1]}
            <X className="h-3 w-3" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={onResetAllFilters}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}

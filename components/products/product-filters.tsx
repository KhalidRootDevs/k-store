'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import type { Brand, Category } from '@/lib/product-data';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  searchQuery: string;
  showFilters: boolean;
  activeFilterCount: number;
  onCategoryChange: (categoryId: string, checked: boolean) => void;
  onBrandChange: (brandId: string, checked: boolean) => void;
  onPriceChange: (value: number[]) => void;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  onToggleFilters: () => void;
  onCloseFilters: () => void;
}

export function ProductFilters({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  searchQuery,
  showFilters,
  activeFilterCount,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onSearchChange,
  onSearchSubmit,
  onResetFilters,
  onApplyFilters,
  onToggleFilters,
  onCloseFilters
}: ProductFiltersProps) {
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    brands: true,
    price: true,
    rating: true
  });

  const toggleFilterSection = (section: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      {/* Mobile filter button */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onToggleFilters}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={`
          fixed inset-0 z-50 transform bg-background transition-transform duration-300 ease-in-out md:hidden
          ${showFilters ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button variant="ghost" size="icon" onClick={onCloseFilters}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <FilterContent
              categories={categories}
              brands={brands}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              priceRange={priceRange}
              searchQuery={searchQuery}
              expandedFilters={expandedFilters}
              toggleFilterSection={toggleFilterSection}
              onCategoryChange={onCategoryChange}
              onBrandChange={onBrandChange}
              onPriceChange={onPriceChange}
              onSearchChange={onSearchChange}
              onSearchSubmit={onSearchSubmit}
              isMobile={true}
            />
          </div>
          <div className="flex gap-2 border-t p-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onResetFilters}
            >
              Reset
            </Button>
            <Button className="flex-1" onClick={onApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar filters */}
      <div className="hidden w-64 flex-shrink-0 md:block">
        <div className="sticky top-24 space-y-6">
          <FilterContent
            categories={categories}
            brands={brands}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            priceRange={priceRange}
            searchQuery={searchQuery}
            expandedFilters={expandedFilters}
            toggleFilterSection={toggleFilterSection}
            onCategoryChange={onCategoryChange}
            onBrandChange={onBrandChange}
            onPriceChange={onPriceChange}
            onSearchChange={onSearchChange}
            onSearchSubmit={onSearchSubmit}
            isMobile={false}
          />
          <Button variant="outline" className="w-full" onClick={onResetFilters}>
            Reset Filters
          </Button>
          <Button className="w-full" onClick={onApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
}

interface FilterContentProps {
  categories: Category[];
  brands: Brand[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  searchQuery: string;
  expandedFilters: {
    categories: boolean;
    brands: boolean;
    price: boolean;
    rating: boolean;
  };
  toggleFilterSection: (section: keyof typeof expandedFilters) => void;
  onCategoryChange: (categoryId: string, checked: boolean) => void;
  onBrandChange: (brandId: string, checked: boolean) => void;
  onPriceChange: (value: number[]) => void;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  isMobile: boolean;
}

function FilterContent({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  searchQuery,
  expandedFilters,
  toggleFilterSection,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onSearchChange,
  onSearchSubmit,
  isMobile
}: FilterContentProps) {
  const prefix = isMobile ? 'mobile-' : '';

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="mb-2 font-medium">Search</h3>
        <form onSubmit={onSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      {/* Categories */}
      <div>
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleFilterSection('categories')}
        >
          <h3 className="font-medium">Categories</h3>
          {expandedFilters.categories ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {expandedFilters.categories && (
          <div className="mt-2 space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${prefix}category-${category.id}`}
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={(checked) =>
                    onCategoryChange(category.slug, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`${prefix}category-${category.id}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {category.name}{' '}
                  <span className="text-muted-foreground">
                    ({category.count})
                  </span>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div>
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleFilterSection('brands')}
        >
          <h3 className="font-medium">Brands</h3>
          {expandedFilters.brands ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {expandedFilters.brands && (
          <div className="mt-2 space-y-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${prefix}brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={(checked) =>
                    onBrandChange(brand.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`${prefix}brand-${brand.id}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {brand.name}{' '}
                  <span className="text-muted-foreground">({brand.count})</span>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleFilterSection('price')}
        >
          <h3 className="font-medium">Price Range</h3>
          {expandedFilters.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {expandedFilters.price && (
          <div className="mt-4 px-2">
            <div className="mb-4">
              <Slider
                defaultValue={[0, 200]}
                value={priceRange}
                max={200}
                step={5}
                onValueChange={onPriceChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Rating */}
      <div>
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleFilterSection('rating')}
        >
          <h3 className="font-medium">Rating</h3>
          {expandedFilters.rating ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {expandedFilters.rating && (
          <div className="mt-2 space-y-2">
            <RadioGroup defaultValue="all">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id={`${prefix}rating-all`} />
                <Label htmlFor={`${prefix}rating-all`}>All Ratings</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4plus" id={`${prefix}rating-4plus`} />
                <Label htmlFor={`${prefix}rating-4plus`}>4★ & Above</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3plus" id={`${prefix}rating-3plus`} />
                <Label htmlFor={`${prefix}rating-3plus`}>3★ & Above</Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
}

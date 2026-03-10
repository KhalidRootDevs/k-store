"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface Brand {
  id: string;
  name: string;
  count: number;
}

interface ProductFilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  searchQuery: string;
  onCategoryChange: (categoryId: string, checked: boolean) => void;
  onBrandChange: (brandId: string, checked: boolean) => void;
  onPriceChange: (value: number[]) => void;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
}

export function ProductFilterSidebar({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  searchQuery,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onSearchChange,
  onSearchSubmit,
  onResetFilters,
  onApplyFilters,
}: ProductFilterSidebarProps) {
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    brands: true,
    price: true,
    rating: true,
  });

  const toggleFilterSection = (section: keyof typeof expandedFilters) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Search</h3>
        <form onSubmit={onSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleFilterSection("categories")}
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
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    onCategoryChange(category.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {category.name}{" "}
                  <span className="text-muted-foreground">
                    ({category.count})
                  </span>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleFilterSection("brands")}
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
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={(checked) =>
                    onBrandChange(brand.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`brand-${brand.id}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {brand.name}{" "}
                  <span className="text-muted-foreground">({brand.count})</span>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleFilterSection("price")}
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

      <div>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleFilterSection("rating")}
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
                <RadioGroupItem value="all" id="rating-all" />
                <Label htmlFor="rating-all">All Ratings</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4plus" id="rating-4plus" />
                <Label htmlFor="rating-4plus">4★ & Above</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3plus" id="rating-3plus" />
                <Label htmlFor="rating-3plus">3★ & Above</Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>

      <Button variant="outline" className="w-full" onClick={onResetFilters}>
        Reset Filters
      </Button>

      <Button className="w-full" onClick={onApplyFilters}>
        Apply Filters
      </Button>
    </div>
  );
}

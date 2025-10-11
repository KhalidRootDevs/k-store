"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ProductFilters } from "@/components/products/product-filters";
import { ActiveFilters } from "@/components/products/active-filters";
import { ProductSorting } from "@/components/products/product-sorting";
import { ProductPagination } from "@/components/products/product-pagination";
import { EmptyProductState } from "@/components/products/empty-product-state";
import { ProductList } from "@/components/products/product-list";
import { sortOptions } from "@/lib/product-data";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/product-card";
import { SkeletonProductCard } from "@/components/skeleton-product-card";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  brand?: string;
  tags: string[];
  stock: number;
  active: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialRender = useRef(true);

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  console.log("products", products);

  // Fetch initial data (categories and brands)
  useEffect(() => {
    async function fetchInitialData() {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.categories || []);
        }

        // You might want to create a separate API for brands
        // For now, we'll extract brands from products
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    }

    fetchInitialData();
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    if (isInitialRender.current) {
      const query = searchParams.get("q") || "";
      const categories =
        searchParams.get("categories")?.split(",").filter(Boolean) || [];
      const brands =
        searchParams.get("brands")?.split(",").filter(Boolean) || [];
      const minPrice = Number(searchParams.get("minPrice") || 0);
      const maxPrice = Number(searchParams.get("maxPrice") || 1000);
      const sort = searchParams.get("sort") || "featured";
      const view = (searchParams.get("view") as "grid" | "list") || "grid";
      const page = Number(searchParams.get("page") || 1);

      setSelectedCategories(categories);
      setSearchQuery(query);
      setSelectedBrands(brands);
      setPriceRange([minPrice, maxPrice]);
      setSortBy(sort);
      setViewMode(view);
      setCurrentPage(page);

      setIsInitialized(true);
      isInitialRender.current = false;
    }
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    async function fetchProducts() {
      if (!isInitialized) return;

      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();

        // Add filters to API request
        if (searchQuery) params.set("search", searchQuery);
        if (selectedCategories.length > 0)
          params.set("categories", selectedCategories.join(","));
        if (selectedBrands.length > 0)
          params.set("brands", selectedBrands.join(","));
        if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
        if (priceRange[1] < 1000)
          params.set("maxPrice", priceRange[1].toString());
        if (sortBy !== "featured") params.set("sort", sortBy);
        params.set("page", currentPage.toString());
        params.set("limit", itemsPerPage.toString());

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products || []);
        setTotalProducts(data.pagination.total);
        setTotalPages(data.pagination.totalPages);

        // Extract brands from products if not already available
        if (data.filters?.brands) {
          setBrands(data.filters.brands);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [
    isInitialized,
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    sortBy,
    currentPage,
    itemsPerPage,
  ]);

  // Update URL with filters
  useEffect(() => {
    if (isInitialized && !isInitialRender.current) {
      const params = new URLSearchParams();

      if (searchQuery) params.set("q", searchQuery);
      else params.delete("q");

      if (selectedCategories.length > 0)
        params.set("categories", selectedCategories.join(","));
      else params.delete("categories");

      if (selectedBrands.length > 0)
        params.set("brands", selectedBrands.join(","));
      else params.delete("brands");

      if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
      else params.delete("minPrice");

      if (priceRange[1] < 1000)
        params.set("maxPrice", priceRange[1].toString());
      else params.delete("maxPrice");

      if (sortBy !== "featured") params.set("sort", sortBy);
      else params.delete("sort");

      if (viewMode !== "grid") params.set("view", viewMode);
      else params.delete("view");

      if (currentPage > 1) params.set("page", currentPage.toString());
      else params.delete("page");

      const newUrl = `/products?${params.toString()}`;
      router.push(newUrl, { scroll: false });
    }
  }, [
    isInitialized,
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    sortBy,
    viewMode,
    router,
    currentPage,
  ]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
    );
    setCurrentPage(1);
  };

  // Handle brand selection
  const handleBrandChange = (brandId: string, checked: boolean) => {
    setSelectedBrands((prev) =>
      checked ? [...prev, brandId] : prev.filter((id) => id !== brandId)
    );
    setCurrentPage(1);
  };

  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setSortBy("featured");
    setCurrentPage(1);
    router.push("/products");
  };

  // Apply filters button
  const handleApplyFilters = () => {
    setShowFilters(false);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Scroll to top of product section
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Count active filters
  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    selectedCategories.length +
    selectedBrands.length +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);

  // Calculate discount for display
  const calculateDiscount = (price: number, compareAtPrice?: number) => {
    if (!compareAtPrice || compareAtPrice <= price) return 0;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  };

  // Check if product is new
  const isNewProduct = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return createdDate > thirtyDaysAgo;
  };

  // Render product content based on loading state and view mode
  const renderProductContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Error loading products</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (products.length === 0) {
      return <EmptyProductState onResetFilters={handleResetFilters} />;
    }

    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name: product.name,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                images: product.images,
                category: product.categoryId?.name,
                brand: product.brand,
                rating: product.rating,
                reviewCount: product.reviewCount,
                salesCount: product.salesCount,
                featured: product.featured,
                active: product.active,
                createdAt: product.createdAt,
                description: product.description,
                stock: product.stock,
              }}
            />
          ))}
        </div>
      );
    } else {
      return (
        <ProductList
          products={products}
          categories={categories}
          brands={brands}
        />
      );
    }
  };

  return (
    <>
      <Container>
        <div className="flex flex-col md:flex-row gap-8">
          <ProductFilters
            categories={categories.map((cat) => ({
              id: cat._id,
              name: cat.name,
              slug: cat.slug,
            }))}
            brands={brands.map((brand) => ({ id: brand, name: brand }))}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            priceRange={priceRange}
            searchQuery={searchQuery}
            showFilters={showFilters}
            activeFilterCount={activeFilterCount}
            onCategoryChange={handleCategoryChange}
            onBrandChange={handleBrandChange}
            onPriceChange={handlePriceChange}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearch}
            onResetFilters={handleResetFilters}
            onApplyFilters={handleApplyFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            onCloseFilters={() => setShowFilters(false)}
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold">Products</h1>
                <p className="text-muted-foreground">
                  {isLoading
                    ? "Loading products..."
                    : `Showing ${products.length} of ${totalProducts} products`}
                </p>
              </div>
              <ProductSorting
                sortBy={sortBy}
                viewMode={viewMode}
                sortOptions={sortOptions}
                onSortChange={handleSortChange}
                onViewModeChange={handleViewModeChange}
              />
            </div>

            <ActiveFilters
              searchQuery={searchQuery}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              priceRange={priceRange}
              categories={categories}
              brands={brands}
              onRemoveSearchQuery={() => setSearchQuery("")}
              onRemoveCategory={handleCategoryChange}
              onRemoveBrand={handleBrandChange}
              onResetPriceRange={() => setPriceRange([0, 1000])}
              onResetAllFilters={handleResetFilters}
            />

            {renderProductContent()}

            {!isLoading && !error && products.length > 0 && (
              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

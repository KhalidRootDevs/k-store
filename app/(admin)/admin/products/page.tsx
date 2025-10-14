"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Plus,
  Search,
  Trash2,
  Loader2,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  categoryId: Category;
  tags: string[];
  stock: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  active: boolean;
  featured: boolean;
  variants: Array<{
    name: string;
    options: string;
    price?: number;
    stock?: number;
    sku?: string;
  }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    featured: "all",
    minPrice: "",
    maxPrice: "",
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories?limit=100", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch products from API
  const fetchProducts = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.category !== "all" && { category: filters.category }),
        ...(filters.status !== "all" && {
          active: filters.status === "active" ? "true" : "false",
        }),
        ...(filters.featured !== "all" && {
          featured: filters.featured === "featured" ? "true" : "false",
        }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      });

      const response = await fetch(`/api/admin/products?${params}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setPagination(
          data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          }
        );
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchCategories();
    fetchProducts(1);
  }, [
    searchTerm,
    filters.category,
    filters.status,
    filters.featured,
    filters.minPrice,
    filters.maxPrice,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage);
    }
  };

  const handleDeleteProduct = async (
    productId: string,
    productName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Product deleted",
          description: `Product "${productName}" has been deleted successfully.`,
        });
        // Refresh the products list - go to first page if current page becomes empty
        if (products.length === 1 && pagination.page > 1) {
          fetchProducts(pagination.page - 1);
        } else {
          fetchProducts(pagination.page);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (
    productId: string,
    currentStatus: boolean,
    productName: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("active", (!currentStatus).toString());

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Status updated",
          description: `Product "${productName}" has been ${
            !currentStatus ? "activated" : "deactivated"
          }.`,
        });
        // Refresh the products list
        fetchProducts(pagination.page);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product status");
      }
    } catch (error: any) {
      console.error("Error updating product status:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update product status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      category: "all",
      status: "all",
      featured: "all",
      minPrice: "",
      maxPrice: "",
    });
  };

  const hasActiveFilters =
    searchTerm ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.featured !== "all" ||
    filters.minPrice ||
    filters.maxPrice;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.page - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getStockStatus = (stock: number, active: boolean) => {
    if (!active) return { text: "Inactive", variant: "secondary" as const };
    if (stock === 0)
      return { text: "Out of Stock", variant: "destructive" as const };
    if (stock < 10)
      return { text: "Low Stock", variant: "destructive" as const };
    return { text: "In Stock", variant: "default" as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product inventory, prices, and details.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            View and manage all products in your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                <div className="flex-1 max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
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
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </form>
            </div>

            {/* Filter Options */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="category-filter" className="text-sm">
                  Category:
                </label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="status-filter" className="text-sm">
                  Status:
                </label>
                <Select
                  value={filters.status}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="featured-filter" className="text-sm">
                  Featured:
                </label>
                <Select
                  value={filters.featured}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, featured: value }))
                  }
                >
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Featured" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="not-featured">Not Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="min-price" className="text-sm">
                  Min Price:
                </label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="Min"
                  className="w-20 h-9"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="max-price" className="text-sm">
                  Max Price:
                </label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="Max"
                  className="w-20 h-9"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Showing {products.length} of {pagination.total} products
              {pagination.totalPages > 1 &&
                ` (Page ${pagination.page} of ${pagination.totalPages})`}
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {pagination.total === 0
                    ? "No products found."
                    : "No products match your filters."}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const stockStatus = getStockStatus(
                        product.stock,
                        product.active
                      );
                      return (
                        <TableRow key={product._id}>
                          <TableCell>
                            <div className="relative h-10 w-10 rounded-md overflow-hidden">
                              <Image
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>
                              {product.name}
                              {product.featured && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground font-mono">
                            {product.sku}
                          </TableCell>
                          <TableCell>
                            {product.categoryId?.name || "Uncategorized"}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                ${product.price.toFixed(2)}
                              </span>
                              {product.compareAtPrice &&
                                product.compareAtPrice > product.price && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    ${product.compareAtPrice.toFixed(2)}
                                  </span>
                                )}
                            </div>
                          </TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleToggleStatus(
                                  product._id,
                                  product.active,
                                  product.name
                                )
                              }
                              className={`h-6 px-2 text-xs ${
                                stockStatus.variant === "destructive"
                                  ? "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
                                  : stockStatus.variant === "secondary"
                                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                                  : "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                              }`}
                            >
                              {stockStatus.text}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/admin/products/edit/${product._id}`}
                              >
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDeleteProduct(product._id, product.name)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        disabled={!pagination.hasPrev}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                        <span className="sr-only">First page</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrev}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                      </Button>

                      {/* Page numbers */}
                      {getPageNumbers().map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === pagination.page ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNext}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.totalPages)}
                        disabled={!pagination.hasNext}
                      >
                        <ChevronsRight className="h-4 w-4" />
                        <span className="sr-only">Last page</span>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

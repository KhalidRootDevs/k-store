"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { routes } from "@/lib/routes";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Filter,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  featured: boolean;
  active: boolean;
  slug: string;
  parentId?: { _id: string; name: string } | null;
  products?: number;
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    featured: "all",
    status: "all",
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch categories from API
  const fetchCategories = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.featured !== "all" && {
          featured: filters.featured === "featured" ? "true" : "false",
        }),
        ...(filters.status !== "all" && {
          active: filters.status === "active" ? "true" : "false",
        }),
      });

      const response = await fetch(`/api/admin/categories?${params}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
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
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchCategories(1);
  }, [searchTerm, filters.featured, filters.status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCategories(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCategories(newPage);
    }
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Category deleted",
          description: `Category "${categoryName}" has been deleted successfully.`,
        });
        // Refresh the categories list - go to first page if current page becomes empty
        if (categories.length === 1 && pagination.page > 1) {
          fetchCategories(pagination.page - 1);
        } else {
          fetchCategories(pagination.page);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (
    categoryId: string,
    currentStatus: boolean,
    categoryName: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("active", (!currentStatus).toString());

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Status updated",
          description: `Category "${categoryName}" has been ${
            !currentStatus ? "activated" : "deactivated"
          }.`,
        });
        // Refresh the categories list
        fetchCategories(pagination.page);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update category status");
      }
    } catch (error: any) {
      console.error("Error updating category status:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to update category status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      featured: "all",
      status: "all",
    });
  };

  const hasActiveFilters =
    searchTerm || filters.featured !== "all" || filters.status !== "all";

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.page - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage product categories for your store.
          </p>
        </div>
        <Link href={routes.privateRoutes.admin.category.create}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            View and manage all product categories and sub-categories.
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
                      placeholder="Search categories..."
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
                <label htmlFor="featured-filter" className="text-sm">
                  Featured:
                </label>
                <select
                  id="featured-filter"
                  className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={filters.featured}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      featured: e.target.value,
                    }))
                  }
                >
                  <option value="all">All</option>
                  <option value="featured">Featured</option>
                  <option value="not-featured">Not Featured</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="status-filter" className="text-sm">
                  Status:
                </label>
                <select
                  id="status-filter"
                  className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Showing {categories.length} of {pagination.total} categories
              {pagination.totalPages > 1 &&
                ` (Page ${pagination.page} of ${pagination.totalPages})`}
            </div>
          </div>

          {/* Categories Table */}
          <div className="rounded-md border">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {pagination.total === 0
                    ? "No categories found."
                    : "No categories match your filters."}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    className="mt-2 bg-transparent"
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
                      <TableHead className="hidden lg:table-cell">
                        Parent Category
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Description
                      </TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Featured
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>
                          <div className="relative h-10 w-10 rounded-md overflow-hidden">
                            <Image
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {category.parentId && (
                            <span className="text-muted-foreground mr-2">
                              └─
                            </span>
                          )}
                          {category.name}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {category.parentId ? (
                            <Badge variant="outline">
                              {category.parentId.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Top Level
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                          {category.description || "No description"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {category.slug}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {category.featured ? (
                            <Badge variant="secondary">Featured</Badge>
                          ) : (
                            <Badge variant="outline">Regular</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleToggleStatus(
                                category._id,
                                category.active,
                                category.name
                              )
                            }
                            className={`h-6 px-2 text-xs ${
                              category.active
                                ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                                : "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
                            }`}
                          >
                            {category.active ? "Active" : "Inactive"}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/categories/edit/${category._id}`}
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
                                handleDeleteCategory(
                                  category._id,
                                  category.name
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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

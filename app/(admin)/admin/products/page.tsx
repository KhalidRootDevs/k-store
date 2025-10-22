"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/tables/data-table";
import { createProductColumns } from "@/components/tables/product/column";
import { Product } from "@/models/Product";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const searchTerm = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const featuredFilter = searchParams.get("featured") || "all";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const currentPage = Number.parseInt(searchParams.get("page") || "1");
  const currentPageSize = Number.parseInt(searchParams.get("pageSize") || "10");

  const isFetchingRef = useRef(false);

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
    }
  };

  const fetchProducts = useCallback(
    async (page: number, pageSize: number) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        });

        if (searchTerm) params.append("search", searchTerm);

        if (categoryFilter && categoryFilter !== "all") {
          params.append("category", categoryFilter);
        }

        if (statusFilter && statusFilter !== "all") {
          if (statusFilter === "active") {
            params.append("active", "true");
          } else if (statusFilter === "inactive") {
            params.append("active", "false");
          }
        }

        if (featuredFilter && featuredFilter !== "all") {
          if (featuredFilter === "featured" || featuredFilter === "true") {
            params.append("featured", "true");
          } else if (
            featuredFilter === "not-featured" ||
            featuredFilter === "false"
          ) {
            params.append("featured", "false");
          }
        }

        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);

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
        isFetchingRef.current = false;
      }
    },
    [
      searchTerm,
      categoryFilter,
      statusFilter,
      featuredFilter,
      minPrice,
      maxPrice,
    ]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, currentPageSize);
  }, [fetchProducts, currentPage, currentPageSize]);

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
        fetchProducts(currentPage, currentPageSize);
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
        fetchProducts(currentPage, currentPageSize);
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

  const columns = createProductColumns(handleDeleteProduct, handleToggleStatus);

  const filterOptions = [
    {
      name: "category",
      options: [
        { value: "all", label: "All Categories" },
        ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
      ],
    },
    {
      name: "status",
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      name: "featured",
      options: [
        { value: "all", label: "All" },
        { value: "featured", label: "Featured" },
        { value: "not-featured", label: "Not Featured" },
      ],
    },
  ];

  const rangeFilters = [
    {
      name: "minPrice",
      label: "Min Price",
      placeholder: "Min",
      type: "number" as const,
    },
    {
      name: "maxPrice",
      label: "Max Price",
      placeholder: "Max",
      type: "number" as const,
    },
  ];

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
          <DataTable
            columns={columns}
            data={products}
            search={true}
            searchPlaceholder="Search products..."
            filters={filterOptions}
            loading={isLoading}
            paginationData={{
              total: pagination.total,
              pageCount: pagination.totalPages,
              page: pagination.page,
              pageSize: pagination.limit,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

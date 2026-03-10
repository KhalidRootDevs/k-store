"use client";

import DeleteModal from "@/components/custom/delete-modal";
import { DataTable } from "@/components/tables/data-table";
import { createCategoryColumns } from "@/components/tables/category/column";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { routes } from "@/lib/routes";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Category, PaginationInfo } from "@/types";

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 30,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const isFetchingRef = useRef(false);

  const searchTerm = searchParams.get("search") || "";
  const featuredFilter = searchParams.get("featured") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentPageSize = Number(searchParams.get("pageSize")) || 10;

  const fetchCategories = useCallback(
    async (page = 1, pageSize = 30) => {
      if (isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (searchTerm) {
          params.append("search", searchTerm);
        }

        if (featuredFilter && featuredFilter !== "all") {
          // Handle both the filter option values and direct boolean string values
          if (featuredFilter === "featured" || featuredFilter === "true") {
            params.append("featured", "true");
          } else if (
            featuredFilter === "not-featured" ||
            featuredFilter === "false"
          ) {
            params.append("featured", "false");
          }
        }

        if (statusFilter && statusFilter !== "all") {
          params.append("active", statusFilter === "active" ? "true" : "false");
        }

        const response = await fetch(`/api/admin/categories?${params}`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
          setPagination(
            data.pagination || {
              page: page,
              limit: pageSize,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
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
        isFetchingRef.current = false;
      }
    },
    [searchTerm, featuredFilter, statusFilter],
  );

  useEffect(() => {
    fetchCategories(currentPage, currentPageSize);
  }, [fetchCategories, currentPage, currentPageSize]);

  const handleDeleteCategory = async (categoryId: string | null) => {
    try {
      if (categoryId === null) return;

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        if (categories.length === 1 && pagination.page > 1) {
          fetchCategories(pagination.page - 1, pagination.limit);
        } else {
          fetchCategories(pagination.page, pagination.limit);
        }

        setDeleteCategoryId(null);
        setDeleteModal(false);

        toast({
          title: "Success",
          description: "Category deleted successfully.",
        });
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
    categoryName: string,
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
        fetchCategories(pagination.page, pagination.limit);
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

  const handleReorder = async (newData: Category[]) => {
    try {
      const categoryIds = newData.map((category) => category._id);

      const response = await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryIds }),
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Categories reordered successfully.",
        });
        setCategories(newData);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reorder categories");
      }
    } catch (error: any) {
      console.error("Error reordering categories:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to reorder categories. Please try again.",
        variant: "destructive",
      });
      fetchCategories(pagination.page, pagination.limit);
    }
  };

  const columns = createCategoryColumns((id) => {
    setDeleteCategoryId(id);
    setDeleteModal(true);
  }, handleToggleStatus);

  const filterOptions = [
    {
      name: "featured",
      label: "Featured",
      options: [
        { value: "all", label: "All" },
        { value: "featured", label: "Featured" },
        { value: "not-featured", label: "Not Featured" },
      ],
    },
    {
      name: "status",
      label: "Status",
      options: [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

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
          <DataTable
            columns={columns}
            data={categories}
            search={true}
            searchPlaceholder="Search categories..."
            filters={filterOptions}
            paginationData={{
              total: pagination.total,
              pageCount: pagination.totalPages,
              page: pagination.page,
              pageSize: pagination.limit,
            }}
            loading={isLoading}
            enableRowOrdering={true}
            dragEnd={handleReorder}
          />
        </CardContent>
      </Card>

      <DeleteModal
        open={deleteModal}
        setOpen={setDeleteModal}
        action={() => handleDeleteCategory(deleteCategoryId)}
      />
    </div>
  );
}

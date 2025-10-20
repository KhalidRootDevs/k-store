"use client"

import DeleteModal from "@/components/custom/delete-modal"
import { DataTable } from "@/components/tables/data-table"
import { createCategoryColumns } from "@/components/tables/category/column"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { routes } from "@/lib/routes"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface Category {
  _id: string
  name: string
  description: string
  image: string
  featured: boolean
  active: boolean
  slug: string
  parentId?: { _id: string; name: string } | null
  products?: number
  order: number
  createdAt: string
  updatedAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function CategoriesPage() {
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

  const searchTerm = searchParams.get("search") || ""
  const featuredFilter = searchParams.get("featured") || "all"
  const statusFilter = searchParams.get("status") || "all"
  const currentPage = Number(searchParams.get("page")) || 1

  // Fetch categories from API
  const fetchCategories = async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      if (featuredFilter && featuredFilter !== "all") {
        params.append("featured", featuredFilter === "featured" ? "true" : "false")
      }

      if (statusFilter && statusFilter !== "all") {
        params.append("active", statusFilter === "active" ? "true" : "false")
      }

      const response = await fetch(`/api/admin/categories?${params}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
        setPagination(
          data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        )
      } else {
        throw new Error("Failed to fetch categories")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories(currentPage)
  }, [searchTerm, featuredFilter, statusFilter, currentPage])

  const handleDeleteCategory = async (categoryId: string | null) => {
    try {
      if (categoryId === null) return

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        // Refresh the categories list - go to first page if current page becomes empty
        if (categories.length === 1 && pagination.page > 1) {
          fetchCategories(pagination.page - 1)
        } else {
          fetchCategories(pagination.page)
        }

        setDeleteCategoryId(null)
        setDeleteModal(false)

        toast({
          title: "Success",
          description: "Category deleted successfully.",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete category")
      }
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (categoryId: string, currentStatus: boolean, categoryName: string) => {
    try {
      const formData = new FormData()
      formData.append("active", (!currentStatus).toString())

      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      })

      if (response.ok) {
        toast({
          title: "Status updated",
          description: `Category "${categoryName}" has been ${!currentStatus ? "activated" : "deactivated"}.`,
        })
        // Refresh the categories list
        fetchCategories(pagination.page)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update category status")
      }
    } catch (error: any) {
      console.error("Error updating category status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update category status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReorder = async (newData: Category[]) => {
    try {
      // Extract category IDs in the new order
      const categoryIds = newData.map((category) => category._id)

      const response = await fetch("/api/admin/categories/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryIds }),
        credentials: "include",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Categories reordered successfully.",
        })
        // Update local state with new order
        setCategories(newData)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reorder categories")
      }
    } catch (error: any) {
      console.error("Error reordering categories:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to reorder categories. Please try again.",
        variant: "destructive",
      })
      // Revert to original order on error
      fetchCategories(pagination.page)
    }
  }

  const columns = createCategoryColumns((id) => {
    setDeleteCategoryId(id)
    setDeleteModal(true)
  }, handleToggleStatus)

  const filterOptions = {
    featured: [
      { value: "all", label: "All" },
      { value: "featured", label: "Featured" },
      { value: "not-featured", label: "Not Featured" },
    ],
    status: [
      { value: "all", label: "All" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage product categories for your store.</p>
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
          <CardDescription>View and manage all product categories and sub-categories.</CardDescription>
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

      <DeleteModal open={deleteModal} setOpen={setDeleteModal} action={() => handleDeleteCategory(deleteCategoryId)} />
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ProductPagination({ currentPage, totalPages, onPageChange }: ProductPaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []

    // Always show first page
    pages.push(1)

    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("ellipsis-start")
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis-end")
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {pageNumbers.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <Button key={`ellipsis-${index}`} variant="ghost" size="sm" className="h-8 w-8" disabled>
                ...
              </Button>
            )
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "outline" : "ghost"}
              size="sm"
              className="h-8 w-8"
              onClick={() => onPageChange(page as number)}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  )
}

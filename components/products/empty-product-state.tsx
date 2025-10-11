"use client"

import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"

interface EmptyProductStateProps {
  onResetFilters: () => void
}

export function EmptyProductState({ onResetFilters }: EmptyProductStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No products found</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any products matching your current filters. Try adjusting your search or filter criteria.
      </p>
      <Button onClick={onResetFilters}>Reset Filters</Button>
    </div>
  )
}

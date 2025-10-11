import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonProductCard() {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <Skeleton className="h-full w-full" />
        </div>
      </div>

      <CardContent className="p-3">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/4 mb-2" />
        <div className="flex justify-between items-center mt-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

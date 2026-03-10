import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonProductCard() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Skeleton className="h-full w-full" />
        </div>
      </div>

      <CardContent className="p-3">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="mb-2 h-4 w-1/2" />
        <Skeleton className="mb-2 h-4 w-1/4" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

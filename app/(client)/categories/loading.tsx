import { Container } from "@/components/ui/container"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-12">
        <Container>
          <div className="mb-8">
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-5 w-2/3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="h-full overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </main>
    </div>
  )
}

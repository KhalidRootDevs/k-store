import { ProductCard } from "@/components/product-card"

interface Product {
  id: number
  name: string
  price: number
  discount?: number
  image: string
  category: string
  brand: string
  rating: number
  isBestSeller?: boolean
  isNew?: boolean
  dateAdded: string
}

interface Category {
  id: string
  name: string
}

interface ProductGridProps {
  products: Product[]
  categories: Category[]
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <div key={product.id} className="group">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

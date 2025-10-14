import { categories } from "@/lib/product-data"
import Image from "next/image"
import Link from "next/link"

export function FeaturedCategories() {
  // Get the top 6 categories with the highest product count
  const featuredCategories = [...categories].sort((a, b) => b.count - a.count).slice(0, 6)

  return (
    <div className="py-12">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Shop by Category</h2>
        <p className="mt-4 text-base text-gray-500">Browse our top product categories</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {featuredCategories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className="group flex flex-col items-center"
          >
            <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full bg-gray-100 sm:h-32 sm:w-32">
              <Image
                src={`/placeholder.svg?height=150&width=150&text=${category.name.charAt(0)}`}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <h3 className="text-center text-sm font-medium text-gray-900 group-hover:text-primary sm:text-base">
              {category.name}
            </h3>
            <p className="text-center text-xs text-gray-500 sm:text-sm">{category.count} products</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/categories"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          View All Categories
        </Link>
      </div>
    </div>
  )
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { Product, Category, Brand } from '@/lib/product-data';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}

export function ProductList({
  products,
  categories,
  brands
}: ProductListProps) {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden transition-shadow hover:shadow-lg"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="relative h-48 flex-shrink-0 sm:h-auto sm:w-48">
              <Image
                src={product.image || '/placeholder.svg?height=200&width=200'}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.discount > 0 && (
                <div className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  {product.discount}% OFF
                </div>
              )}
              {product.isNew && (
                <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                  NEW
                </div>
              )}
            </div>
            <div className="flex-1 p-4">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {categories.find((c) => c.id === product.category)?.name}
                  </p>
                  <div className="mt-1 flex items-center">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-muted-foreground">
                      ({product.rating})
                    </span>
                  </div>
                </div>
                <div>
                  {product.discount > 0 ? (
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold">
                        $
                        {(product.price * (1 - product.discount / 100)).toFixed(
                          2
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                A high-quality product with excellent features and durability.
                Perfect for everyday use and special occasions.
              </p>
              <div className="mt-4 flex items-center gap-2">
                {product.isBestSeller && (
                  <div className="rounded bg-amber-500 px-2 py-1 text-xs font-bold text-white">
                    BEST SELLER
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Brand: {brands.find((b) => b.id === product.brand)?.name}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/products/${product.id}`}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  View Details
                </Link>
                <button
                  className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add to cart functionality would go here
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

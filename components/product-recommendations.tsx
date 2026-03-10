'use client';

import type React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { WishlistButton } from '@/components/wishlist-button';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types';

interface ProductRecommendationsProps {
  productId: string;
  category: string;
}

export function ProductRecommendations({
  productId,
  category
}: ProductRecommendationsProps) {
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch related products from API
  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/products/${productId}/related?limit=4`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch related products');
        }

        const data = await response.json();
        setRecommendedProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching related products:', err);

        // Fallback: Fetch featured products if related products fail
        try {
          const fallbackResponse = await fetch(
            '/api/products?type=featured&limit=4'
          );
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setRecommendedProducts(fallbackData.products || []);
          }
        } catch (fallbackErr) {
          console.error('Fallback fetch also failed:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchRelatedProducts();
    }
  }, [productId]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(product._id);

    // Simulate a slight delay for better UX
    setTimeout(() => {
      addItem({
        id: Date.now().toString(),
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0],
        variant: 'Default'
      });

      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart.`
      });

      setIsAddingToCart(null);
    }, 600);
  };

  // Calculate discount percentage
  const calculateDiscount = (price: number, compareAtPrice?: number) => {
    if (!compareAtPrice || compareAtPrice <= price) return 0;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  };

  // Check if product is new (created within last 30 days)
  const isNewProduct = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return createdDate > thirtyDaysAgo;
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-8">
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="group h-full overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-3">
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-2 h-3 w-1/2" />
                <Skeleton className="mb-2 h-4 w-1/3" />
                <Skeleton className="mt-2 h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Don't show anything if no recommendations
  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recommendedProducts.map((product) => {
          const discount = calculateDiscount(
            product.price,
            product.compareAtPrice
          );
          const isNew = isNewProduct(product.createdAt);
          const isBestSeller = product.salesCount > 100;

          return (
            <Card
              key={product._id}
              className="group h-full overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="relative">
                <Link href={`/products/${product._id}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />

                    {/* Badges */}
                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                      {discount > 0 && (
                        <Badge className="bg-red-500 text-xs hover:bg-red-600">
                          {discount}% OFF
                        </Badge>
                      )}
                      {isNew && (
                        <Badge className="bg-green-500 text-xs hover:bg-green-600">
                          New
                        </Badge>
                      )}
                      {isBestSeller && (
                        <Badge className="bg-amber-500 text-xs hover:bg-amber-600">
                          Best Seller
                        </Badge>
                      )}
                    </div>

                    {/* Rating badge */}
                    {product.rating >= 4 && (
                      <Badge className="absolute right-2 top-2 bg-blue-500 text-xs hover:bg-blue-600">
                        ⭐ {product.rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </Link>

                <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <WishlistButton
                    product={{
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0],
                      category: product.categoryId?.name
                    }}
                  />
                </div>
              </div>

              <CardContent className="p-3">
                <Link href={`/products/${product._id}`}>
                  <h3 className="mb-1 line-clamp-2 text-sm font-medium transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                </Link>

                <p className="mb-2 text-xs text-muted-foreground">
                  {product.categoryId?.name}
                </p>

                {/* Star Rating */}
                <div className="mb-2 flex items-center">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating)
                            ? 'fill-current text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({product.rating.toFixed(1)})
                  </span>
                  {product.reviewCount > 0 && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      · {product.reviewCount} reviews
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-2">
                  {discount > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-green-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ${product.compareAtPrice?.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-full text-xs"
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={isAddingToCart === product._id || !product.active}
                >
                  {isAddingToCart === product._id ? (
                    <>
                      <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-1 h-3 w-3" />
                      {product.active ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Error message (optional) */}
      {error && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Showing featured products instead
        </div>
      )}
    </div>
  );
}

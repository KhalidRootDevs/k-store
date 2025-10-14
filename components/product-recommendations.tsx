"use client";

import type React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { WishlistButton } from "@/components/wishlist-button";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  rating: number;
  reviewCount: number;
  salesCount: number;
  featured: boolean;
  active: boolean;
  createdAt: string;
}

interface ProductRecommendationsProps {
  productId: string;
  category: string;
}

export function ProductRecommendations({
  productId,
  category,
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
          throw new Error("Failed to fetch related products");
        }

        const data = await response.json();
        setRecommendedProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching related products:", err);

        // Fallback: Fetch featured products if related products fail
        try {
          const fallbackResponse = await fetch(
            "/api/products?type=featured&limit=4"
          );
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setRecommendedProducts(fallbackData.products || []);
          }
        } catch (fallbackErr) {
          console.error("Fallback fetch also failed:", fallbackErr);
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
        variant: "Default",
      });

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
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
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden group h-full">
              <div className="aspect-square relative overflow-hidden bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-8 w-full mt-2" />
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
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              className="overflow-hidden group h-full hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <Link href={`/products/${product._id}`}>
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {discount > 0 && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-xs">
                          {discount}% OFF
                        </Badge>
                      )}
                      {isNew && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                          New
                        </Badge>
                      )}
                      {isBestSeller && (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">
                          Best Seller
                        </Badge>
                      )}
                    </div>

                    {/* Rating badge */}
                    {product.rating >= 4 && (
                      <Badge className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-xs">
                        ⭐ {product.rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </Link>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <WishlistButton
                    product={{
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0],
                      category: product.categoryId?.name,
                    }}
                  />
                </div>
              </div>

              <CardContent className="p-3">
                <Link href={`/products/${product._id}`}>
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-xs text-muted-foreground mb-2">
                  {product.categoryId?.name}
                </p>

                {/* Star Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
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
                  className="w-full h-8 text-xs"
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={isAddingToCart === product._id || !product.active}
                >
                  {isAddingToCart === product._id ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-1 h-3 w-3" />
                      {product.active ? "Add to Cart" : "Out of Stock"}
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
        <div className="text-center text-sm text-muted-foreground mt-4">
          Showing featured products instead
        </div>
      )}
    </div>
  );
}

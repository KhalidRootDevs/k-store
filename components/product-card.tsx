"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { WishlistButton } from "@/components/wishlist-button";
import { toast } from "@/components/ui/use-toast";
import { ProductCardProps } from "@/types";

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const calculateDiscount = () => {
    if (!product.compareAtPrice || product.compareAtPrice <= product.price)
      return 0;
    return Math.round(
      ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
    );
  };

  const isNewProduct = () => {
    const createdDate = new Date(product.createdAt);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return createdDate > thirtyDaysAgo;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.active) return;

    setIsAddingToCart(true);

    setTimeout(() => {
      addItem({
        id: Date.now().toString(),
        productId: product.id,
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

      setIsAddingToCart(false);
    }, 600);
  };

  const discount = calculateDiscount();
  const isNew = isNewProduct();
  const isBestSeller = product.salesCount > 100;

  return (
    <Card className="overflow-hidden group h-full hover:shadow-lg transition-shadow">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
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
              {!product.active && (
                <Badge className="bg-gray-500 hover:bg-gray-600 text-xs">
                  Out of Stock
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
          <WishlistButton product={product} />
        </div>
      </div>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground mb-2">
          {product.brand && `${product.brand} • `}
          {product.category}
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
        </div>

        {/* Price */}
        <div className="mb-3">
          {discount > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${product.compareAtPrice?.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-base font-bold">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full"
          size="sm"
          onClick={handleAddToCart}
          disabled={isAddingToCart || !product.active}
        >
          {isAddingToCart ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1 h-4 w-4" />
              {product.active ? "Add to Cart" : "Out of Stock"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

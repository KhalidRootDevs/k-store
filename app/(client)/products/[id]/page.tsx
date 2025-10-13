"use client";

import type React from "react";

import { useCart } from "@/context/cart-context";
import { useRecentlyViewed } from "@/context/recently-viewed-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/container";
import { WishlistButton } from "@/components/wishlist-button";
import { RecentlyViewed } from "@/components/recently-viewed";
import { ProductRecommendations } from "@/components/product-recommendations";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku?: string;
  barcode?: string;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  stock: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  active: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  salesCount: number;
  variants: Array<{
    name: string;
    options: string;
    price?: number;
    stock?: number;
    sku?: string;
  }>;
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface GroupedVariant {
  name: string;
  options: string[];
  prices?: number[];
  stocks?: number[];
  skus?: string[];
}

// Mock reviews data (you can replace this with an API later)
const mockReviews: Review[] = [
  {
    id: "1",
    user: "John D.",
    rating: 5,
    comment:
      "Great quality product. Fits perfectly and the material is very comfortable.",
    date: "2023-05-15",
  },
  {
    id: "2",
    user: "Sarah M.",
    rating: 4,
    comment: "Nice product, good quality. Exactly as described.",
    date: "2023-04-22",
  },
  {
    id: "3",
    user: "Michael P.",
    rating: 5,
    comment: "Excellent product. This is my third purchase!",
    date: "2023-03-10",
  },
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart();
  const { addItem: addToRecentlyViewed } = useRecentlyViewed();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [activeImage, setActiveImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Group variants by name
  const groupedVariants = useMemo((): GroupedVariant[] => {
    if (!product?.variants) return [];

    const grouped: Record<string, GroupedVariant> = {};

    product.variants.forEach((variant) => {
      if (!grouped[variant.name]) {
        grouped[variant.name] = {
          name: variant.name,
          options: [],
          prices: [],
          stocks: [],
          skus: [],
        };
      }

      // Split options by comma and trim each option
      const variantOptions = variant.options
        .split(",")
        .map((opt) => opt.trim());

      grouped[variant.name].options.push(...variantOptions);

      if (variant.price) {
        grouped[variant.name].prices?.push(variant.price);
      }
      if (variant.stock) {
        grouped[variant.name].stocks?.push(variant.stock);
      }
      if (variant.sku) {
        grouped[variant.name].skus?.push(variant.sku);
      }
    });

    // Remove duplicates from options and return as array
    return Object.values(grouped).map((group) => ({
      ...group,
      options: [...new Set(group.options)], // Remove duplicate options
    }));
  }, [product?.variants]);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Product not found");
          }
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data.product);

        // Add to recently viewed
        addToRecentlyViewed({
          id: data.product._id,
          name: data.product.name,
          price: data.product.price,
          image: data.product.images[0],
          category: data.product.categoryId?.name,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, addToRecentlyViewed]);

  // Handle quantity changes
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Handle variant selection
  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [variantName]: option,
    }));
  };

  // Check if all required variants are selected
  const areAllVariantsSelected = () => {
    if (!groupedVariants || groupedVariants.length === 0) return true;
    return groupedVariants.every((variant) => selectedOptions[variant.name]);
  };

  // Format selected variants for display
  const formatSelectedVariants = () => {
    if (!groupedVariants || groupedVariants.length === 0) return "";
    return Object.entries(selectedOptions)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  // Handle image zoom
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!product?.compareAtPrice || product.compareAtPrice <= product.price)
      return 0;
    return Math.round(
      ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
    );
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;

    if (!areAllVariantsSelected()) {
      toast({
        title: "Please select all options",
        description:
          "You need to select all product options before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);

    // Simulate a slight delay for better UX
    setTimeout(() => {
      addItem({
        id: Date.now().toString(),
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0],
        variant: formatSelectedVariants(),
        selectedOptions,
      });

      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} has been added to your cart.`,
      });

      setIsAddingToCart(false);
    }, 600);
  };

  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout after a short delay
    setTimeout(() => {
      router.push("/checkout");
    }, 800);
  };

  // Loading state
  if (loading) {
    return (
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </Container>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Container>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Button onClick={() => router.push("/products")}>
            Browse Products
          </Button>
        </div>
      </Container>
    );
  }

  const discount = calculateDiscount();
  const isInStock = product.stock > 0;

  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div
            className="relative aspect-square overflow-hidden rounded-lg border"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleImageMouseMove}
          >
            <div
              className={`absolute inset-0 transition-transform duration-200 ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
              style={
                isZoomed
                  ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                  : undefined
              }
            >
              <Image
                src={product.images[activeImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {isZoomed && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs py-1 px-3 rounded-full">
                Hover to zoom
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square cursor-pointer overflow-hidden rounded-md border ${
                  activeImage === index ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">
              Category: {product.categoryId?.name}
            </p>
            {product.sku && (
              <p className="text-sm text-muted-foreground">
                SKU: {product.sku}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            {discount > 0 ? (
              <>
                <span className="text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ${product.compareAtPrice?.toFixed(2)}
                </span>
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                  {discount}% OFF
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Grouped Variants */}
          <div className="space-y-4">
            {groupedVariants.map((variant, index) => (
              <div key={index}>
                <h3 className="font-medium mb-2">{variant.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option, optionIndex) => (
                    <Button
                      key={optionIndex}
                      variant={
                        selectedOptions[variant.name] === option
                          ? "default"
                          : "outline"
                      }
                      className="h-10 px-4"
                      onClick={() => handleVariantSelect(variant.name, option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h3 className="font-medium mr-4">Quantity</h3>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
              <span className="ml-4 text-sm text-muted-foreground">
                {product.stock} available
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !isInStock}
              >
                {isAddingToCart ? (
                  <div className="flex items-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Adding...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {isInStock ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                size="lg"
                onClick={handleBuyNow}
                disabled={isAddingToCart || !isInStock}
              >
                Buy Now
              </Button>
              <WishlistButton
                product={{
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.images[0],
                  category: product.categoryId?.name,
                }}
                variant="icon"
                size="lg"
                className="h-12 w-12"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="rounded-md bg-muted p-4 text-sm space-y-2">
            <p className="font-medium">
              Availability: {isInStock ? "In Stock" : "Out of Stock"}
            </p>
            {product.weight && <p>Weight: {product.weight} kg</p>}
            <p>Free shipping on orders over $50</p>
            <p>30-day return policy</p>
          </div>
        </div>
      </div>

      <Separator className="my-10" />

      {/* Product Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({mockReviews.length})
          </TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="py-4">
          <div className="prose max-w-none">
            <p>{product.description}</p>
            {product.tags.length > 0 && (
              <div className="mt-4">
                <strong>Tags:</strong> {product.tags.join(", ")}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="py-4">
          <div className="space-y-6">
            {mockReviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{review.user}</p>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-2">{review.comment}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Shipping Policy</h3>
              <p className="mt-2">
                We offer free standard shipping on all orders over $50. Orders
                under $50 will be charged a flat rate of $5.99 for shipping.
                Standard shipping typically takes 3-5 business days. Express
                shipping is available for an additional fee.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Return Policy</h3>
              <p className="mt-2">
                We accept returns within 30 days of purchase. Items must be
                unused and in their original packaging. Return shipping is free
                for defective items. For non-defective items, a return shipping
                fee may apply.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="py-4">
          <div className="space-y-4">
            {product.weight && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Weight</span>
                <span>{product.weight} kg</span>
              </div>
            )}
            {product.length && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Length</span>
                <span>{product.length} cm</span>
              </div>
            )}
            {product.width && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Width</span>
                <span>{product.width} cm</span>
              </div>
            )}
            {product.height && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Height</span>
                <span>{product.height} cm</span>
              </div>
            )}
            {product.sku && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">SKU</span>
                <span>{product.sku}</span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Product Recommendations */}
      <ProductRecommendations
        productId={product._id}
        category={product.categoryId?.name}
      />

      {/* Recently Viewed Products */}
      <RecentlyViewed />
    </Container>
  );
}

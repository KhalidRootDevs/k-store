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

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    category: string;
    brand?: string;
    rating: number;
    reviewCount: number;
    salesCount: number;
    featured: boolean;
    active: boolean;
    createdAt: string;
    description: string;
    stock: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const calculateDiscount = () => {
    if (!product.compareAtPrice || product.compareAtPrice <= product.price)
      return 0;
    return Math.round(
      ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
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

// "use client";

// import type React from "react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Eye, ShoppingCart } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import { WishlistButton } from "@/components/wishlist-button";
// import { ProductQuickView } from "@/components/product-quick-view";
// import { useCart } from "@/context/cart-context";
// import { toast } from "@/components/ui/use-toast";
// import { cn } from "@/lib/utils";

// interface ProductCardProps {
//   product: {
//     id: number;
//     name: string;
//     price: number;
//     discount?: number;
//     image: string;
//     category: string;
//     rating?: number;
//     isNew?: boolean;
//     isBestSeller?: boolean;
//   };
//   className?: string;
// }

// export function ProductCard({ product, className }: ProductCardProps) {
//   const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [isImageLoaded, setIsImageLoaded] = useState(false);
//   const { addItem } = useCart();

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     setIsAddingToCart(true);

//     // Simulate a slight delay for better UX
//     setTimeout(() => {
//       addItem({
//         id: Date.now(),
//         productId: product.id,
//         name: product.name,
//         price: product.discount
//           ? product.price * (1 - product.discount / 100)
//           : product.price,
//         quantity: 1,
//         image: product.image,
//         variant: "Default",
//       });

//       toast({
//         title: "Added to cart",
//         description: `${product.name} has been added to your cart.`,
//       });

//       setIsAddingToCart(false);
//     }, 600);
//   };

//   const openQuickView = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsQuickViewOpen(true);
//   };

//   const discountedPrice = product.discount
//     ? product.price * (1 - product.discount / 100)
//     : product.price;

//   return (
//     <>
//       <Card
//         className={cn(
//           "overflow-hidden h-full transition-all duration-300 hover:shadow-md",
//           className
//         )}
//       >
//         <div className="relative">
//           <Link href={`/products/${product.id}`} className="block">
//             <div className="aspect-square relative overflow-hidden bg-muted">
//               <div
//                 className={cn(
//                   "absolute inset-0 bg-gray-100 animate-pulse",
//                   isImageLoaded ? "opacity-0" : "opacity-100"
//                 )}
//               />
//               <Image
//                 src={product.image || "/placeholder.svg"}
//                 alt={product.name}
//                 fill
//                 className={cn(
//                   "object-cover transition-all duration-300 hover:scale-105",
//                   isImageLoaded ? "opacity-100" : "opacity-0"
//                 )}
//                 onLoad={() => setIsImageLoaded(true)}
//               />

//               {/* Product badges */}
//               <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
//                 {product.discount && product.discount > 0 && (
//                   <Badge className="bg-red-500 text-white">
//                     {product.discount}% OFF
//                   </Badge>
//                 )}
//               </div>

//               <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
//                 {product.isNew && (
//                   <Badge variant="outline" className="bg-white">
//                     New
//                   </Badge>
//                 )}

//                 {product.isBestSeller && (
//                   <Badge className="bg-amber-500 text-white">Best Seller</Badge>
//                 )}
//               </div>
//             </div>
//           </Link>

//           {/* Quick actions - visible on hover for desktop, always visible for mobile but at bottom */}
//           <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity flex justify-center gap-2 md:translate-y-0 md:group-hover:translate-y-0 md:transition-all">
//             <Button
//               variant="secondary"
//               size="sm"
//               className="rounded-full text-xs"
//               onClick={openQuickView}
//             >
//               <Eye className="mr-1 h-3 w-3" />
//               <span className="hidden sm:inline">Quick View</span>
//             </Button>

//             <Button
//               variant="secondary"
//               size="sm"
//               className="rounded-full text-xs"
//               onClick={handleAddToCart}
//               disabled={isAddingToCart}
//             >
//               {isAddingToCart ? (
//                 <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" />
//               ) : (
//                 <ShoppingCart className="mr-1 h-3 w-3" />
//               )}
//               <span className="hidden sm:inline">Add to Cart</span>
//             </Button>
//           </div>

//           {/* Mobile-friendly action buttons - always visible on mobile */}
//           <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent md:opacity-0 flex justify-center gap-2 transition-all duration-300 md:hidden">
//             <Button
//               variant="secondary"
//               size="icon"
//               className="h-8 w-8 rounded-full"
//               onClick={openQuickView}
//             >
//               <Eye className="h-4 w-4" />
//             </Button>

//             <Button
//               variant="secondary"
//               size="icon"
//               className="h-8 w-8 rounded-full"
//               onClick={handleAddToCart}
//               disabled={isAddingToCart}
//             >
//               {isAddingToCart ? (
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//               ) : (
//                 <ShoppingCart className="h-4 w-4" />
//               )}
//             </Button>

//             <WishlistButton
//               product={product}
//               variant="secondary"
//               size="icon"
//               className="h-8 w-8 rounded-full"
//             />
//           </div>

//           {/* Wishlist button - top right for desktop */}
//           <div className="absolute top-2 right-2 z-20 opacity-0 md:group-hover:opacity-100 transition-opacity hidden md:block">
//             <WishlistButton product={product} />
//           </div>
//         </div>

//         <CardContent className="p-3">
//           <Link href={`/products/${product.id}`} className="block group">
//             <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
//               {product.name}
//             </h3>
//           </Link>

//           <p className="text-xs text-muted-foreground mt-0.5">
//             {product.category}
//           </p>

//           {/* Star Rating */}
//           {product.rating && (
//             <div className="flex items-center mt-1">
//               <div className="flex">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <svg
//                     key={i}
//                     className={`h-3 w-3 ${
//                       i < Math.floor(product.rating ?? 0)
//                         ? "text-yellow-400"
//                         : "text-gray-300"
//                     }`}
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 ))}
//               </div>
//               <span className="ml-1 text-xs text-muted-foreground">
//                 ({product.rating})
//               </span>
//             </div>
//           )}

//           <div className="mt-2 flex items-center justify-between">
//             <div>
//               {product.discount && product.discount > 0 ? (
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-bold">
//                     ${discountedPrice.toFixed(2)}
//                   </span>
//                   <span className="text-xs text-muted-foreground line-through">
//                     ${product.price.toFixed(2)}
//                   </span>
//                 </div>
//               ) : (
//                 <span className="text-sm font-bold">
//                   ${product.price.toFixed(2)}
//                 </span>
//               )}
//             </div>

//             {/* Quick add button for mobile - visible on smaller screens */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 rounded-full md:hidden"
//               onClick={handleAddToCart}
//             >
//               <ShoppingCart className="h-4 w-4" />
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       <ProductQuickView
//         product={product}
//         isOpen={isQuickViewOpen}
//         onClose={() => setIsQuickViewOpen(false)}
//       />
//     </>
//   );
// }

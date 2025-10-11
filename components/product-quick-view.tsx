"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, ShoppingCart, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { WishlistButton } from "@/components/wishlist-button"
import { toast } from "@/components/ui/use-toast"

interface ProductQuickViewProps {
  product: {
    id: number
    name: string
    price: number
    discount?: number
    image: string
    category: string
    description?: string
    rating?: number
    isNew?: boolean
    isBestSeller?: boolean
  }
  isOpen: boolean
  onClose: () => void
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Mock multiple images
  const images = [product.image, "/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"]

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10))
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const handleAddToCart = () => {
    setIsAddingToCart(true)

    // Simulate a slight delay for better UX
    setTimeout(() => {
      addItem({
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.discount ? product.price * (1 - product.discount / 100) : product.price,
        quantity,
        image: product.image,
        variant: "Default",
      })

      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} has been added to your cart.`,
      })

      setIsAddingToCart(false)
      onClose()
    }, 600)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Images */}
          <div className="relative">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={images[activeImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />

              {product.discount && product.discount > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500">{product.discount}% OFF</Badge>
              )}

              {product.isNew && <Badge className="absolute top-2 left-2">New</Badge>}

              {product.isBestSeller && <Badge className="absolute bottom-2 left-2 bg-amber-500">Best Seller</Badge>}
            </div>

            {/* Thumbnail Navigation */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    activeImage === index ? "bg-primary w-4" : "bg-primary/30"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <span className="sr-only">View image {index + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 flex flex-col">
            <div className="mb-2">
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <h2 className="text-2xl font-bold mt-1">{product.name}</h2>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {/* Star Rating */}
              {product.rating && (
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
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
                  <span className="ml-1 text-sm text-muted-foreground">({product.rating})</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              {product.discount && product.discount > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="text-muted-foreground mb-6">
              {product.description ||
                "A high-quality product with excellent features and durability. Perfect for everyday use and special occasions."}
            </p>

            <div className="mt-auto space-y-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <span className="text-sm font-medium">Quantity</span>
                </div>
                <div className="flex items-center border rounded-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={increaseQuantity}>
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleAddToCart} disabled={isAddingToCart}>
                  {isAddingToCart ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Adding...
                    </div>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>

                <WishlistButton product={product} variant="default" className="flex-1" />
              </div>

              <div className="pt-4">
                <Link
                  href={`/products/${product.id}`}
                  className="text-sm text-primary hover:underline"
                  onClick={onClose}
                >
                  View full details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

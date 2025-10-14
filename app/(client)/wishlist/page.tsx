"use client"

import { useWishlist } from "@/context/wishlist-context"
import { useCart } from "@/context/cart-context"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()
  const [removingItemId, setRemovingItemId] = useState<number | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null)

  const handleRemoveWithAnimation = (id: number) => {
    setRemovingItemId(id)
    setTimeout(() => {
      removeItem(id)
      setRemovingItemId(null)
    }, 300)
  }

  const handleAddToCart = (item: (typeof items)[0]) => {
    setAddingToCartId(item.id)

    // Simulate a slight delay for better UX
    setTimeout(() => {
      addToCart({
        id: Date.now(),
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        variant: "Default",
      })

      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      })

      setAddingToCartId(null)
    }, 600)
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-50 mb-6">
            <Heart className="h-10 w-10 text-pink-300" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Save items you love for later by clicking the heart icon on any product.
          </p>
          <Link href="/products">
            <Button className="rounded-full px-8">Browse Products</Button>
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <Button variant="outline" onClick={clearWishlist}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Wishlist
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              className={`overflow-hidden transition-all duration-300 ${
                removingItemId === item.id ? "opacity-0 transform scale-95" : ""
              }`}
            >
              <div className="relative">
                <Link href={`/products/${item.id}`}>
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:text-pink-500"
                  onClick={() => handleRemoveWithAnimation(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove from wishlist</span>
                </Button>
              </div>

              <CardContent className="p-4">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-medium line-clamp-1 hover:underline">{item.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <p className="font-medium mt-2">${item.price.toFixed(2)}</p>

                <Button
                  className="w-full mt-4"
                  onClick={() => handleAddToCart(item)}
                  disabled={addingToCartId === item.id}
                >
                  {addingToCartId === item.id ? (
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  )
}

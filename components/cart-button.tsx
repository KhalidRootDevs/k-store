"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Plus, Minus, Heart, ArrowRight, Truck, Clock } from "lucide-react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"
import { useState, useCallback, useEffect } from "react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Mock recommended products
const recommendedProducts = [
  {
    id: 101,
    name: "Wireless Earbuds",
    price: 49.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 102,
    name: "Phone Case",
    price: 19.99,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 103,
    name: "Charging Cable",
    price: 12.99,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function CartButton() {
  // All hooks must be called at the top level, before any conditional logic
  const { items, updateQuantity, removeItem, itemCount, subtotal, shipping, tax, total, addItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [savedItems, setSavedItems] = useState<typeof items>([])
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [promoApplied, setPromoApplied] = useState(false)
  const [removingItemId, setRemovingItemId] = useState<number | null>(null)
  const [addingItemId, setAddingItemId] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Calculate free shipping threshold
  const FREE_SHIPPING_THRESHOLD = 50
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  // Ensure component is mounted before accessing browser APIs
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle promo code application
  const handleApplyPromo = useCallback(() => {
    if (!promoCode) return

    setIsApplyingPromo(true)

    // Simulate API call
    setTimeout(() => {
      setIsApplyingPromo(false)
      setPromoApplied(true)
      toast({
        title: "Promo code applied",
        description: `Discount code "${promoCode}" has been applied to your order.`,
      })
    }, 1000)
  }, [promoCode])

  // Handle save for later
  const handleSaveForLater = useCallback(
    (item: (typeof items)[0]) => {
      removeItem(item.id)
      setSavedItems((prev) => [...prev, item])

      toast({
        title: "Item saved for later",
        description: `${item.name} has been moved to your saved items.`,
      })
    },
    [removeItem],
  )

  // Handle move to cart
  const handleMoveToCart = useCallback(
    (item: (typeof items)[0], index: number) => {
      const newSavedItems = [...savedItems]
      newSavedItems.splice(index, 1)
      setSavedItems(newSavedItems)

      // Add back to cart
      const { id, ...itemWithoutId } = item
      addItem({ ...itemWithoutId, id: Date.now() })

      toast({
        title: "Item moved to cart",
        description: `${item.name} has been moved to your cart.`,
      })
    },
    [addItem, savedItems, setSavedItems],
  )

  // Animation for removing items
  const handleRemoveWithAnimation = useCallback(
    (id: number) => {
      setRemovingItemId(id)
      setTimeout(() => {
        removeItem(id)
        setRemovingItemId(null)
      }, 300)
    },
    [removeItem],
  )

  // Estimated delivery date (3-5 business days from now)
  const getEstimatedDelivery = useCallback(() => {
    const today = new Date()
    const deliveryMin = new Date(today)
    deliveryMin.setDate(today.getDate() + 3)
    const deliveryMax = new Date(today)
    deliveryMax.setDate(today.getDate() + 5)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    return `${formatDate(deliveryMin)} - ${formatDate(deliveryMax)}`
  }, [])

  // Use conditional rendering instead of early return
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative hover:bg-primary/10 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <ShoppingCart className="h-5 w-5" />
          {isMounted && itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0 overflow-hidden">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center text-xl">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Your Cart ({isMounted ? itemCount : 0})
          </SheetTitle>
        </SheetHeader>

        {!isMounted || (items.length === 0 && savedItems.length === 0) ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12 px-6">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-xs">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it with great items!
            </p>
            <Link href="/products" onClick={() => setIsOpen(false)}>
              <Button className="rounded-full px-8">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            {amountToFreeShipping > 0 && (
              <div className="px-6 py-3 bg-muted/30">
                <div className="flex items-center mb-2">
                  <Truck className="h-4 w-4 mr-2 text-primary" />
                  <p className="text-sm font-medium">Add ${amountToFreeShipping.toFixed(2)} more for free shipping</p>
                </div>
                <Progress value={freeShippingProgress} className="h-1.5" />
              </div>
            )}

            {/* Cart items */}
            <ScrollArea className="flex-1 px-6">
              <div className="py-4 space-y-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex gap-4 p-3 rounded-lg transition-all duration-300 bg-background hover:bg-muted/50",
                      removingItemId === item.id && "opacity-0 transform translate-x-full",
                    )}
                  >
                    <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium line-clamp-1">{item.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-full">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() => {
                              setAddingItemId(item.id)
                              updateQuantity(item.id, item.quantity + 1)
                              setTimeout(() => setAddingItemId(null), 300)
                            }}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>

                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-muted"
                            onClick={() => handleSaveForLater(item)}
                          >
                            <Heart className="h-3.5 w-3.5" />
                            <span className="sr-only">Save for later</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-muted"
                            onClick={() => handleRemoveWithAnimation(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Saved for later */}
              {savedItems.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-3">Saved for Later ({savedItems.length})</h3>
                  <div className="space-y-4">
                    {savedItems.map((item, index) => (
                      <div key={item.id} className="flex gap-3 p-2">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                          <Button
                            variant="link"
                            className="h-auto p-0 text-xs"
                            onClick={() => handleMoveToCart(item, index)}
                          >
                            Move to Cart
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Recommended products */}
              {items.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-3">You Might Also Like</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {recommendedProducts.map((product) => (
                      <div key={product.id} className="text-center">
                        <div className="relative h-20 w-20 mx-auto rounded-md overflow-hidden bg-muted mb-2">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4 className="text-xs font-medium line-clamp-1">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs"
                          onClick={() => {
                            addItem({
                              id: Date.now(),
                              productId: product.id,
                              name: product.name,
                              price: product.price,
                              quantity: 1,
                              image: product.image,
                              variant: "Default",
                            })
                            toast({
                              title: "Item added to cart",
                              description: `${product.name} has been added to your cart.`,
                            })
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="h-4"></div> {/* Bottom spacing */}
            </ScrollArea>

            {items.length > 0 && (
              <>
                {/* Promo code */}
                <div className="px-6 py-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="rounded-full"
                      disabled={promoApplied}
                    />
                    <Button
                      variant={promoApplied ? "outline" : "default"}
                      onClick={handleApplyPromo}
                      disabled={isApplyingPromo || promoApplied || !promoCode}
                      className="rounded-full"
                    >
                      {isApplyingPromo ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : promoApplied ? (
                        "Applied"
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                  {promoApplied && (
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 mr-2">
                        {promoCode}
                      </Badge>
                      <span>10% discount applied</span>
                    </div>
                  )}
                </div>

                {/* Order summary */}
                <div className="px-6 py-4 border-t bg-muted/30">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount (10%)</span>
                        <span>-${(subtotal * 0.1).toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${promoApplied ? (total * 0.9).toFixed(2) : total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Estimated delivery */}
                  <div className="flex items-center mt-3 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    <span>Estimated delivery: {getEstimatedDelivery()}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <SheetFooter className="px-6 py-4 border-t">
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Link href="/cart" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full rounded-full">
                        View Cart
                      </Button>
                    </Link>
                    <Link href="/checkout" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button className="w-full rounded-full">
                        Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </SheetFooter>
              </>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

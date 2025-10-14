"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle2, AlertCircle, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Container } from "@/components/ui/container"
import { Elements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe"
import { StripePaymentForm } from "@/components/checkout/stripe-payment-form"
import { Alert, AlertDescription } from "@/components/ui/alert"

const checkoutSchema = z.object({
  contactInfo: z.object({
    fullName: z.string().min(2, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(5, { message: "Phone number is required" }),
  }),
  shippingAddress: z.object({
    address: z.string().min(5, { message: "Address is required" }),
    city: z.string().min(2, { message: "City is required" }),
    state: z.string().min(2, { message: "State is required" }),
    zipCode: z.string().min(5, { message: "ZIP code is required" }),
    country: z.string().min(2, { message: "Country is required" }),
  }),
  paymentMethod: z.enum(["card", "paypal", "cod"]),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [paymentIntentId, setPaymentIntentId] = useState("")
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null)
  const [stripeError, setStripeError] = useState("")
  const [stripeConfigured, setStripeConfigured] = useState(false)
  const [checkingStripe, setCheckingStripe] = useState(true)
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Check Stripe configuration
    checkStripeConfiguration()

    // Redirect if cart is empty
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items.length, router])

  const checkStripeConfiguration = async () => {
    try {
      setCheckingStripe(true)
      const stripe = await getStripe()
      setStripePromise(Promise.resolve(stripe))
      setStripeConfigured(!!stripe)

      if (!stripe) {
        setStripeError("Credit card payments are currently unavailable. Please use an alternative payment method.")
      }
    } catch (error) {
      console.error("Error checking Stripe configuration:", error)
      setStripeError("Unable to load payment system. Please try again later.")
      setStripeConfigured(false)
    } finally {
      setCheckingStripe(false)
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      contactInfo: {
        fullName: "",
        email: "",
        phone: "",
      },
      shippingAddress: {
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      paymentMethod: "card",
    },
  })

  const paymentMethod = watch("paymentMethod")

  // Create payment intent when payment method is card
  useEffect(() => {
    if (paymentMethod === "card" && total > 0 && stripeConfigured && !checkingStripe) {
      createPaymentIntent()
    }
  }, [paymentMethod, total, stripeConfigured, checkingStripe])

  const createPaymentIntent = async () => {
    try {
      setStripeError("")

      // Validate total amount
      if (!total || total <= 0) {
        throw new Error("Invalid order total")
      }

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          currency: "usd",
          metadata: {
            orderItems: items.length.toString(),
            customerEmail: watch("contactInfo.email") || "guest@example.com",
            orderTotal: total.toString(),
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === "STRIPE_NOT_CONFIGURED") {
          setStripeError("Credit card payments are not available. Please use an alternative payment method.")
          setStripeConfigured(false)
          return
        }

        if (data.code === "STRIPE_AUTH_ERROR") {
          setStripeError("Payment system configuration error. Please contact support.")
          setStripeConfigured(false)
          return
        }

        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setPaymentIntentId(data.paymentIntentId || "")
      } else {
        throw new Error("No client secret received from server")
      }
    } catch (error: any) {
      console.error("Error creating payment intent:", error)
      const errorMessage = error.message || "Unable to initialize payment. Please try again."
      setStripeError(errorMessage)

      toast({
        title: "Payment setup failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    // For non-card payments, process immediately
    if (data.paymentMethod !== "card") {
      await processOrder(data)
    }
    // For card payments, the StripePaymentForm will handle the submission
  }

  const processOrder = async (data: CheckoutFormValues, paymentIntent?: any) => {
    setIsSubmitting(true)

    try {
      // Simulate API call to process order
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a random order ID
      const newOrderId = `ORD-${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`
      setOrderId(newOrderId)

      // Log the order data
      console.log("Order placed:", {
        orderId: newOrderId,
        items,
        contactInfo: data.contactInfo,
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        paymentIntent: paymentIntent
          ? {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amount: paymentIntent.amount,
            }
          : undefined,
        summary: {
          subtotal,
          shipping,
          tax,
          total,
        },
      })

      // Clear the cart
      clearCart()

      // Show success state
      setOrderComplete(true)

      toast({
        title: "Order placed successfully",
        description: `Your order ${newOrderId} has been confirmed.`,
      })
    } catch (error) {
      console.error("Error processing order:", error)
      toast({
        title: "Error processing order",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStripeSuccess = (paymentIntent: any) => {
    const formData = watch()
    processOrder(formData, paymentIntent)
  }

  const handleStripeError = (error: string) => {
    console.error("Stripe payment error:", error)
    setStripeError(error)
  }

  if (!isMounted) {
    return null // Prevent hydration errors
  }

  if (orderComplete) {
    return (
      <Container className="max-w-3xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <div className="bg-muted p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="flex justify-between mb-2">
            <span>Order Number:</span>
            <span className="font-medium">{orderId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>
          {paymentIntentId && (
            <div className="flex justify-between">
              <span>Payment ID:</span>
              <span className="font-medium text-xs">{paymentIntentId}</span>
            </div>
          )}
        </div>
        <p className="mb-8">
          We've sent a confirmation email to your email address with all the details of your order.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/account/orders">View Order History</Link>
          </Button>
        </div>
      </Container>
    )
  }

  if (items.length === 0 && isMounted) {
    router.push("/cart")
    return null
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="fullName" placeholder="John Doe" {...register("contactInfo.fullName")} />
                    {errors.contactInfo?.fullName && (
                      <p className="text-sm text-red-500">{errors.contactInfo.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input id="phone" placeholder="+1 (123) 456-7890" {...register("contactInfo.phone")} />
                    {errors.contactInfo?.phone && (
                      <p className="text-sm text-red-500">{errors.contactInfo.phone.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    {...register("contactInfo.email")}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">{errors.contactInfo.email.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea id="address" placeholder="123 Main St, Apt 4B" {...register("shippingAddress.address")} />
                  {errors.shippingAddress?.address && (
                    <p className="text-sm text-red-500">{errors.shippingAddress.address.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <Input id="city" placeholder="New York" {...register("shippingAddress.city")} />
                    {errors.shippingAddress?.city && (
                      <p className="text-sm text-red-500">{errors.shippingAddress.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <Input id="state" placeholder="NY" {...register("shippingAddress.state")} />
                    {errors.shippingAddress?.state && (
                      <p className="text-sm text-red-500">{errors.shippingAddress.state.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">
                      ZIP Code <span className="text-red-500">*</span>
                    </Label>
                    <Input id="zipCode" placeholder="10001" {...register("shippingAddress.zipCode")} />
                    {errors.shippingAddress?.zipCode && (
                      <p className="text-sm text-red-500">{errors.shippingAddress.zipCode.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </Label>
                  <Input id="country" placeholder="United States" {...register("shippingAddress.country")} />
                  {errors.shippingAddress?.country && (
                    <p className="text-sm text-red-500">{errors.shippingAddress.country.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="card" className="space-y-3" {...register("paymentMethod")}>
                  <div
                    className={`flex items-center space-x-2 border rounded-md p-4 ${!stripeConfigured && !checkingStripe ? "opacity-50" : ""}`}
                  >
                    <RadioGroupItem value="card" id="card" disabled={!stripeConfigured && !checkingStripe} />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Credit/Debit Card
                        {checkingStripe && <span className="ml-2 text-sm text-muted-foreground">(Loading...)</span>}
                        {!stripeConfigured && !checkingStripe && (
                          <span className="ml-2 text-sm text-red-500">(Unavailable)</span>
                        )}
                      </div>
                    </Label>
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-[#3D95CE] rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div className="w-10 h-6 bg-[#EB001B] rounded flex items-center justify-center text-white text-xs font-bold">
                        MC
                      </div>
                      <div className="w-10 h-6 bg-[#006FCF] rounded flex items-center justify-center text-white text-xs font-bold">
                        AMEX
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      PayPal
                    </Label>
                    <div className="w-16 h-6 bg-[#0070BA] rounded flex items-center justify-center text-white text-xs font-bold">
                      PayPal
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-md p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>

                {/* Show Stripe error if any */}
                {stripeError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{stripeError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Stripe Payment Form */}
            {paymentMethod === "card" && clientSecret && stripePromise && !stripeError && stripeConfigured && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#000000",
                    },
                  },
                }}
              >
                <StripePaymentForm
                  clientSecret={clientSecret}
                  onSuccess={handleStripeSuccess}
                  onError={handleStripeError}
                  isProcessing={isSubmitting}
                  setIsProcessing={setIsSubmitting}
                />
              </Elements>
            )}

            {/* Non-card payment submit button */}
            {paymentMethod !== "card" && (
              <Card>
                <CardContent className="pt-6">
                  <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Processing...
                      </div>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-2">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.variant}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Container>
  )
}

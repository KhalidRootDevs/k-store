"use client"

import type React from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface StripePaymentFormProps {
  clientSecret: string
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export function StripePaymentForm({
  clientSecret,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      })

      if (error) {
        onError(error.message || "Payment failed")
        toast({
          title: "Payment failed",
          description: error.message || "An error occurred during payment",
          variant: "destructive",
        })
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent)
        toast({
          title: "Payment successful",
          description: "Your payment has been processed successfully",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      onError(errorMessage)
      toast({
        title: "Payment error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card", "apple_pay", "google_pay"],
            }}
          />
          <Button type="submit" disabled={!stripe || isProcessing} className="w-full" size="lg">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              "Complete Payment"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

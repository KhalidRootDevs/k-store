"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Eye, Download } from "lucide-react"
import Link from "next/link"

const payments = [
  {
    id: "PAY-2024-001",
    orderId: "ORD-2024-001",
    date: "2024-01-15",
    method: "Visa •••• 4242",
    amount: 129.99,
    status: "Completed",
  },
  {
    id: "PAY-2024-002",
    orderId: "ORD-2024-002",
    date: "2024-01-10",
    method: "Mastercard •••• 8888",
    amount: 79.99,
    status: "Completed",
  },
  {
    id: "PAY-2024-003",
    orderId: "ORD-2024-003",
    date: "2024-01-05",
    method: "PayPal",
    amount: 249.99,
    status: "Pending",
  },
  {
    id: "PAY-2023-125",
    orderId: "ORD-2023-125",
    date: "2023-12-28",
    method: "Visa •••• 4242",
    amount: 59.99,
    status: "Completed",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "Failed":
      return "bg-red-100 text-red-800"
    case "Refunded":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View all your payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{payment.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Order ID</p>
                      <p className="font-medium">{payment.orderId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-medium">{payment.method}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium text-lg">${payment.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/account/orders/${payment.orderId}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Order
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Receipt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payment history</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Eye, Download } from "lucide-react"
import Link from "next/link"

const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 129.99,
    items: 2,
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-10",
    status: "Shipped",
    total: 79.99,
    items: 1,
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-05",
    status: "Processing",
    total: 249.99,
    items: 3,
    trackingNumber: null,
  },
  {
    id: "ORD-2023-125",
    date: "2023-12-28",
    status: "Delivered",
    total: 59.99,
    items: 1,
    trackingNumber: "TRK456789123",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800"
    case "Shipped":
      return "bg-blue-100 text-blue-800"
    case "Processing":
      return "bg-yellow-100 text-yellow-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View and track all your orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{order.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Items</p>
                      <p className="font-medium">{order.items}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Tracking</p>
                      <p className="font-medium">{order.trackingNumber || "Not available"}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/account/orders/${order.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Button asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

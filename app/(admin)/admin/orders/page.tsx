import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search } from "lucide-react"
import Link from "next/link"

// Mock order data
const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2023-06-15",
    total: 159.98,
    status: "Delivered",
    items: 2,
    payment: "Credit Card",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2023-06-14",
    total: 79.99,
    status: "Shipped",
    items: 1,
    payment: "PayPal",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    date: "2023-06-14",
    total: 249.97,
    status: "Processing",
    items: 3,
    payment: "Credit Card",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    date: "2023-06-13",
    total: 129.99,
    status: "Delivered",
    items: 1,
    payment: "Cash on Delivery",
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    date: "2023-06-12",
    total: 89.98,
    status: "Cancelled",
    items: 2,
    payment: "Credit Card",
  },
  {
    id: "ORD-006",
    customer: "Sarah Brown",
    date: "2023-06-12",
    total: 199.99,
    status: "Delivered",
    items: 1,
    payment: "PayPal",
  },
  {
    id: "ORD-007",
    customer: "David Miller",
    date: "2023-06-11",
    total: 59.99,
    status: "Shipped",
    items: 1,
    payment: "Credit Card",
  },
  {
    id: "ORD-008",
    customer: "Jennifer Taylor",
    date: "2023-06-10",
    total: 149.97,
    status: "Processing",
    items: 3,
    payment: "Cash on Delivery",
  },
]

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">View and manage customer orders.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Track and update order status and details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input placeholder="Search orders..." className="h-9" type="search" />
              <Button type="submit" size="sm" className="h-9">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{order.payment}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

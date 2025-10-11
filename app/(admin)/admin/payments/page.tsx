"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Search, Download } from "lucide-react"
import Link from "next/link"
import { Container } from "@/components/ui/container"

// Mock payment data
const payments = [
  {
    id: "PAY-001",
    transactionId: "txn_1234567890abcdef",
    orderId: "ORD-001",
    customer: "John Doe",
    date: "2023-06-15T14:35:12Z",
    amount: 159.98,
    fee: 4.95,
    net: 155.03,
    method: "Credit Card",
    cardType: "Visa",
    last4: "4242",
    status: "Completed",
  },
  {
    id: "PAY-002",
    transactionId: "txn_abcdef1234567890",
    orderId: "ORD-002",
    customer: "Jane Smith",
    date: "2023-06-14T10:16:05Z",
    amount: 79.99,
    fee: 2.55,
    net: 77.44,
    method: "PayPal",
    paypalEmail: "jane.smith@example.com",
    status: "Completed",
  },
  {
    id: "PAY-003",
    transactionId: "txn_xyz9876543210abc",
    orderId: "ORD-003",
    customer: "Robert Johnson",
    date: "2023-06-14T16:47:10Z",
    amount: 249.97,
    fee: 7.75,
    net: 242.22,
    method: "Credit Card",
    cardType: "Mastercard",
    last4: "5678",
    status: "Completed",
  },
  {
    id: "PAY-004",
    transactionId: "txn_pending123456",
    orderId: "ORD-008",
    customer: "Jennifer Taylor",
    date: "2023-06-10T09:22:33Z",
    amount: 149.97,
    fee: 0,
    net: 149.97,
    method: "Cash on Delivery",
    status: "Pending",
  },
  {
    id: "PAY-005",
    transactionId: "txn_failed789xyz",
    orderId: "ORD-009",
    customer: "Michael Brown",
    date: "2023-06-09T15:45:20Z",
    amount: 89.99,
    fee: 0,
    net: 0,
    method: "Credit Card",
    cardType: "Visa",
    last4: "1234",
    status: "Failed",
  },
  {
    id: "PAY-006",
    transactionId: "txn_refund456def",
    orderId: "ORD-005",
    customer: "Michael Wilson",
    date: "2023-06-12T11:30:15Z",
    amount: -89.98,
    fee: -2.79,
    net: -87.19,
    method: "Credit Card",
    cardType: "Visa",
    last4: "9876",
    status: "Refunded",
  },
  {
    id: "PAY-007",
    transactionId: "txn_processing789",
    orderId: "ORD-010",
    customer: "Sarah Davis",
    date: "2023-06-08T14:12:45Z",
    amount: 199.99,
    fee: 6.2,
    net: 193.79,
    method: "PayPal",
    paypalEmail: "sarah.davis@example.com",
    status: "Processing",
  },
  {
    id: "PAY-008",
    transactionId: "txn_completed123abc",
    orderId: "ORD-006",
    customer: "Sarah Brown",
    date: "2023-06-12T08:45:30Z",
    amount: 199.99,
    fee: 6.2,
    net: 193.79,
    method: "PayPal",
    paypalEmail: "sarah.brown@example.com",
    status: "Completed",
  },
]

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800"
    case "Processing":
      return "bg-blue-100 text-blue-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "Failed":
      return "bg-red-100 text-red-800"
    case "Refunded":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")

  // Filter payments based on search and filters
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter

    return matchesSearch && matchesStatus && matchesMethod
  })

  // Calculate totals
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalFees = filteredPayments.reduce((sum, payment) => sum + payment.fee, 0)
  const totalNet = filteredPayments.reduce((sum, payment) => sum + payment.net, 0)

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
            <p className="text-muted-foreground">View and manage all payment transactions.</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{filteredPayments.length} transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalFees.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Processing fees</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalNet.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">After fees</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Transactions</CardTitle>
            <CardDescription>Track and manage all payment transactions and their status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  placeholder="Search by ID, transaction, order, or customer..."
                  className="h-9"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="sm" className="h-9">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No payments found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>
                          <Link href={`/admin/orders/${payment.orderId}`} className="text-primary hover:underline">
                            {payment.orderId}
                          </Link>
                        </TableCell>
                        <TableCell>{payment.customer}</TableCell>
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell className={payment.amount < 0 ? "text-red-600" : ""}>
                          ${Math.abs(payment.amount).toFixed(2)}
                          {payment.amount < 0 && " (Refund)"}
                        </TableCell>
                        <TableCell>${payment.fee.toFixed(2)}</TableCell>
                        <TableCell className="font-medium">${payment.net.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{payment.method}</span>
                            {payment.cardType && payment.last4 && (
                              <span className="text-xs text-muted-foreground">
                                {payment.cardType} ••{payment.last4}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/payments/${payment.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}

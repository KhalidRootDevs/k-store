"use client"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Download,
  ExternalLink,
  MapPin,
  Package,
  Send,
  Truck,
  User,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/ui/container"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Mock order data
const orders = {
  "ORD-001": {
    id: "ORD-001",
    customer: {
      id: "CUST-001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Apt 4B, New York, NY 10001, USA",
    },
    date: "2023-06-15T14:32:45Z",
    total: 159.98,
    subtotal: 149.98,
    tax: 10.0,
    shipping: 0,
    status: "Delivered",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    cardDetails: {
      type: "Visa",
      last4: "4242",
    },
    shippingMethod: "Standard Shipping",
    trackingNumber: "TRK123456789",
    items: [
      {
        id: 1,
        name: "Premium T-Shirt",
        price: 29.99,
        quantity: 2,
        image: "/placeholder.svg?height=80&width=80",
        variant: "Size: M, Color: Black",
      },
      {
        id: 2,
        name: "Wireless Headphones",
        price: 89.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
        variant: "Color: Silver",
      },
    ],
    timeline: [
      {
        status: "Order Placed",
        date: "2023-06-15T14:32:45Z",
        description: "Order was placed by customer",
      },
      {
        status: "Payment Confirmed",
        date: "2023-06-15T14:35:12Z",
        description: "Payment was confirmed",
      },
      {
        status: "Processing",
        date: "2023-06-16T09:12:33Z",
        description: "Order is being processed",
      },
      {
        status: "Shipped",
        date: "2023-06-17T11:45:20Z",
        description: "Order has been shipped via Standard Shipping",
      },
      {
        status: "Delivered",
        date: "2023-06-19T15:22:10Z",
        description: "Order was delivered",
      },
    ],
    notes: "Customer requested gift wrapping. Added a thank you note.",
  },
  "ORD-002": {
    id: "ORD-002",
    customer: {
      id: "CUST-002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Ave, Somewhere, CA 90210, USA",
    },
    date: "2023-06-14T10:15:30Z",
    total: 79.99,
    subtotal: 74.99,
    tax: 5.0,
    shipping: 0,
    status: "Shipped",
    paymentMethod: "PayPal",
    paymentStatus: "Paid",
    paypalEmail: "jane.smith@example.com",
    shippingMethod: "Express Shipping",
    trackingNumber: "TRK987654321",
    items: [
      {
        id: 3,
        name: "Bluetooth Speaker",
        price: 74.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
        variant: "Color: Black",
      },
    ],
    timeline: [
      {
        status: "Order Placed",
        date: "2023-06-14T10:15:30Z",
        description: "Order was placed by customer",
      },
      {
        status: "Payment Confirmed",
        date: "2023-06-14T10:16:05Z",
        description: "Payment was confirmed via PayPal",
      },
      {
        status: "Processing",
        date: "2023-06-14T14:22:45Z",
        description: "Order is being processed",
      },
      {
        status: "Shipped",
        date: "2023-06-15T09:30:15Z",
        description: "Order has been shipped via Express Shipping",
      },
    ],
    notes: "",
  },
  "ORD-003": {
    id: "ORD-003",
    customer: {
      id: "CUST-003",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+1 (555) 456-7890",
      address: "789 Pine St, Elsewhere, TX 75001, USA",
    },
    date: "2023-06-14T16:45:22Z",
    total: 249.97,
    subtotal: 229.97,
    tax: 20.0,
    shipping: 0,
    status: "Processing",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    cardDetails: {
      type: "Mastercard",
      last4: "5678",
    },
    shippingMethod: "Standard Shipping",
    trackingNumber: "",
    items: [
      {
        id: 4,
        name: "Smart Watch",
        price: 199.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
        variant: "Color: Black",
      },
      {
        id: 5,
        name: "Phone Case",
        price: 29.98,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
        variant: "Model: iPhone 13, Color: Clear",
      },
    ],
    timeline: [
      {
        status: "Order Placed",
        date: "2023-06-14T16:45:22Z",
        description: "Order was placed by customer",
      },
      {
        status: "Payment Confirmed",
        date: "2023-06-14T16:47:10Z",
        description: "Payment was confirmed",
      },
      {
        status: "Processing",
        date: "2023-06-15T10:12:33Z",
        description: "Order is being processed",
      },
    ],
    notes: "Customer requested to deliver after 5 PM.",
  },
}

// Status badge colors
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

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const order = orders[orderId]

  const [status, setStatus] = useState(order?.status || "")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [note, setNote] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  if (!order) {
    return (
      <Container>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Order Not Found</h2>
            <p className="text-muted-foreground">The requested order does not exist.</p>
          </div>
        </div>
      </Container>
    )
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Handle status update
  const handleStatusUpdate = async () => {
    setIsUpdatingStatus(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Status updated",
      description: `Order status has been updated to ${status}.`,
    })

    setIsUpdatingStatus(false)
  }

  // Handle send email
  const handleSendEmail = async () => {
    if (!note.trim()) {
      toast({
        title: "Note required",
        description: "Please enter a note to send to the customer.",
        variant: "destructive",
      })
      return
    }

    setIsSendingEmail(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Email sent",
      description: "Your note has been sent to the customer.",
    })

    setNote("")
    setIsSendingEmail(false)
  }

  // Generate and download invoice PDF
  const generateInvoicePDF = () => {
    // Create a new PDF document
    const doc = new jsPDF()

    // Add company logo and information
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("BOLT COMMERCE", 14, 22)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("123 E-Commerce Street", 14, 30)
    doc.text("New York, NY 10001", 14, 35)
    doc.text("support@boltcommerce.com", 14, 40)
    doc.text("(555) 123-4567", 14, 45)

    // Add invoice title and details
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("INVOICE", 140, 22)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Invoice #: INV-${order.id}`, 140, 30)
    doc.text(`Order #: ${order.id}`, 140, 35)
    doc.text(`Date: ${formatDate(order.date)}`, 140, 40)
    doc.text(`Status: ${order.status}`, 140, 45)

    // Add customer information
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Bill To:", 14, 60)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(order.customer.name, 14, 67)

    // Split address into multiple lines
    const addressLines = order.customer.address.split(", ")
    let yPos = 72
    addressLines.forEach((line) => {
      doc.text(line, 14, yPos)
      yPos += 5
    })

    doc.text(`Email: ${order.customer.email}`, 14, yPos + 5)
    doc.text(`Phone: ${order.customer.phone}`, 14, yPos + 10)

    // Add payment information
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Payment Method:", 140, 60)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(order.paymentMethod, 140, 67)

    if (order.paymentMethod === "Credit Card" && order.cardDetails) {
      doc.text(`${order.cardDetails.type} ending in ${order.cardDetails.last4}`, 140, 72)
    } else if (order.paymentMethod === "PayPal" && order.paypalEmail) {
      doc.text(`PayPal: ${order.paypalEmail}`, 140, 72)
    }

    doc.text(`Payment Status: ${order.paymentStatus}`, 140, 77)

    // Add order items table
    const tableColumn = ["Item", "Price", "Qty", "Total"]
    const tableRows = order.items.map((item) => [
      `${item.name}\n${item.variant}`,
      `$${item.price.toFixed(2)}`,
      item.quantity,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ])

    autoTable(doc, {
      startY: yPos + 20,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: { fillColor: [66, 66, 66] },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 30, halign: "right" },
        2: { cellWidth: 30, halign: "center" },
        3: { cellWidth: 30, halign: "right" },
      },
      styles: { overflow: "linebreak" },
      margin: { left: 14, right: 14 },
    })

    // Get the y position after the table
    const finalY = (doc as any).lastAutoTable.finalY + 10

    // Add order summary
    doc.setFontSize(10)
    doc.text("Subtotal:", 130, finalY)
    doc.text(`$${order.subtotal.toFixed(2)}`, 175, finalY, { align: "right" })

    doc.text("Tax:", 130, finalY + 7)
    doc.text(`$${order.tax.toFixed(2)}`, 175, finalY + 7, { align: "right" })

    doc.text("Shipping:", 130, finalY + 14)
    doc.text(order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`, 175, finalY + 14, { align: "right" })

    doc.setLineWidth(0.5)
    doc.line(130, finalY + 17, 175, finalY + 17)

    doc.setFont("helvetica", "bold")
    doc.text("Total:", 130, finalY + 24)
    doc.text(`$${order.total.toFixed(2)}`, 175, finalY + 24, { align: "right" })

    // Add shipping information
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Shipping Information:", 14, finalY)

    doc.setFont("helvetica", "normal")
    doc.text(`Method: ${order.shippingMethod}`, 14, finalY + 7)

    if (order.trackingNumber) {
      doc.text(`Tracking Number: ${order.trackingNumber}`, 14, finalY + 14)
    }

    // Add footer
    doc.setFontSize(8)
    doc.text("Thank you for your business!", 105, finalY + 40, { align: "center" })
    doc.text("For questions about this invoice, please contact our customer service.", 105, finalY + 45, {
      align: "center",
    })

    // Save the PDF
    doc.save(`Invoice-${order.id}.pdf`)
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Order {order.id}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(order.date)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={generateInvoicePDF}>
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <Button variant="outline" size="sm">
              <Send className="mr-2 h-4 w-4" />
              Send Invoice
            </Button>
            <Link href={`/admin/orders/${order.id}/edit`}>
              <Button size="sm">Edit Order</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Order Summary</CardTitle>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold">
                            Product
                          </th>
                          <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold">
                            Price
                          </th>
                          <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold">
                            Quantity
                          </th>
                          <th scope="col" className="px-4 py-3.5 text-right text-sm font-semibold">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-4 text-sm">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-muted-foreground">{item.variant}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm">${item.price.toFixed(2)}</td>
                            <td className="px-4 py-4 text-sm">{item.quantity}</td>
                            <td className="px-4 py-4 text-sm text-right">${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th scope="row" colSpan={3} className="px-4 py-3.5 text-right text-sm font-normal">
                            Subtotal
                          </th>
                          <td className="px-4 py-3.5 text-right text-sm">${order.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <th scope="row" colSpan={3} className="px-4 py-3.5 text-right text-sm font-normal">
                            Tax
                          </th>
                          <td className="px-4 py-3.5 text-right text-sm">${order.tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <th scope="row" colSpan={3} className="px-4 py-3.5 text-right text-sm font-normal">
                            Shipping
                          </th>
                          <td className="px-4 py-3.5 text-right text-sm">
                            {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
                          </td>
                        </tr>
                        <tr className="border-t border-t-2">
                          <th scope="row" colSpan={3} className="px-4 py-3.5 text-right text-base font-medium">
                            Total
                          </th>
                          <td className="px-4 py-3.5 text-right text-base font-medium">${order.total.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="timeline">
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="email">Email Customer</TabsTrigger>
              </TabsList>
              <TabsContent value="timeline" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Timeline</CardTitle>
                    <CardDescription>Track the progress of this order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-6 border-l">
                      {order.timeline.map((event, index) => (
                        <div key={index} className="mb-8 last:mb-0">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px]"></div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                              <span className="text-xs text-muted-foreground">{formatDate(event.date)}</span>
                            </div>
                            <p className="mt-1 text-sm">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Update Status:</span>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleStatusUpdate} disabled={isUpdatingStatus || status === order.status}>
                      {isUpdatingStatus ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Updating...
                        </>
                      ) : (
                        "Update Status"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                    <CardDescription>Internal notes about this order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {order.notes ? (
                      <div className="p-4 bg-muted rounded-md">
                        <p className="text-sm">{order.notes}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No notes for this order.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="email" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Customer</CardTitle>
                    <CardDescription>Send a message to {order.customer.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-subject">Subject</Label>
                        <Input id="email-subject" defaultValue={`Your order ${order.id}`} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-message">Message</Label>
                        <Textarea
                          id="email-message"
                          placeholder="Enter your message to the customer..."
                          rows={5}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSendEmail} disabled={isSendingEmail}>
                      {isSendingEmail ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-muted-foreground">Customer ID: {order.customer.id}</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Email:</span> {order.customer.email}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Phone:</span> {order.customer.phone}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/users/${order.customer.id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Customer
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Shipping Address</div>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">{order.customer.address}</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Shipping Method:</span> {order.shippingMethod}
                    </div>
                    {order.trackingNumber && (
                      <div className="text-sm">
                        <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                      </div>
                    )}
                  </div>
                  {order.trackingNumber && (
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <Truck className="mr-2 h-4 w-4" />
                        Track Package
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{order.paymentMethod}</div>
                      <Badge
                        variant="outline"
                        className={
                          order.paymentStatus === "Paid"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    {order.paymentMethod === "Credit Card" && order.cardDetails && (
                      <div className="text-sm">
                        <span className="font-medium">Card:</span> {order.cardDetails.type} ending in{" "}
                        {order.cardDetails.last4}
                      </div>
                    )}
                    {order.paymentMethod === "PayPal" && order.paypalEmail && (
                      <div className="text-sm">
                        <span className="font-medium">PayPal Email:</span> {order.paypalEmail}
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="font-medium">Amount:</span> ${order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Create Return
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Issue Refund
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled={order.status === "Cancelled"}>
                    <Truck className="mr-2 h-4 w-4" />
                    Update Shipping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  )
}

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: {
    attributes: Record<string, string>;
    sku?: string;
  };
  productId?: string;
  sku?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash_on_delivery";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingMethod: string;
  trackingNumber?: string;
  timeline: Array<{
    status: string;
    date: string;
    description: string;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateOrderColumnsProps {
  onStatusUpdate?: (
    orderId: string,
    currentStatus: string,
    orderNumber: string
  ) => void;
  onDeleteOrder?: (orderId: string, orderNumber: string) => void;
}

export const createOrderColumns = ({
  onStatusUpdate,
  onDeleteOrder,
}: CreateOrderColumnsProps): ColumnDef<Order>[] => [
  {
    accessorKey: "orderNumber",
    header: "Order ID",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{order.orderNumber}</div>
          {order.trackingNumber && (
            <div className="text-xs text-muted-foreground">
              Track: {order.trackingNumber}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{order.shippingAddress.fullName}</div>
          <div className="text-xs text-muted-foreground">
            {order.customer.email}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const order = row.original;
      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      return <div className="text-sm">{formatDate(order.createdAt)}</div>;
    },
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const order = row.original;
      const getTotalItems = (items: OrderItem[]) => {
        return items.reduce((total, item) => total + item.quantity, 0);
      };

      return <div className="text-sm">{getTotalItems(order.items)} items</div>;
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">${order.total.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">
            Subtotal: ${order.subtotal.toFixed(2)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const order = row.original;
      const getPaymentMethodText = (method: string) => {
        switch (method) {
          case "credit_card":
            return "Credit Card";
          case "debit_card":
            return "Debit Card";
          case "paypal":
            return "PayPal";
          case "cash_on_delivery":
            return "Cash on Delivery";
          default:
            return method;
        }
      };

      return (
        <div className="text-sm capitalize">
          {getPaymentMethodText(order.paymentMethod)}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const order = row.original;
      const getPaymentStatusColor = (status: string) => {
        switch (status) {
          case "paid":
            return "bg-green-100 text-green-800 border-green-200";
          case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "failed":
            return "bg-red-100 text-red-800 border-red-200";
          case "refunded":
            return "bg-purple-100 text-purple-800 border-purple-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      return (
        <Badge
          variant="outline"
          className={`capitalize ${getPaymentStatusColor(order.paymentStatus)}`}
        >
          {order.paymentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      const order = row.original;
      const getStatusColor = (status: string) => {
        switch (status) {
          case "delivered":
            return "bg-green-100 text-green-800 border-green-200";
          case "shipped":
            return "bg-blue-100 text-blue-800 border-blue-200";
          case "processing":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "pending":
            return "bg-orange-100 text-orange-800 border-orange-200";
          case "cancelled":
            return "bg-red-100 text-red-800 border-red-200";
          case "refunded":
            return "bg-purple-100 text-purple-800 border-purple-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      return (
        <Badge
          variant="outline"
          className={`capitalize ${getStatusColor(order.status)}`}
        >
          {order.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex justify-end gap-2">
          <Link href={`/admin/orders/${order._id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/admin/orders/${order._id}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/orders/${order._id}/edit`}>Edit order</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  window.open(`/admin/orders/${order._id}/invoice`, "_blank")
                }
              >
                Download invoice
              </DropdownMenuItem>
              {order.trackingNumber && (
                <DropdownMenuItem
                  onClick={() => {
                    // Copy tracking number to clipboard
                    navigator.clipboard.writeText(order.trackingNumber!);
                    // You might want to show a toast here
                  }}
                >
                  Copy tracking number
                </DropdownMenuItem>
              )}
              {onStatusUpdate && (
                <DropdownMenuItem
                  onClick={() =>
                    onStatusUpdate(order._id, order.status, order.orderNumber)
                  }
                >
                  Update status
                </DropdownMenuItem>
              )}
              {onDeleteOrder && (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onDeleteOrder(order._id, order.orderNumber)}
                >
                  Cancel order
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

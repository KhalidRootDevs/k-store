"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Package,
  Eye,
  Download,
  Search,
  Loader2,
  Filter,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/types";

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

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "refunded":
      return "Refunded";
    default:
      return status;
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/user/orders?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchOrder = async () => {
    if (!searchOrderId.trim()) {
      toast({
        title: "Order ID required",
        description: "Please enter an order ID to search",
        variant: "destructive",
      });
      return;
    }

    try {
      setSearching(true);
      const response = await fetch(`/api/user/orders/${searchOrderId.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Order not found");
      }

      setSearchedOrder(data.order);
      toast({
        title: "Order found",
        description: `Order ${data.order.orderNumber} has been found.`,
      });
    } catch (error: any) {
      console.error("Error searching order:", error);
      setSearchedOrder(null);
      toast({
        title: "Order not found",
        description: error.message || "The order ID you entered was not found.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTotalItems = (items: Order["items"]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const downloadInvoice = async (orderNumber: string) => {
    try {
      const response = await fetch(`/api/user/orders/${orderNumber}/invoice`);
      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `invoice-${orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Invoice downloaded",
        description: `Invoice for order ${orderNumber} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const displayOrders = searchedOrder ? [searchedOrder] : orders;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
          <CardDescription>
            Enter your order ID to track a specific order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="Enter order ID (e.g., ORD-20240115-ABC123)"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearchOrder()}
            />
            <Button
              onClick={handleSearchOrder}
              disabled={searching}
              className="min-w-[100px]"
            >
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="sr-only">Search</span>
            </Button>
          </div>
          {searchedOrder && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                Showing results for: <strong>{searchOrderId}</strong>
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-green-800"
                onClick={() => {
                  setSearchedOrder(null);
                  setSearchOrderId("");
                }}
              >
                Show all orders
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                {searchedOrder
                  ? `Showing order: ${searchedOrder.orderNumber}`
                  : `View and track all your orders (${orders.length})`}
              </CardDescription>
            </div>
            {!searchedOrder && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : displayOrders.length > 0 ? (
            <div className="space-y-3">
              {displayOrders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-sm">
                          {order.orderNumber}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(order.status)}
                    >
                      {getStatusText(order.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Items</p>
                      <p className="font-medium">
                        {getTotalItems(order.items)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tracking</p>
                      <p className="font-medium truncate">
                        {order.trackingNumber || "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <Link href={`/account/orders/${order.orderNumber}`}>
                        <Eye className="mr-2 h-3 w-3" />
                        View Details
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => downloadInvoice(order.orderNumber)}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchedOrder
                  ? "No order found with that ID"
                  : "No orders yet"}
              </p>
              {!searchedOrder && (
                <Button asChild>
                  <Link href="/products">Start Shopping</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

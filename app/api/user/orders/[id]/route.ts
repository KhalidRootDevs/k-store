import { type NextRequest, NextResponse } from "next/server";
import { Order, type OrderStatus } from "@/models/Order";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/database";

/**
 * GET /api/orders/[id]
 * Fetches a single order by orderNumber
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId;
    const { id } = params;

    console.log("🔍 Searching for order:", {
      orderNumber: id,
      userId: userId,
    });

    // Clean and validate the order number
    const orderNumber = id.trim().toUpperCase();

    // Validate order number format
    if (!orderNumber.startsWith("ORD-")) {
      return NextResponse.json(
        { error: "Invalid order number format" },
        { status: 400 }
      );
    }

    // Convert userId to ObjectId for proper querying
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find order by orderNumber for the specific user
    const order = await Order.findOne({
      orderNumber: orderNumber,
      "customer.id": userObjectId,
    })
      .populate("items.productId", "name images sku")
      .populate("timeline.updatedBy", "name email")
      .lean();

    console.log("📦 Order found:", order ? "Yes" : "No");

    if (!order) {
      return NextResponse.json(
        {
          error:
            "Order not found or you don't have permission to view this order",
        },
        { status: 404 }
      );
    }

    // Normalize the order data
    const normalizedOrder = {
      ...order,
      _id: order._id.toString(),
      customer: {
        id: order.customer.id?._id
          ? order.customer.id._id.toString()
          : order.customer.id?.toString() || userId,
        name: order.customer.name || order.customer.id?.name || "Customer",
        email:
          order.customer.email ||
          order.customer.id?.email ||
          "unknown@example.com",
        phone: order.customer.phone || order.shippingAddress?.phone || "N/A",
        address:
          order.customer.address || order.shippingAddress?.address || "N/A",
      },
      timeline: (order.timeline || []).map((event: any) => ({
        status: event.status,
        date: event.date,
        description: event.description,
        updatedBy: event.updatedBy
          ? {
              name: event.updatedBy.name || "System",
              email: event.updatedBy.email || "system",
            }
          : undefined,
      })),
      items: (order.items || []).map((item: any) => ({
        ...item,
        _id: item._id?.toString(),
        productId: item.productId
          ? {
              _id: item.productId._id?.toString(),
              name: item.productId.name,
              images: item.productId.images || [],
              sku: item.productId.sku,
            }
          : undefined,
      })),
    };

    console.log("✅ Order normalized successfully");
    return NextResponse.json({ order: normalizedOrder });
  } catch (error: any) {
    console.error("❌ Get user order error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/orders/[id]
 * Updates an order (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    // Only admins can update orders
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update allowed fields
    const {
      status,
      paymentStatus,
      trackingNumber,
      shippingMethod,
      notes,
      shippingAddress,
      billingAddress,
    } = body;

    if (status && status !== order.status) {
      order.status = status as OrderStatus;
      // Timeline event will be auto-added by pre-save hook
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (shippingMethod) order.shippingMethod = shippingMethod;
    if (notes) order.notes = notes;
    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (billingAddress) order.billingAddress = billingAddress;

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("customer.id", "name email")
      .populate("items.productId", "name images");

    return NextResponse.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Update order error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/orders/[id]
 * Cancels an order (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { id } = params;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Users can cancel their own orders, admins can cancel any order
    if (
      decoded.role !== "admin" &&
      order.customer.id.toString() !== decoded.userId
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only allow cancellation if order is pending or processing
    if (!["pending", "processing"].includes(order.status)) {
      return NextResponse.json(
        { error: "Order cannot be cancelled at this stage" },
        { status: 400 }
      );
    }

    order.status = "cancelled";
    order.timeline.push({
      status: "cancelled",
      date: new Date(),
      description: `Order cancelled by ${
        decoded.role === "admin" ? "admin" : "customer"
      }`,
      updatedBy: decoded.userId,
    });

    await order.save();

    return NextResponse.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

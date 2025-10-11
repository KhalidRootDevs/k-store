// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/models/Category";
import connectDB from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const featured = searchParams.get("featured");
    const active = searchParams.get("active");
    const topCategories = searchParams.get("topCategories"); // New parameter

    // Build query
    const query: any = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    // Featured filter
    if (featured !== null && featured !== "all") {
      query.featured = featured === "true";
    }

    // Active filter
    if (active !== null && active !== "all") {
      query.active = active === "true";
    }

    // Top categories filter - get featured and active categories
    if (topCategories === "true") {
      query.featured = true;
      query.active = true;
    }

    const skip = (page - 1) * limit;

    // Get categories with pagination
    const categories = await Category.find(query)
      .sort({ order: 1, createdAt: -1 }) // Sort by order field if you have one
      .skip(skip)
      .limit(limit)
      .select("-__v");

    const total = await Category.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

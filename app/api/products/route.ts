import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/Product";
import connectDB from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const categories =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000");
    const sortBy = searchParams.get("sort") || "featured";
    const featured = searchParams.get("featured");
    const active = searchParams.get("active") || "true";

    // Build query
    const query: any = {};

    // Active products filter
    if (active !== "all") {
      query.active = active === "true";
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Category filter
    if (categories.length > 0) {
      query.categoryId = { $in: categories };
    }

    // Brand filter (if you have brands in your product model)
    // Note: You'll need to add brand field to your Product model
    if (brands.length > 0) {
      query.brand = { $in: brands };
    }

    // Price range filter
    query.price = { $gte: minPrice, $lte: maxPrice };

    // Featured filter
    if (featured !== null && featured !== "all") {
      query.featured = featured === "true";
    }

    const skip = (page - 1) * limit;

    // Build sort object
    let sortOptions: any = {};
    switch (sortBy) {
      case "price-asc":
        sortOptions = { price: 1 };
        break;
      case "price-desc":
        sortOptions = { price: -1 };
        break;
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "best-selling":
        sortOptions = { salesCount: -1 };
        break;
      case "rating":
        sortOptions = { rating: -1 };
        break;
      case "featured":
      default:
        sortOptions = { featured: -1, createdAt: -1 };
        break;
    }

    // Get products with pagination and populate category
    const products = await Product.find(query)
      .populate("categoryId", "name slug")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select("-__v");

    // Get total count for pagination
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get categories and brands for filters (you might want to create separate APIs for these)
    const allCategories = await Product.distinct("categoryId");
    const allBrands = await Product.distinct("brand"); // If you have brand field

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        categories: allCategories,
        brands: allBrands,
        priceRange: {
          min: 0,
          max: 1000, // You might want to calculate this dynamically
        },
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

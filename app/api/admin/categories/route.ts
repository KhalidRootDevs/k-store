import { NextRequest, NextResponse } from "next/server";

import { Category } from "@/models/Category";
import { verifyToken } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import connectDB from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const featured = formData.get("featured") === "true";
    const active = formData.get("active") === "true";
    const imageFile = formData.get("image") as Blob | null;
    const parentCategoryId = formData.get("parentCategoryId") as string | null;

    // Validate required fields
    if (!name || !imageFile) {
      return NextResponse.json(
        { error: "Category name and image are required" },
        { status: 400 }
      );
    }

    // Check if category name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 409 }
      );
    }

    // Validate parent category exists if provided
    if (parentCategoryId) {
      const parentCategory = await Category.findById(parentCategoryId);
      if (!parentCategory) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 404 }
        );
      }
      if (!parentCategory.active) {
        return NextResponse.json(
          { error: "Parent category must be active" },
          { status: 400 }
        );
      }
    }

    // Generate unique slug
    const slug = await Category.generateSlug(name);

    // Upload image to Cloudinary
    let imageUrl = "";
    try {
      const uploadResult = await uploadToCloudinary(imageFile);
      imageUrl = uploadResult.secure_url;
    } catch (uploadError) {
      console.error("Image upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Create category
    const category = await Category.create({
      name,
      description,
      image: imageUrl,
      featured,
      active,
      slug,
      ...(parentCategoryId && { parentCategoryId }),
    });

    return NextResponse.json(
      {
        message: "Category created successfully",
        category: {
          _id: category._id,
          name: category.name,
          description: category.description,
          image: category.image,
          featured: category.featured,
          active: category.active,
          slug: category.slug,
          parentCategoryId: category.parentCategoryId,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create category error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Category with this name or slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const featured = searchParams.get("featured");
    const active = searchParams.get("active");

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

    const skip = (page - 1) * limit;

    // Get categories with pagination
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
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

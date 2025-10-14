import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/models/Category";
import connectDB from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50"); // Increased for hierarchical data
    const search = searchParams.get("search") || "";
    const featured = searchParams.get("featured");
    const active = searchParams.get("active");
    const includeSubCategories =
      searchParams.get("includeSubCategories") === "true";
    const parentId = searchParams.get("parentId"); // null for main categories, specific ID for sub-categories
    const level = searchParams.get("level"); // 0 for main categories, 1 for sub-categories, etc.

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

    // Parent filter - get main categories or specific sub-categories
    if (parentId === "null" || parentId === "") {
      query.parentId = null; // Main categories only
    } else if (parentId) {
      query.parentId = parentId; // Specific sub-categories
    }

    // Level filter (if you want to filter by depth)
    if (level !== null && level !== "") {
      // Note: Your current model doesn't have a level field, but you can calculate it
      // For now, we'll use parentId to determine level
    }

    const skip = (page - 1) * limit;

    // Build population for sub-categories if requested
    let categoriesQuery = Category.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    // If including sub-categories, populate them recursively
    if (includeSubCategories) {
      categoriesQuery = categoriesQuery.populate({
        path: "subCategories",
        match: { active: true }, // Only include active sub-categories
        options: { sort: { name: 1 } },
        populate: {
          path: "subCategories",
          match: { active: true },
          options: { sort: { name: 1 } },
          // You can add more levels here if needed
        },
      });
    } else {
      // Always populate basic parent info
      categoriesQuery = categoriesQuery.populate({
        path: "parentId",
        select: "name slug",
      });
    }

    const categories = await categoriesQuery.exec();
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

// Special endpoint to get category tree
export async function GET_TREE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";
    const maxDepth = parseInt(searchParams.get("maxDepth") || "3");

    // Build base query
    const baseQuery: any = { parentId: null }; // Start with main categories
    if (activeOnly) {
      baseQuery.active = true;
    }

    // Get main categories and populate sub-categories recursively
    const mainCategories = await Category.find(baseQuery)
      .sort({ name: 1 })
      .populate({
        path: "subCategories",
        match: activeOnly ? { active: true } : {},
        options: { sort: { name: 1 } },
        populate:
          maxDepth >= 2
            ? {
                path: "subCategories",
                match: activeOnly ? { active: true } : {},
                options: { sort: { name: 1 } },
                populate:
                  maxDepth >= 3
                    ? {
                        path: "subCategories",
                        match: activeOnly ? { active: true } : {},
                        options: { sort: { name: 1 } },
                      }
                    : undefined,
              }
            : undefined,
      });

    return NextResponse.json({
      categories: mainCategories,
    });
  } catch (error) {
    console.error("Get category tree error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get sub-categories for a specific category
export async function GET_SUBCATEGORIES(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const includeChildren = searchParams.get("includeChildren") === "true";
    const activeOnly = searchParams.get("activeOnly") === "true";

    // Verify parent category exists
    const parentCategory = await Category.findById(params.id);
    if (!parentCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Build query for sub-categories
    const query: any = { parentId: params.id };
    if (activeOnly) {
      query.active = true;
    }

    let subCategoriesQuery = Category.find(query).sort({ name: 1 });

    // If including grandchildren, populate recursively
    if (includeChildren) {
      subCategoriesQuery = subCategoriesQuery.populate({
        path: "subCategories",
        match: activeOnly ? { active: true } : {},
        options: { sort: { name: 1 } },
      });
    }

    const subCategories = await subCategoriesQuery.exec();

    return NextResponse.json({
      parentCategory: {
        _id: parentCategory._id,
        name: parentCategory.name,
        slug: parentCategory.slug,
        image: parentCategory.image,
      },
      subCategories,
    });
  } catch (error) {
    console.error("Get sub-categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get main categories only (no sub-categories)
export async function GET_MAIN_CATEGORIES(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";
    const featuredOnly = searchParams.get("featuredOnly") === "true";

    const query: any = { parentId: null };

    if (activeOnly) {
      query.active = true;
    }

    if (featuredOnly) {
      query.featured = true;
    }

    const mainCategories = await Category.find(query)
      .sort({ name: 1 })
      .select("name slug image description featured active");

    return NextResponse.json({
      categories: mainCategories,
    });
  } catch (error) {
    console.error("Get main categories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get category with full hierarchy (breadcrumb)
export async function GET_CATEGORY_WITH_HIERARCHY(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const category = await Category.findById(params.id)
      .populate({
        path: "parentId",
        select: "name slug parentId",
        populate: {
          path: "parentId",
          select: "name slug parentId",
        },
      })
      .populate({
        path: "subCategories",
        match: { active: true },
        options: { sort: { name: 1 } },
        select: "name slug image active",
      });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Build breadcrumb
    const breadcrumb = [];
    let currentCategory: any = category;

    while (currentCategory) {
      breadcrumb.unshift({
        _id: currentCategory._id,
        name: currentCategory.name,
        slug: currentCategory.slug,
      });

      if (
        currentCategory.parentId &&
        typeof currentCategory.parentId === "object"
      ) {
        currentCategory = currentCategory.parentId;
      } else {
        currentCategory = null;
      }
    }

    return NextResponse.json({
      category,
      breadcrumb,
    });
  } catch (error) {
    console.error("Get category with hierarchy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

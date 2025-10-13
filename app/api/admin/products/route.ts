import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import connectDB from "@/lib/database";

/**
 * POST /api/products
 * Creates a new product with dynamic variant attributes (JSON hybrid model)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    const formData = await request.formData();

    // Basic fields
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const compareAtPrice = formData.get("compareAtPrice")
      ? parseFloat(formData.get("compareAtPrice") as string)
      : undefined;
    const cost = formData.get("cost")
      ? parseFloat(formData.get("cost") as string)
      : undefined;
    const sku = formData.get("sku") as string;
    const barcode = formData.get("barcode") as string;
    const categoryId = formData.get("categoryId") as string;
    const tags = formData.get("tags")
      ? JSON.parse(formData.get("tags") as string)
      : [];
    const stock = parseInt(formData.get("stock") as string);
    const weight = formData.get("weight")
      ? parseFloat(formData.get("weight") as string)
      : undefined;
    const length = formData.get("length")
      ? parseFloat(formData.get("length") as string)
      : undefined;
    const width = formData.get("width")
      ? parseFloat(formData.get("width") as string)
      : undefined;
    const height = formData.get("height")
      ? parseFloat(formData.get("height") as string)
      : undefined;
    const active = formData.get("active") === "true";
    const featured = formData.get("featured") === "true";
    const seo = formData.get("seo")
      ? JSON.parse(formData.get("seo") as string)
      : {};

    // Parse variants JSON
    let variants: any[] = [];
    if (formData.get("variants")) {
      try {
        variants = JSON.parse(formData.get("variants") as string);

        // Ensure correct format: [{ attributes: {...}, price, stock, image }]
        variants = variants.map((v) => ({
          attributes: v.attributes || {},
          price: v.price ? parseFloat(v.price) : undefined,
          stock: v.stock ? parseInt(v.stock) : 0,
          sku: v.sku || undefined,
          image: v.image || undefined,
        }));
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid variants format — must be valid JSON" },
          { status: 400 }
        );
      }
    }

    // Parse uploaded images
    const imageFiles = formData.getAll("images") as File[];

    // Validate required fields
    if (
      !name ||
      !description ||
      !price ||
      !categoryId ||
      imageFiles.length === 0
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Check if SKU or barcode already exists
    if (sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return NextResponse.json(
          { error: "SKU already exists" },
          { status: 409 }
        );
      }
    }

    if (barcode) {
      const existingBarcode = await Product.findOne({ barcode });
      if (existingBarcode) {
        return NextResponse.json(
          { error: "Barcode already exists" },
          { status: 409 }
        );
      }
    }

    // Upload product images to Cloudinary
    const imageUrls: string[] = [];
    for (const imageFile of imageFiles) {
      try {
        const uploadResult = await uploadToCloudinary(imageFile);
        imageUrls.push(uploadResult.secure_url);
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload product images" },
          { status: 500 }
        );
      }
    }

    // Create the product document
    const product = await Product.create({
      name,
      description,
      price,
      compareAtPrice,
      cost,
      sku,
      barcode,
      categoryId,
      tags,
      stock,
      weight,
      length,
      width,
      height,
      active,
      featured,
      variants,
      seo,
      images: imageUrls,
    });

    // Populate category in response
    const populatedProduct = await Product.findById(product._id).populate(
      "categoryId",
      "name slug"
    );

    return NextResponse.json(
      {
        message: "Product created successfully",
        product: populatedProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create product error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "SKU or barcode already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/products
 * Fetches products with pagination, search, and filtering
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const active = searchParams.get("active");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const query: any = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
        { "variants.attributes.color": { $regex: search, $options: "i" } },
        { "variants.attributes.size": { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      query.categoryId = category;
    }

    // Featured filter
    if (featured && featured !== "all") {
      query.featured = featured === "true";
    }

    // Active filter
    if (active && active !== "all") {
      query.active = active === "true";
    }

    // Price filter (handles both product base price and variant prices)
    if (minPrice || maxPrice) {
      query.$or = [
        {
          price: {
            ...(minPrice && { $gte: parseFloat(minPrice) }),
            ...(maxPrice && { $lte: parseFloat(maxPrice) }),
          },
        },
        {
          "variants.price": {
            ...(minPrice && { $gte: parseFloat(minPrice) }),
            ...(maxPrice && { $lte: parseFloat(maxPrice) }),
          },
        },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const products = await Product.find(query)
      .populate("categoryId", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-__v");

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

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
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

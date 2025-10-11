import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVariant {
  name: string;
  options: string;
  price?: number;
  stock?: number;
  sku?: string;
}

export interface ISeo {
  title?: string;
  description?: string;
  keywords?: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku?: string;
  barcode?: string;
  categoryId: mongoose.Types.ObjectId;
  tags: string[];
  stock: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  brand?: string;
  active: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  salesCount: number;
  variants: IVariant[];
  seo: ISeo;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IVariant>({
  name: {
    type: String,
    required: [true, "Variant name is required"],
    trim: true,
  },
  options: {
    type: String,
    required: [true, "Variant options are required"],
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  sku: {
    type: String,
    trim: true,
  },
});

const seoSchema = new Schema<ISeo>({
  title: {
    type: String,
    trim: true,
    maxlength: [60, "SEO title cannot exceed 60 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [160, "SEO description cannot exceed 160 characters"],
  },
  keywords: {
    type: String,
    trim: true,
    maxlength: [255, "SEO keywords cannot exceed 255 characters"],
  },
});

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    cost: {
      type: Number,
      min: 0,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    barcode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock must be a non-negative integer"],
      default: 0,
    },
    weight: {
      type: Number,
      min: 0,
    },
    length: {
      type: Number,
      min: 0,
    },
    width: {
      type: Number,
      min: 0,
    },
    height: {
      type: Number,
      min: 0,
    },
    brand: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    variants: [variantSchema],
    seo: seoSchema,
    images: [
      {
        type: String,
        required: [true, "At least one product image is required"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Generate SKU if not provided
productSchema.pre<IProduct>("save", function (next) {
  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Indexes for efficient queries
productSchema.index({ categoryId: 1, active: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ featured: 1, active: 1 });
productSchema.index({ name: "text", description: "text" });

// Virtual for product slug (if needed)
productSchema.virtual("slug").get(function () {
  return this.name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
});

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  image: string;
  featured: boolean;
  active: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      required: true,
      // Remove unique: true here and define index below
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from name before saving
categorySchema.pre<ICategory>("save", async function (next) {
  if (this.isModified("name")) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingCategory = await mongoose.models.Category?.findOne({
        slug,
      });
      if (!existingCategory || existingCategory._id.equals(this._id)) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

// Static method for slug generation
categorySchema.statics.generateSlug = async function (
  name: string,
  excludeId?: string
): Promise<string> {
  let baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  let slug = baseSlug;
  let counter = 1;

  const query: any = { slug };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  while (await this.findOne(query)) {
    slug = `${baseSlug}-${counter}`;
    query.slug = slug;
    counter++;
  }

  return slug;
};

// Define all indexes explicitly
categorySchema.index({ slug: 1 }, { unique: true }); // Explicit unique index
categorySchema.index({ featured: 1, active: 1 }); // Compound index

export const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);

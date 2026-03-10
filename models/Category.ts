import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  image: string;
  featured: boolean;
  active: boolean;
  slug: string;
  parentCategoryId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  getHierarchyPath(): Promise<string>;
  getChildCategories(): Promise<ICategory[]>;
  getDescendants(): Promise<ICategory[]>;
  getAncestors(): Promise<ICategory[]>;
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
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Validate no circular references before saving
categorySchema.pre<ICategory>("save", async function (next) {
  // Check if category is trying to be its own parent
  if (this.parentCategoryId && this.parentCategoryId.equals(this._id)) {
    throw new Error("A category cannot be its own parent");
  }

  // Check for circular references (parent cannot be a descendant)
  if (this.parentCategoryId) {
    const descendants = await this.getDescendants();
    const descendantIds = descendants.map((d) => d._id.toString());
    if (descendantIds.includes(this.parentCategoryId.toString())) {
      throw new Error("Cannot create circular hierarchy");
    }
  }

  next();
});

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

// Instance methods for hierarchy operations
categorySchema.methods.getHierarchyPath = async function (): Promise<string> {
  const ancestors = await this.getAncestors();
  const path = [...ancestors.map((a) => a.name), this.name];
  return path.join(" → ");
};

categorySchema.methods.getChildCategories = async function (): Promise<
  ICategory[]
> {
  return mongoose.models.Category.find({ parentCategoryId: this._id });
};

categorySchema.methods.getDescendants = async function (): Promise<
  ICategory[]
> {
  const descendants: ICategory[] = [];
  const children = await this.getChildCategories();

  for (const child of children) {
    descendants.push(child);
    const childDescendants = await child.getDescendants();
    descendants.push(...childDescendants);
  }

  return descendants;
};

categorySchema.methods.getAncestors = async function (): Promise<ICategory[]> {
  const ancestors: ICategory[] = [];
  let current = this;

  while (current.parentCategoryId) {
    const parent = await mongoose.models.Category.findById(
      current.parentCategoryId
    );
    if (!parent) break;
    ancestors.unshift(parent);
    current = parent;
  }

  return ancestors;
};

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
categorySchema.index({ parentCategoryId: 1 }); // Index for hierarchy queries
categorySchema.index({ parentCategoryId: 1, active: 1 }); // Compound index for active children

export const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);

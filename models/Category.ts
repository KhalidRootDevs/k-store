import mongoose, { type Document, type Model, Schema } from "mongoose"

export interface ICategory extends Document {
  name: string
  description?: string
  image: string
  featured: boolean
  active: boolean
  slug: string
  parentId?: mongoose.Types.ObjectId
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface ICategoryModel extends Model<ICategory> {
  generateSlug(name: string, excludeId?: string): Promise<string>
}

const categorySchema = new Schema<ICategory, ICategoryModel>(
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
      lowercase: true,
      trim: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for sub-categories
categorySchema.virtual("subCategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parentId",
})

// Generate slug from name before saving
categorySchema.pre<ICategory>("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    let slug = baseSlug
    let counter = 1

    while (true) {
      const existingCategory = await mongoose.models.Category?.findOne({
        slug,
      })
      if (!existingCategory || existingCategory._id.equals(this._id)) {
        break
      }
      slug = `${baseSlug}-${counter}`
      counter++
    }

    this.slug = slug
  }
  next()
})

// Static method for slug generation
categorySchema.statics.generateSlug = async function (name: string, excludeId?: string): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  let slug = baseSlug
  let counter = 1

  const query: any = { slug }
  if (excludeId) {
    query._id = { $ne: excludeId }
  }

  while (await this.findOne(query)) {
    slug = `${baseSlug}-${counter}`
    query.slug = slug
    counter++
  }

  return slug
}

// Define all indexes explicitly
categorySchema.index({ slug: 1 }, { unique: true })
categorySchema.index({ featured: 1, active: 1 })
categorySchema.index({ parentId: 1 })
categorySchema.index({ order: 1 })

export const Category =
  (mongoose.models.Category as ICategoryModel) || mongoose.model<ICategory, ICategoryModel>("Category", categorySchema)

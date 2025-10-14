import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAddress extends Document {
  userId: mongoose.Types.ObjectId;
  label: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    label: {
      type: String,
      required: [true, "Address label is required"],
      trim: true,
      enum: {
        values: ["Home", "Work", "Office", "Other"],
        message: "Label must be Home, Work, Office, or Other",
      },
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, "ZIP code is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      default: "United States",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+?[\d\s\-\(\)]{10,}$/, "Please enter a valid phone number"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one default address per user
addressSchema.pre("save", async function (next) {
  if (this.isDefault) {
    try {
      await this.model("Address").updateMany(
        { userId: this.userId, _id: { $ne: this._id } },
        { $set: { isDefault: false } }
      );
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

// Index for efficient queries
addressSchema.index({ userId: 1, isDefault: 1 });

export const Address: Model<IAddress> =
  mongoose.models.Address || mongoose.model<IAddress>("Address", addressSchema);

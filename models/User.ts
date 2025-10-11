import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Define the role types
export type UserRole = "user" | "admin" | "moderator" | "support";
export type UserStatus = "active" | "inactive" | "suspended" | "pending";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IOrder {
  orderId: mongoose.Types.ObjectId;
  orderNumber: string;
  date: Date;
  total: number;
  status: OrderStatus;
  items: number; // Total quantity of items
  paymentStatus: PaymentStatus;
}

export interface INote {
  content: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  dateOfBirth?: Date;
  addresses: mongoose.Types.ObjectId[];
  orders: IOrder[];
  notes: INote[];
  lastLogin?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  preferences: {
    newsletter: boolean;
    marketing: boolean;
    notifications: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const orderSchema = new Schema<IOrder>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  orderNumber: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ],
    required: true,
    default: "pending",
  },
  items: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    required: true,
    default: "pending",
  },
});

const noteSchema = new Schema<INote>({
  content: {
    type: String,
    required: [true, "Note content is required"],
    trim: true,
    maxlength: [1000, "Note cannot exceed 1000 characters"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]{10,}$/, "Please enter a valid phone number"],
    },
    avatar: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "moderator", "support"],
        message: "Role must be either user, admin, moderator, or support",
      },
      default: "user",
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "suspended", "pending"],
        message: "Status must be active, inactive, suspended, or pending",
      },
      default: "active",
    },
    dateOfBirth: {
      type: Date,
    },
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    orders: [orderSchema],
    notes: [noteSchema],
    lastLogin: {
      type: Date,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    preferences: {
      newsletter: {
        type: Boolean,
        default: true,
      },
      marketing: {
        type: Boolean,
        default: false,
      },
      notifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Update updatedAt for notes when modified
userSchema.pre("save", function (next) {
  if (this.isModified("notes")) {
    this.notes.forEach((note) => {
      if (note.isModified()) {
        note.updatedAt = new Date();
      }
    });
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent password from being returned in queries
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Static method to get user stats
userSchema.statics.getUserStats = async function () {
  const totalUsers = await this.countDocuments();
  const activeUsers = await this.countDocuments({ status: "active" });
  const newUsers = await this.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
  });

  return {
    totalUsers,
    activeUsers,
    newUsers,
    inactiveUsers: totalUsers - activeUsers,
  };
};

// Instance method to add order
userSchema.methods.addOrder = function (
  orderData: Omit<IOrder, "orderId"> & { orderId: mongoose.Types.ObjectId }
) {
  this.orders.push(orderData);
  return this.save();
};

// Instance method to add note
userSchema.methods.addNote = function (
  content: string,
  createdBy: mongoose.Types.ObjectId
) {
  this.notes.push({
    content,
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return this.save();
};

// Index for efficient queries
// Removed duplicate email index - the 'unique: true' in the email field already creates an index
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ "orders.date": -1 });
userSchema.index({ createdAt: -1 });

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

import { Schema, model, type InferSchemaType } from "mongoose";

export const USER_ROLES = ["user", "admin", "sales"] as const;
export type UserRole = typeof USER_ROLES[number];

export const BRANCHES = ["riyadh", "jeddah", "dammam"] as const;
export type Branch = typeof BRANCHES[number];

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 500,
    },
    password: {
      type: String,
      required: false,
      maxlength: 255,
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      default: "user",
    },
    rating: {
      type: Number,
      required: false,
      min: 0,
      max: 5,
    },
    image: {
      type: String,
      required: false,
      trim: true,
      maxlength: 255,
    },
    whatsNumber: {
      type: String,
      required: false,
      trim: true,
      maxlength: 20,
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      maxlength: 20,
    },
    branch: {
      type: String,
      enum: BRANCHES,
      required: false,
    },
   
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("validate", function (next) {
  if (this.role === "sales" && !this.branch) {
    this.invalidate("branch", "Branch is required for sales role");
  }
  next();
});

UserSchema.index({ email: 1 }, { unique: true });

export type User = InferSchemaType<typeof UserSchema> & { _id: unknown };
export const UserModel = model("users", UserSchema);



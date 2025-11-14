import { Schema, model, type InferSchemaType } from "mongoose";

const CoreValueSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    order: {
      type: Number,
      required: false,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by order and active status
CoreValueSchema.index({ order: 1, isActive: 1 });

export type CoreValue = InferSchemaType<typeof CoreValueSchema> & { _id: unknown };
export const CoreValueModel = model("coreValue", CoreValueSchema);


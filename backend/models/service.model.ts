import { Schema, model, type InferSchemaType } from "mongoose";

const ServiceSchema = new Schema(
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
      maxlength: 500,
    },
    backgroundImage: {
      type: String,
      required: true,
      trim: true,
    },
    categoryTags: {
      type: [String],
      required: false,
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10; // Max 10 tags
        },
        message: "Cannot have more than 10 category tags",
      },
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
      default: "EXPLORE",
      maxlength: 100,
    },
    buttonAction: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    additionalText: {
      type: String,
      required: false,
      trim: true,
      maxlength: 2000,
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
ServiceSchema.index({ order: 1, isActive: 1 });

export type Service = InferSchemaType<typeof ServiceSchema> & { _id: unknown };
export const ServiceModel = model("service", ServiceSchema);


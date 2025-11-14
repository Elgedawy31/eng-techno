import { Schema, model, type InferSchemaType } from "mongoose";

const CoreValuesSectionSchema = new Schema(
  {
    label: {
      type: String,
      required: false,
      trim: true,
      maxlength: 200,
      default: "//CORE VALUES",
    },
    heading: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
      default: "At Techno International Group, our work is guided by a set of non-negotiable values that define who we are and how we serve.",
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

export type CoreValuesSection = InferSchemaType<typeof CoreValuesSectionSchema> & { _id: unknown };
export const CoreValuesSectionModel = model("coreValuesSection", CoreValuesSectionSchema);


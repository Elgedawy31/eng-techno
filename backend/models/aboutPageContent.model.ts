import { Schema, model, type InferSchemaType } from "mongoose";

const AboutPageContentSchema = new Schema(
  {
    headline: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
      default: "GLOBAL LEADERS IN DEFENSE & SECURITY SOLUTIONS",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    backgroundImage: {
      type: String,
      required: true,
      trim: true,
    },
    logoImage: {
      type: String,
      required: false,
      trim: true,
    },
    secondDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
      default: "DOWNLOAD COMPANY PROFILE",
      maxlength: 100,
    },
    buttonAction: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },
    companyProfileFile: {
      type: String,
      required: false,
      trim: true,
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

export type AboutPageContent = InferSchemaType<typeof AboutPageContentSchema> & { _id: unknown };
export const AboutPageContentModel = model("aboutPageContent", AboutPageContentSchema);


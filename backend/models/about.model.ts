import { Schema, model, type InferSchemaType } from "mongoose";

const AboutSchema = new Schema(
  {
    label: {
      type: String,
      required: false,
      trim: true,
      maxlength: 200,
      default: "//DEFINING TECHNO",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    button1Text: {
      type: String,
      required: true,
      trim: true,
      default: "EXPLORE",
      maxlength: 100,
    },
    button1Action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    button2Text: {
      type: String,
      required: true,
      trim: true,
      default: "DOWNLOAD COMPANY PROFILE",
      maxlength: 100,
    },
    button2Action: {
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

export type About = InferSchemaType<typeof AboutSchema> & { _id: unknown };
export const AboutModel = model("about", AboutSchema);


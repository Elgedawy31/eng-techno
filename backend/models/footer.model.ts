import { Schema, model, type InferSchemaType } from "mongoose";

const FooterSchema = new Schema(
  {
    mainTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      default: "Contact",
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
      default: "LET'S SHAPE THE FUTURE OF DEFENSE TOGETHER.",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    officeLocations: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
      default: "GET IN TOUCH",
      maxlength: 100,
    },
    buttonAction: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
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

export type Footer = InferSchemaType<typeof FooterSchema> & { _id: unknown };
export const FooterModel = model("footer", FooterSchema);


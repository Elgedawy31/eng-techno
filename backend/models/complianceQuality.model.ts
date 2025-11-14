import { Schema, model, type InferSchemaType } from "mongoose";

const ComplianceQualitySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
      default: "COMPLIANCE & QUALITY ASSURANCE",
    },
    firstDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    logoImage: {
      type: String,
      required: false,
      trim: true,
    },
    displayImage: {
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

export type ComplianceQuality = InferSchemaType<typeof ComplianceQualitySchema> & { _id: unknown };
export const ComplianceQualityModel = model("complianceQuality", ComplianceQualitySchema);


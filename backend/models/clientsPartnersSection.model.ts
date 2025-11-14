import { Schema, model, type InferSchemaType } from "mongoose";

const ClientsPartnersSectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      default: "OUR CLIENTS & PARTNERS",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
      default: "Partnerships are the cornerstone of our success. We collaborate with governments, ministries of defense, and leading defense manufacturers to strengthen security worldwide.",
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

export type ClientsPartnersSection = InferSchemaType<typeof ClientsPartnersSectionSchema> & { _id: unknown };
export const ClientsPartnersSectionModel = model("clientsPartnersSection", ClientsPartnersSectionSchema);


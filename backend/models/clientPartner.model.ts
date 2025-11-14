import { Schema, model, type InferSchemaType } from "mongoose";

const ClientPartnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 2000,
    },
    emblemImage: {
      type: String,
      required: false,
      trim: true,
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

ClientPartnerSchema.index({ order: 1, isActive: 1 });

export type ClientPartner = InferSchemaType<typeof ClientPartnerSchema> & { _id: unknown };
export const ClientPartnerModel = model("clientPartner", ClientPartnerSchema);


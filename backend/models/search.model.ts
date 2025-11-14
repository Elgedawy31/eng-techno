import { Schema, model, type InferSchemaType } from "mongoose";

const SearchSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      default: "SEARCH THE TECHNO NETWORK",
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
      default: "A global defense and security group shaping tomorrow across land, air, and sea.",
    },
    placeholder: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
      default: "What are you looking for? Vehicles, UAVs, Maritime Systems, Support...",
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
      default: "SEARCH",
      maxlength: 100,
    },
    logoImage: {
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

export type Search = InferSchemaType<typeof SearchSchema> & { _id: unknown };
export const SearchModel = model("search", SearchSchema);


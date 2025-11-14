import { Schema, model, type InferSchemaType } from "mongoose";

const BannerSchema = new Schema(
  {
    bannername: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    image_path_lg: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    image_path_small: {
      type: String,
      required: false,
      trim: true,
      maxlength: 255,
      default: null,
    },
    expiration_date: {
      type: Date,
      required: true,
    },
   
  },
  {
    timestamps: true,
  }
);


export type Banner = InferSchemaType<typeof BannerSchema> & { _id: unknown };
export const BannerModel = model("banners", BannerSchema);


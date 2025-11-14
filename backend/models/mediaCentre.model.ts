import { Schema, model, type InferSchemaType } from "mongoose";

const MediaCentreSchema = new Schema(
  {
    mainTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      default: "MEDIA CENTRE / INDUSTRY EVENTS",
    },
    mainDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
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

export type MediaCentre = InferSchemaType<typeof MediaCentreSchema> & { _id: unknown };
export const MediaCentreModel = model("mediaCentre", MediaCentreSchema);


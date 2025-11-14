import { Schema, model, type InferSchemaType } from "mongoose";

const AnnouncementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    tagline: {
      type: String,
      required: false,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    eventLogoImage: {
      type: String,
      required: false,
      trim: true,
    },
    eventDateText: {
      type: String,
      required: false,
      trim: true,
      maxlength: 100,
    },
    boothInfo: {
      type: String,
      required: false,
      trim: true,
      maxlength: 200,
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

// Index for efficient querying by active status
AnnouncementSchema.index({ isActive: 1 });

export type Announcement = InferSchemaType<typeof AnnouncementSchema> & { _id: unknown };
export const AnnouncementModel = model("announcement", AnnouncementSchema);


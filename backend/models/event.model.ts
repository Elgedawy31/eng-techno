import { Schema, model, type InferSchemaType } from "mongoose";

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
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
    detailsButtonText: {
      type: String,
      required: true,
      trim: true,
      default: "VIEW FULL EVENT DETAILS",
      maxlength: 100,
    },
    detailsButtonAction: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    displayImages: {
      type: [String],
      required: false,
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.length <= 10; // Max 10 images per event
        },
        message: "Cannot have more than 10 display images",
      },
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

// Index for efficient querying by order and active status
EventSchema.index({ order: 1, isActive: 1 });

export type Event = InferSchemaType<typeof EventSchema> & { _id: unknown };
export const EventModel = model("event", EventSchema);


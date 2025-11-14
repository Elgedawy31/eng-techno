import { Schema, model, type InferSchemaType } from "mongoose";

const MissionVisionSchema = new Schema(
  {
    missionTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      default: "OUR MISSION",
    },
    missionDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    missionLogoImage: {
      type: String,
      required: false,
      trim: true,
    },
    missionImage: {
      type: String,
      required: false,
      trim: true,
    },
    visionTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      default: "OUR VISION",
    },
    visionDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    visionLogoImage: {
      type: String,
      required: false,
      trim: true,
    },
    visionImage: {
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

export type MissionVision = InferSchemaType<typeof MissionVisionSchema> & { _id: unknown };
export const MissionVisionModel = model("missionVision", MissionVisionSchema);


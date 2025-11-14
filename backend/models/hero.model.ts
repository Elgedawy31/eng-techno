import { Schema, model, type InferSchemaType } from "mongoose";

const HeroSchema = new Schema(
  {
    backgroundImage: {
      type: String,
      required: true,
      trim: true,
    },
    headline: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
      default: "EXPLORE",
      maxlength: 100,
    },
    buttonAction: {
      type: String,
      required: true,
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

export type Hero = InferSchemaType<typeof HeroSchema> & { _id: unknown };
export const HeroModel = model("hero", HeroSchema);



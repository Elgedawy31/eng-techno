import { Schema, model, type InferSchemaType } from "mongoose";

const AboutPageHeroSchema = new Schema(
  {
    backgroundImage: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
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

export type AboutPageHero = InferSchemaType<typeof AboutPageHeroSchema> & { _id: unknown };
export const AboutPageHeroModel = model("aboutPageHero", AboutPageHeroSchema);


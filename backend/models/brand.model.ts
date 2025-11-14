import { Schema, model } from "mongoose";

const BrandSchema = new Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String, required: false },
}, {
  timestamps: true,
});

export const BrandModel = model("brands", BrandSchema);

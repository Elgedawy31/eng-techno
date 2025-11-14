import { Schema, model } from "mongoose";

const CarNameSchema = new Schema({
  name: { type: String, required: true, trim: true },
  brandId: { type: Schema.Types.ObjectId, ref: "brands", required: true },
}, {
  timestamps: true,
});

export const CarNameModel = model("carNames", CarNameSchema);

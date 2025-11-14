import { Schema, model } from "mongoose";

const YearSchema = new Schema({
  value: { type: Number, required: true },
  gradeId: { type: Schema.Types.ObjectId, ref: "grades", required: true },
}, {
  versionKey: false,
});

export const YearModel = model("years", YearSchema);

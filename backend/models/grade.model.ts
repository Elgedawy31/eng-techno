import { Schema, model } from "mongoose";

const GradeSchema = new Schema({
  name: { type: String, required: true, trim: true },
  carNameId: { type: Schema.Types.ObjectId, ref: "carNames", required: true },
}, {
  timestamps: true,
});

export const GradeModel = model("grades", GradeSchema);

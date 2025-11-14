import { Schema, model } from "mongoose";

export const CAR_STATUSES = [
  "available",
  "reserved",
  "sold",
  "maintenance",
] as const;
export type CarStatus = (typeof CAR_STATUSES)[number];

const ChassisSchema = new Schema(
  {
    number: { type: String, required: true, trim: true }, // رقم الشاسيه
    internalColor: { type: String, trim: true },
    externalColor: { type: String, trim: true },
    status: {
      type: String,
      enum: CAR_STATUSES,
      default: "available",
    },
    reservedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      default: "automatic",
    },
    priceCash: { type: Number, required: true },
    priceFinance: { type: Number, required: true },
    engine_capacity: { type: Number, min: 0 },
    fuel_capacity: { type: Number, min: 0 },
    location: { type: String, trim: true, maxlength: 255 },
    seat_type: { type: String, required: false, trim: true, maxlength: 255 },
  },
  { _id: false }
);

const CarSchema = new Schema(
  {
    brandId: { type: Schema.Types.ObjectId, ref: "brands", required: true },
    agentId: { type: Schema.Types.ObjectId, ref: "agents", required: false },
    carNameId: { type: Schema.Types.ObjectId, ref: "carNames", required: true },
    gradeId: { type: Schema.Types.ObjectId, ref: "grades", required: true },
    yearId: { type: Schema.Types.ObjectId, ref: "years", required: true },

    chassis: [ChassisSchema],

    

    images: [{ type: String }],
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export const CarModel = model("cars", CarSchema);

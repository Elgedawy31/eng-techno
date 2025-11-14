import { Schema, model, type InferSchemaType } from "mongoose";

export const REQUEST_TYPES = ["company", "person", "fast"] as const;
export type RequestType = typeof REQUEST_TYPES[number];

export const PAYMENT_METHODS = ["cash", "finance"] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];

const RequestSchema = new Schema(
  {
    type: { type: String, enum: REQUEST_TYPES, required: true },

    customer: {
      companyName: { type: String },
      responsibleName: { type: String },
      responsiblePhone: { type: String },
      name: { type: String },
      phone: { type: String },
      totalSalary: { type: Number },
      bank: { type: String },
      obligations: { type: Number },
    },

    carId: { type: Schema.Types.ObjectId, ref: "cars", required: true },
    chassis: { type: String, default: null },

    quantity: { type: Number, default: 1 },
    paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
    notes: { type: String, trim: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },

    reservationId: { type: Schema.Types.ObjectId, ref: "reservations", default: null },

    branch: { type: String },
  },
  { timestamps: true }
);

RequestSchema.index({ carId: 1 });
RequestSchema.index({ createdBy: 1 });
RequestSchema.index({ reservationId: 1 });

export type Request = InferSchemaType<typeof RequestSchema> & { _id: unknown };
export const RequestModel = model("requests", RequestSchema);

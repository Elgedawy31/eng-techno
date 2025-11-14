import { Schema, model, type InferSchemaType } from "mongoose";

export const RESERVATION_STATUSES = [
  "booking_request",
  "pending_approval",
  "confirmed",
  "rejected",
  "released",
] as const;

export type ReservationStatus = typeof RESERVATION_STATUSES[number];

const ReservationSchema = new Schema(
  {
    carId: { type: Schema.Types.ObjectId, ref: "cars", required: true, index: true },
    customer: { type: String },
    status: { type: String, enum: RESERVATION_STATUSES, required: true, index: true },
    branch: { type: String },

    actions: {
      confirmed: {
        at: Date,
        by: { type: String, trim: true, maxlength: 255 },
      },
      rejected: {
        at: Date,
        by: { type: String, trim: true, maxlength: 255 },
      },
      released: {
        at: Date,
        by: { type: String, trim: true, maxlength: 255 },
      },
    },
  },
  { timestamps: true }
);

ReservationSchema.index({ carId: 1, status: 1 });

export type Reservation = InferSchemaType<typeof ReservationSchema> & { _id: unknown };
export const ReservationModel = model("reservations", ReservationSchema);

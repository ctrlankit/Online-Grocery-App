import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    zone: { type: String, required: true },
    area: { type: String, required: true },
    longitude: { type: String, required: false },
    latitude: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("Location", locationSchema);

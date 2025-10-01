import mongoose  from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    model_type: {
      type: String,
      required: true,
    },
    model_id: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["logo", "image", "etc"],
      default: null,
    },
    path: {
      type: String,
      required: true,
    },
    file_size: {
      type: String,
      default: null,
    },
    created_by: { type: mongoose.Schema.Types.ObjectId},
    updated_by: { type: mongoose.Schema.Types.ObjectId},
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Media", mediaSchema);
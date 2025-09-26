import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const customerSchema = new mongoose.Schema(
  {
    user_name: { type: String },
    email: { type: String, unique: true, index: true },
    phone: { type: Number, required: true, unique: true, index: true },
    otp: { type: Number },
    address: { type: String },
    password: { type: String },
  },
  {
    timestamps: true, // ✅ Correct place for timestamps
  }
);

customerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

customerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Customer", customerSchema);

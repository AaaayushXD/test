import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: String,
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("User", userSchema);

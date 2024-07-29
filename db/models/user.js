import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "player"], default: "player" },
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  bananaClicks: { type: Number, default: 0 },
});

export const User = mongoose.model("User", userSchema);

import mongoose from "mongoose";

const ErrorSchema = new mongoose.Schema({
  message: { type: String, required: true },
  stack: String,
  path: String,
  method: String,
  statusCode: Number,
  createdAt: { type: Date, default: Date.now, expires: "30d" },
});

export default mongoose.model("Error", ErrorSchema);

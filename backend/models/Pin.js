import mongoose from "mongoose";

const PinSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  title: String,
  body: String,
  type: String,
  lat: Number,
  lng: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Pin", PinSchema);

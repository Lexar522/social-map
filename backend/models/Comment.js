import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  pinId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Comment", CommentSchema);

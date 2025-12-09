import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  picture: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);

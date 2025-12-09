import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String },
  eventEndTime: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Place', PlaceSchema);

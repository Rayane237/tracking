import mongoose from 'mongoose';

const portSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    type: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Port', portSchema);

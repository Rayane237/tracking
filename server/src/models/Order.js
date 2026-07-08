import mongoose from 'mongoose';

const coordinateSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const portSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    eta: { type: Date },
    completed: { type: Boolean, default: false },
    coordinates: { type: coordinateSchema, required: true },
  },
  { timestamps: true }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['created', 'processing', 'in_transit', 'at_port', 'customs', 'delivered', 'delayed'],
      default: 'processing',
    },
  },
  { timestamps: true }
);

const vehiclePhotoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: 'Photo véhicule' },
  },
  { _id: true, timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    trackingCode: { type: String, required: true, unique: true, index: true, uppercase: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true },
    vehicle: {
      brand: { type: String, required: true, trim: true },
      model: { type: String, required: true, trim: true },
      year: { type: Number, required: true },
      color: { type: String, required: true, trim: true },
      quantity: { type: Number, default: 1, min: 1 },
      vin: { type: String, trim: true },
    },
    shipment: {
      vesselName: { type: String, required: true, trim: true },
      departurePort: { type: String, required: true, trim: true },
      destinationPort: { type: String, required: true, trim: true },
      destinationCountry: { type: String, required: true, trim: true },
      departureDate: { type: Date },
      estimatedArrivalDate: { type: Date },
    },
    status: {
      type: String,
      enum: ['created', 'processing', 'in_transit', 'at_port', 'customs', 'delivered', 'delayed'],
      default: 'created',
      index: true,
    },
    currentLocation: {
      label: { type: String, required: true, trim: true },
      coordinates: { type: coordinateSchema, required: true },
      updatedAt: { type: Date, default: Date.now },
    },
    route: [portSchema],
    events: [eventSchema],
    photos: [vehiclePhotoSchema],
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);


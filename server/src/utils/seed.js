import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

dotenv.config();

await connectDatabase();

const adminEmail = 'admin@dubaiglobalexpress.com';
let admin = await User.findOne({ email: adminEmail }).select('+password');

if (!admin) {
  admin = new User({
    name: 'Administrateur DGE',
    email: adminEmail,
    password: 'Admin@2026',
    role: 'admin',
  });
} else {
  admin.name = 'Administrateur DGE';
  admin.password = 'Admin@2026';
}

await admin.save();

await Order.findOneAndUpdate(
  { trackingCode: 'DGE-2026-YARIS' },
  {
    trackingCode: 'DGE-2026-YARIS',
    customerName: 'Client Dubai Global Express',
    customerPhone: '+237 690 000 000',
    customerEmail: 'client@example.com',
    vehicle: {
      brand: 'Toyota',
      model: 'Yaris',
      year: 2016,
      color: 'Blanche',
      quantity: 1,
      vin: 'JTDBT923501234567',
    },
    shipment: {
      vesselName: 'MV Transcorp Navigator',
      departurePort: 'Port de Salalah',
      destinationPort: 'Port de Douala',
      destinationCountry: 'Cameroun',
      departureDate: new Date('2026-06-09T18:00:00.000Z'),
      estimatedArrivalDate: new Date('2026-07-22T10:00:00.000Z'),
    },
    status: 'in_transit',
    currentLocation: {
      label: 'Océan Indien - navigation active',
      coordinates: { lat: 6.1, lng: 55.4 },
      updatedAt: new Date(),
    },
    route: [
      {
        name: 'Port de Salalah',
        country: 'Oman',
        eta: new Date('2026-06-09T18:00:00.000Z'),
        completed: true,
        coordinates: { lat: 17.0194, lng: 54.0924 },
      },
      {
        name: 'Port de Djibouti',
        country: 'Djibouti',
        eta: new Date('2026-06-13T09:00:00.000Z'),
        completed: true,
        coordinates: { lat: 11.603, lng: 43.1425 },
      },
      {
        name: 'Canal de Suez',
        country: 'Egypte',
        eta: new Date('2026-06-21T06:00:00.000Z'),
        completed: false,
        coordinates: { lat: 30.5852, lng: 32.2654 },
      },
      {
        name: 'Port de Douala',
        country: 'Cameroun',
        eta: new Date('2026-07-22T10:00:00.000Z'),
        completed: false,
        coordinates: { lat: 4.0511, lng: 9.7679 },
      },
    ],
    events: [
      {
        title: 'Navigation active',
        description: 'Le navire poursuit son trajet vers le prochain port de passage.',
        location: 'Océan Indien',
        status: 'in_transit',
        date: new Date(),
      },
      {
        title: 'Escale confirmée',
        description: 'Passage validé au port de Djibouti.',
        location: 'Port de Djibouti',
        status: 'at_port',
        date: new Date('2026-06-13T09:00:00.000Z'),
      },
      {
        title: 'Départ validé',
        description: 'Le véhicule a été embarqué et le dossier de cargaison est actif.',
        location: 'Port de Salalah',
        status: 'created',
        date: new Date('2026-06-09T18:00:00.000Z'),
      },
    ],
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

console.log('Seed terminé.');
await mongoose.disconnect();

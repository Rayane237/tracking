import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Port from '../models/Port.js';

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

// Seed ports (Côte d'Ivoire, Guinée, Bénin)
const portsToSeed = [
  { name: "Port d'Abidjan", country: "Côte d'Ivoire", coordinates: { lat: 5.3097, lng: -4.0127 } },
  { name: "Port de San-Pedro", country: "Côte d'Ivoire", coordinates: { lat: 4.7458, lng: -6.6413 } },
  { name: "Port de Sassandra", country: "Côte d'Ivoire", coordinates: { lat: 4.95, lng: -6.6667 } },

  { name: "Port autonome de Conakry", country: "Guinée", coordinates: { lat: 9.5456, lng: -13.6810 } },
  { name: "Port de Kamsar", country: "Guinée", coordinates: { lat: 10.6692, lng: -14.6301 } },
  { name: "Port de Boké", country: "Guinée", coordinates: { lat: 10.94, lng: -14.3019 } },

  { name: "Port de Cotonou", country: "Bénin", coordinates: { lat: 6.3602, lng: 2.4186 } },
  { name: "Port de Sèmè-Podji", country: "Bénin", coordinates: { lat: 6.3500, lng: 2.5000 } }
];

for (const p of portsToSeed) {
  await Port.findOneAndUpdate(
    { name: p.name, country: p.country },
    { $set: p },
    { upsert: true, new: true }
  );
}

console.log('Seed des ports terminé.');
console.log('Seed terminé.');
await mongoose.disconnect();


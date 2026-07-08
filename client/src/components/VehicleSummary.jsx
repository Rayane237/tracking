
import { Car, Hash, Palette, Ship, UserRound } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export default function VehicleSummary({ order }) {
  if (!order) return null;

  const vehicle = order.vehicle || {};
  const shipment = order.shipment || {};

  return (
    <section className="overflow-hidden rounded-[2rem] border border-brand-line bg-white shadow-premium">

      <div className="flex flex-col justify-between gap-5 bg-gradient-to-r from-brand-dark to-slate-800 p-6 text-white sm:flex-row sm:items-center">

        <div className="flex items-center gap-4">

          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10">
            <Car size={30} />
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/50">
              Véhicule importé
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {vehicle.brand || 'Marque inconnue'}{' '}
              {vehicle.model || ''}
            </h2>

            <p className="mt-1 text-sm font-semibold text-white/60">
              Année : {vehicle.year || '-'}
            </p>
          </div>

        </div>


        <StatusBadge status={order.status} />

      </div>



      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">

        <InfoCard
          icon={Hash}
          label="Code suivi"
          value={order.trackingCode}
        />


        <InfoCard
          icon={Palette}
          label="Couleur du Vehicule"
          value={vehicle.color}
        />


        <InfoCard
          icon={Ship}
          label="Nom du Navire"
          value={shipment.vesselName}
        />


        <InfoCard
          icon={UserRound}
          label="Nom du Client"
          value={order.customerName}
        />

      </div>

    </section>
  );
}



function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-brand-soft p-4">

      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">

        <Icon
          size={16}
          className="text-brand-red"
        />

        {label}

      </div>


      <p className="mt-3 truncate text-sm font-extrabold text-brand-dark">
        {value || '-'}
      </p>

    </div>
  );
}


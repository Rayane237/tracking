import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ImageIcon } from 'lucide-react';
import http from '../api/http.js';
import Logo from '../components/Logo.jsx';
import RouteMap from '../components/RouteMap.jsx';
import Timeline from '../components/Timeline.jsx';
import VehicleSummary from '../components/VehicleSummary.jsx';
import { seaRoutes } from '../data/seaRoutes.js';

export default function TrackingPage() {
  const { trackingCode } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

 useEffect(() => {
  setLoading(true);

  http
    .get(`/track/${trackingCode}`)
    .then(({ data }) => {
      const fetched = data.order || {};

      if (
        (!fetched.route || fetched.route.length === 0) &&
        fetched.shipment?.destinationPort
      ) {
        const dest = fetched.shipment.destinationPort;
        const clean = dest.trim().toLowerCase();

        let key = "";

        if (clean.includes("lome") || clean.includes("lomé")) key = "Jebel Ali-Lome";
        else if (clean.includes("banana")) key = "Jebel Ali-Banana";
        else if (clean.includes("boma")) key = "Jebel Ali-Boma";
        else if (clean.includes("matadi")) key = "Jebel Ali-Matadi";
        else if (clean.includes("kinshasa")) key = "Jebel Ali-Kinshasa";

        fetched.route = (seaRoutes[key] || []).map(point => ({
          name: point.name,
          country: point.country,
          coordinates: {
            lat: Number(point.coordinates.lat),
            lng: Number(point.coordinates.lng),
          },
        }));
      }

      setOrder(fetched);
    })
    .catch((err) => {
      setError(err.response?.data?.message || "Commande introuvable.");
    })
    .finally(() => {
      setLoading(false);
    });
}, [trackingCode]);
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-brand-soft">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-line border-t-brand-red" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="grid min-h-screen place-items-center bg-brand-soft px-4 text-center">
        <div className="max-w-md rounded-[2rem] border border-brand-line bg-white p-8 shadow-premium">
          <Logo className="mx-auto h-14 w-auto" showText={false} />
          <h1 className="mt-6 text-2xl font-extrabold text-brand-dark">Code introuvable</h1>
          <p className="mt-3 text-slate-600">{error}</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white">
            Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-soft">
      <header className="border-b border-brand-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/">
            <Logo />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-brand-graphite hover:text-brand-red">
            <ArrowLeft size={17} />
            Nouvelle recherche
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <VehicleSummary order={order} />
        <RouteMap order={order} />

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Timeline events={order.events} />
          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-brand-line bg-white p-5 shadow-premium">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-400">
                Livraison
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-brand-dark">
                {order.shipment.destinationPort}
              </h2>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p>
                  <strong className="text-brand-dark">Depart :</strong> {order.shipment.departurePort}
                </p>
                <p>
                  <strong className="text-brand-dark">Destination :</strong>{' '}
                  {order.shipment.destinationCountry}
                </p>
                <p>
                  <strong className="text-brand-dark">Arrivee estimee :</strong>{' '}
                  {order.shipment.estimatedArrivalDate
                    ? new Date(order.shipment.estimatedArrivalDate).toLocaleDateString('fr-FR')
                    : '-'}
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-brand-line bg-white p-5 shadow-premium">
              <div className="flex items-center gap-2">
                <ImageIcon className="text-brand-red" size={20} />
                <h2 className="text-lg font-extrabold text-brand-dark">Photo du vehicule</h2>
              </div>
              <div className="mt-5 grid gap-3">
                {order.photos?.length ? (
                  order.photos.map((photo) => (
                    <img
                      key={photo._id || photo.url}
                      src={photo.url}
                      alt={photo.caption}
                      className="h-44 w-full rounded-2xl object-cover"
                    />
                  ))
                ) : (
                  <div className="rounded-2xl bg-brand-soft p-5 text-sm font-semibold text-slate-500">
                    Aucune photo ajoutee pour le moment.
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}


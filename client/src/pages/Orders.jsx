import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Plus, Search, Trash2 } from 'lucide-react';
import AdminShell from '../components/AdminShell.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import http from '../api/http.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadOrders(search = query) {
    const { data } = await http.get('/orders', { params: { q: search } });
    setOrders(data.orders);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders('');
  }, []);

  async function deleteOrder(id) {
    if (!window.confirm('Supprimer cette commande ?')) return;
    await http.delete(`/orders/${id}`);
    setOrders((current) => current.filter((order) => order._id !== id));
  }

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-brand-red">
            Gestion
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-brand-dark">Commandes</h1>
        </div>
        <Link to="/admin/commandes/nouvelle" className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-sm font-bold text-white shadow-glow">
          <Plus size={17} />
          Ajouter
        </Link>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setLoading(true);
          loadOrders(query);
        }}
        className="mt-6 flex max-w-xl rounded-[1.4rem] border border-brand-line bg-white p-2 shadow-sm"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Code, client, vehicule..."
            className="h-12 w-full rounded-2xl pl-11 pr-3 text-sm font-semibold outline-none"
          />
        </div>
        <button className="rounded-2xl bg-brand-dark px-5 text-sm font-bold text-white">Rechercher</button>
      </form>

      <section className="mt-6 overflow-hidden rounded-[2rem] border border-brand-line bg-white shadow-premium">
        {loading ? (
          <div className="p-6 text-sm font-semibold text-slate-500">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-brand-soft text-xs uppercase tracking-[0.16em] text-slate-400">
                <tr>
                  <th className="px-5 py-4">Code</th>
                  <th>Nom du Client</th>
                  <th>Nom du Vehicule</th>
                  <th>Nom du Navire</th>
                  <th>Destination</th>
                  <th>Statut</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-5 py-4 font-extrabold text-brand-dark">{order.trackingCode}</td>
                    <td className="font-semibold text-slate-600">{order.customerName}</td>
                    <td className="font-semibold text-slate-600">
                      {order.vehicle.brand} {order.vehicle.model} {order.vehicle.year}
                    </td>
                    <td className="font-semibold text-slate-600">{order.shipment.vesselName}</td>
                    <td className="font-semibold text-slate-600">{order.shipment.destinationPort}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/commandes/${order._id}`}
                          className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-dark hover:text-brand-red"
                        >
                          <Edit3 size={17} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteOrder(order._id)}
                          className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-brand-red"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}



import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Ship,
} from 'lucide-react';

import AdminShell from '../components/AdminShell.jsx';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import http from '../api/http.js';


export default function Dashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    http
      .get('/stats/dashboard')
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));

  }, []);



  return (

    <AdminShell>

      <div className="min-h-screen rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6">


        {/* HEADER */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">


          <div>

            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-400">
              Operations maritime
            </p>


            <h1 className="mt-2 text-4xl font-black text-white">
              Tableau de bord
            </h1>


            <p className="mt-2 text-sm font-semibold text-slate-400">
              Gestion des véhicules importés et transports internationaux.
            </p>

          </div>



          <Link

            to="/admin/commandes/nouvelle"

            className="
              rounded-full
              bg-gradient-to-r
              from-red-500
              to-orange-500
              px-6
              py-3
              text-sm
              font-black
              text-white
              shadow-lg
              transition
              hover:scale-105
            "

          >

            Nouvelle commande

          </Link>


        </div>





        {loading ? (

          <div className="mt-10 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />

        ) : (


          <>


            {/* STATISTIQUES */}

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">


              <StatCard
                label="Commandes"
                value={stats.total}
                icon={Package}
                tone="blue"
              />


              <StatCard
                label="En transit"
                value={stats.inTransit}
                icon={Ship}
                tone="cyan"
              />


              <StatCard
                label="Livrées"
                value={stats.delivered}
                icon={CheckCircle2}
                tone="green"
              />


              <StatCard
                label="Retards"
                value={stats.delayed}
                icon={AlertTriangle}
                tone="orange"
              />


            </div>





            {/* TABLEAU */}

            <section
              className="
                mt-8
                overflow-hidden
                rounded-[2rem]
                border
                border-white/10
                bg-white/5
                p-6
                backdrop-blur-xl
              "
            >


              <div className="flex items-center justify-between">


                <h2 className="text-xl font-black text-white">
                  Dernières expéditions
                </h2>



                <Link

                  to="/admin/commandes"

                  className="text-sm font-black text-cyan-400 hover:text-cyan-300"

                >

                  Voir tout

                </Link>


              </div>





              <div className="mt-6 overflow-x-auto">


                <table className="w-full min-w-[720px] text-left text-sm">


                  <thead className="text-xs uppercase tracking-[0.18em] text-slate-500">

                    <tr>

                      <th className="py-3">
                        Code
                      </th>

                      <th>
                        Client
                      </th>

                      <th>
                        Véhicule
                      </th>

                      <th>
                        Destination
                      </th>

                      <th>
                        Statut
                      </th>

                    </tr>

                  </thead>




                  <tbody className="divide-y divide-white/10">


                    {stats.recentOrders.map((order) => (

                      <tr
                        key={order._id}
                        className="transition hover:bg-white/5"
                      >


                        <td className="py-5 font-black text-white">

                          {order.trackingCode}

                        </td>



                        <td className="font-semibold text-slate-300">

                          {order.customerName}

                        </td>



                        <td className="font-semibold text-slate-300">

                          {order.vehicle.brand}{' '}
                          {order.vehicle.model}

                        </td>



                        <td className="font-semibold text-slate-300">

                          {order.shipment.destinationPort}

                        </td>



                        <td>

                          <StatusBadge status={order.status} />

                        </td>


                      </tr>

                    ))}


                  </tbody>


                </table>


              </div>


            </section>


          </>

        )}


      </div>


    </AdminShell>

  );

}

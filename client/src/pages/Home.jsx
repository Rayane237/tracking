import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe2, LockKeyhole, MapPinned, Ship, Truck } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import Logo from '../components/Logo.jsx';
import TrackingSearch from '../components/TrackingSearch.jsx';

export default function Home() {
  const route = [
    [25.2048, 55.2708], // Dubai
    [20.0, 40.0],
    [5.6037, -0.1870], // Afrique
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-cyan-100">

      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/40 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <Link to="/">
            <Logo />
          </Link>

          <Link
            to="/admin/login"
            className="rounded-full bg-brand-dark px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-red"
          >
            Dubai Global Express
          </Link>

        </div>
      </header>


      <main className="relative pt-28">

        <section className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pt-20">


          <motion.div
            initial={{ opacity:0, y:26 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.55 }}
            className="flex flex-col justify-center"
          >

            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-bold text-brand-red shadow-sm">
              <Globe2 size={16}/>
              Logistique internationale de véhicules
            </div>


            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl lg:text-6xl">
              Suivez votre véhicule importé avec précision, clarté et confiance.
            </h1>


            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Entrez le code de suivi fourni par Dubai Global Express pour consulter la position,
              les ports de passage, le statut et l'historique complet de votre commande.
            </p>


            <div className="mt-8">
              <TrackingSearch />
            </div>


          </motion.div>



          <motion.div
            initial={{ opacity:0, y:26 }}
            animate={{ opacity:1, y:0 }}
            transition={{delay:.08,duration:.55}}
            className="relative"
          >

            <div className="rounded-[2.25rem] border border-cyan-200 bg-white p-4 shadow-premium">


              <div className="rounded-[1.8rem] bg-brand-dark p-5 text-white">


                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                      <Ship size={22}/>
                    </div>


                    <div>
                      <p className="text-sm font-extrabold">
                        Suivi en temps reel
                      </p>

                      <p className="text-xs text-white/50">
                        MV Transcorp Navigator
                      </p>
                    </div>

                  </div>


                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-200">
                    Actif
                  </span>


                </div>



                <div className="mt-5 overflow-hidden rounded-[1.4rem]">

                  <MapContainer
                    center={[15,35]}
                    zoom={3}
                    className="h-72 w-full"
                  >

                    <TileLayer
                      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />


                    <Polyline
                      positions={route}
                      color="red"
                      weight={5}
                    />


                    <Marker position={[25.2048,55.2708]}>
                      <Popup>
                        Départ Dubai
                      </Popup>
                    </Marker>


                    <Marker position={[5.6037,-0.1870]}>
                      <Popup>
                        Destination Afrique
                      </Popup>
                    </Marker>


                  </MapContainer>


                </div>


              </div>



              <div className="mt-4 grid gap-3 sm:grid-cols-3">

                <MiniStat icon={Truck} label="Vehicules" value="68"/>

                <MiniStat icon={MapPinned} label="Escales" value="2/10"/>

                <MiniStat icon={LockKeyhole} label="Acces" value="Securisé"/>

              </div>


            </div>


          </motion.div>


        </section>



        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

          <div className="grid gap-4 md:grid-cols-3">

            {[
              ['Tracking unique','Un code genere par commande pour consulter uniquement le dossier concerne.'],
              ['Carte interactive','Ports, trajet maritime, position actuelle et etapes de livraison visibles.'],
              ['Timeline claire','Chaque mise a jour reste archivee pour un suivi transparent.'],
            ].map(([title,text])=>(

              <div key={title} className="rounded-[2rem] border border-cyan-200 bg-white p-6 shadow-sm">

                <div className="mb-5 h-1 w-12 rounded-full bg-brand-red"/>

                <h3 className="text-lg font-extrabold text-brand-dark">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {text}
                </p>

              </div>

            ))}


          </div>


        

        </section>


      </main>


    </div>
  );
}



function MiniStat({icon:Icon,label,value}) {

  return (

    <div className="rounded-2xl bg-cyan-50 p-4">

      <Icon className="text-brand-red" size={18}/>

      <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-extrabold text-brand-dark">
        {value}
      </p>

    </div>

  );
}
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Upload
} from "lucide-react";

import AdminShell from "../components/AdminShell.jsx";
import { seaRoutes } from "../data/seaRoutes.js";
import { ports as availablePorts } from "../data/port.js";
import { statusOptions } from "../data/status.js";
import http from "../api/http.js";


const emptyForm = {

  trackingCode:"",
  customerName:"",
  customerPhone:"",
  customerEmail:"",
  status:"created",

  vehicle:{
    brand:"",
    model:"",
    year:new Date().getFullYear(),
    color:"",
    quantity:1,
    vin:""
  },

  shipment:{
    vesselName:"",
    departurePort:"Jebel Ali",
    destinationPort:"",
    destinationCountry:"",
    departureDate:"",
    estimatedArrivalDate:""
  },

  currentLocation:{
    label:"Port de Jebel Ali",
    coordinates:{
      lat:25.0118,
      lng:55.0612
    }
  },

  route:[],
  events:[],
  notes:""

};



function normalizeOrder(order){

  return {

    ...emptyForm,

    ...order,

    vehicle:{
      ...emptyForm.vehicle,
      ...order.vehicle
    },

    shipment:{
      ...emptyForm.shipment,
      ...order.shipment
    },

    route:order.route || []

  };

}




export default function OrderEditor(){

  const {id}=useParams();

  const isEdit=Boolean(id);

  const navigate=useNavigate();


  const [form,setForm]=useState(emptyForm);

  const [files,setFiles]=useState([]);

  const [saving,setSaving]=useState(false);

  const [loading,setLoading]=useState(isEdit);

  const [error,setError]=useState("");
  const [selectedPort, setSelectedPort] = useState("");



  const title=useMemo(

    ()=>isEdit
    ?
    "Modifier la commande"
    :
    "Nouvelle commande",

    [isEdit]

  );




  useEffect(()=>{

    if(!isEdit)return;


    http.get(`/orders/${id}`)
    .then(({data})=>{

      setForm(normalizeOrder(data.order));

    })
    .finally(()=>setLoading(false));


  },[id,isEdit]);




  function setField(path,value){

    setForm(current=>{

      const next=structuredClone(current);

      const keys=path.split(".");

      let target=next;


      keys
      .slice(0,-1)
      .forEach(k=>{

        target=target[k];

      });


      target[keys[keys.length-1]]=value;


      return next;

    });


  }



  function setRoute(index, path, value){
    setForm(current=>{
      const next = structuredClone(current);
      if(!next.route[index]) return next;
      const keys = path.split(".");
      let target = next.route[index];
      keys.slice(0,-1).forEach(k=>{ target = target[k]; });
      target[keys[keys.length-1]] = value;
      return next;
    });

  }



  function setEvent(index, path, value){
    setForm(current=>{
      const next = structuredClone(current);
      if(!next.events[index]) return next;
      const keys = path.split(".");
      let target = next.events[index];
      keys.slice(0,-1).forEach(k=>{ target = target[k]; });
      target[keys[keys.length-1]] = value;
      return next;
    });

  }




  function changeDestination(destination){
    const selected = availablePorts.find((port) => port.name === destination);
    setForm((current) => ({
      ...current,
      shipment: {
        ...current.shipment,
        destinationPort: destination,
        destinationCountry: selected?.country || current.shipment.destinationCountry,
      },
    }));
    return;

    const clean = destination.trim().toLowerCase();

    let key = '';

    if (clean.includes('lome') || clean.includes('lomé')) key = 'Lome';
    else if (clean.includes('banana')) key = 'Banana';
    else if (clean.includes('boma')) key = 'Boma';
    else if (clean.includes('matadi')) key = 'Matadi';
    else if (clean.includes('kinshasa')) key = 'Kinshasa';

    // Côte d'Ivoire
    else if (clean.includes('abidjan')) key = 'Abidjan';
    else if (clean.includes('san') || clean.includes('san-pedro') || clean.includes('sanpedro')) key = 'San-Pedro';
    else if (clean.includes('sassandra')) key = 'Sassandra';

    // Guinée
    else if (clean.includes('conakry')) key = 'Conakry';
    else if (clean.includes('kamsar')) key = 'Kamsar';
    else if (clean.includes('bok') || clean.includes('boke')) key = 'Boke';
    else if (clean.includes('sangar') || clean.includes('sangaredi')) key = 'Sangaredi';
    else if (clean.includes('coyah')) key = 'Coyah';

    // Bénin
    else if (clean.includes('cotonou')) key = 'Cotonou';
    else if (clean.includes('seme') || clean.includes('s%C3%A8me') || clean.includes('s%C3%A8me-podji')) key = 'Seme-Podji';

    const finalDestination = seaRoutes[key];

    if (!finalDestination) return;

    // build route: base + destination (Jebel Ali-Base has 9 points, plus destination = 10)
    let route = [];
    if (Array.isArray(finalDestination)) route = [...seaRoutes['Jebel Ali-Base'], ...finalDestination];
    else route = [...seaRoutes['Jebel Ali-Base'], finalDestination];

    // format compatible backend
    route = route.map((point) => ({
      name: point.name || '',
      country: point.country || 'International',
      coordinates: { lat: Number(point.coordinates.lat), lng: Number(point.coordinates.lng) },
      completed: Boolean(point.completed),
    }));

    // attempt to infer country for destination when not provided
    const countriesByKey = {
      Lome: 'Togo',
      Banana: 'République Démocratique du Congo',
      Boma: 'République Démocratique du Congo',
      Matadi: 'République Démocratique du Congo',
      Kinshasa: 'République Démocratique du Congo',
      Abidjan: "Côte d'Ivoire",
      'San-Pedro': "Côte d'Ivoire",
      Sassandra: "Côte d'Ivoire",
      Conakry: 'Guinée',
      Kamsar: 'Guinée',
      Boke: 'Guinée',
      Sangaredi: 'Guinée',
      Coyah: 'Guinée',
      Cotonou: 'Bénin',
      'Seme-Podji': 'Bénin',
    };

    const country = countriesByKey[key] || 'International';

    setForm((current) => ({
      ...current,
      shipment: { ...current.shipment, destinationPort: destination, destinationCountry: country },
      route,
    }));

  }



  function addPortToRoute() {
    const port = availablePorts.find((item) => item.name === selectedPort);
    if (!port) return;

    setForm((current) => ({
      ...current,
      route: [
        ...(current.route || []),
        {
          name: port.name,
          country: port.country,
          coordinates: {
            lat: Number(port.coordinates.lat),
            lng: Number(port.coordinates.lng),
          },
          completed: false,
        },
      ],
    }));
    setSelectedPort("");
  }

  function removeRoutePort(index) {
    setForm((current) => ({
      ...current,
      route: current.route.filter((_, routeIndex) => routeIndex !== index),
    }));
  }

  async function generateCode(){

    const {data}=await http.get("/orders/generate-code");


    setField(
      "trackingCode",
      data.trackingCode
    );


  }




  async function submit(e){

    e.preventDefault();


    setSaving(true);

    setError("");


    try{

      console.log("FORMULAIRE ENVOYE AU SERVEUR");
      console.log(JSON.stringify(form, null, 2));


      const cleanForm = {

        ...form,

        route: form.route
        .filter(
          point =>
          point.name &&
          point.coordinates?.lat &&
          point.coordinates?.lng
        )
        .map(point=>({

          name:point.name,

          country:point.country || "International",

          eta:point.eta || "",

          coordinates:{
            lat:Number(point.coordinates.lat),
            lng:Number(point.coordinates.lng)
          },

          completed:Boolean(point.completed)

        }))

      };


      console.log(
        "ROUTE NETTOYEE",
        JSON.stringify(cleanForm.route,null,2)
      );


      const {data}=isEdit

      ?

      await http.put(`/orders/${id}`,cleanForm)

      :

      await http.post("/orders",cleanForm);


      if(files.length){


        const fd=new FormData();


        files.forEach(file=>{

          fd.append("photos",file);

        });


        await http.post(

          `/orders/${data.order._id}/photos`,

          fd,

          {
            headers:{
              "Content-Type":"multipart/form-data"
            }
          }

        );


      }


      navigate("/admin/commandes");


    }

    catch(err){


      setError(

        err.response?.data?.message ||

        "Erreur sauvegarde"

      );


    }

    finally{


      setSaving(false);


    }


  }




  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link to="/admin/commandes" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-red">
            <ArrowLeft size={17} />
            Retour
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold text-brand-dark">{title}</h1>
        </div>
        <button
          type="button"
          onClick={generateCode}
          className="rounded-full bg-brand-dark px-5 py-3 text-sm font-bold text-white"
        >
          Generer un code
        </button>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <section className="rounded-[1rem] border bg-white p-4">
          <h3 className="font-extrabold mb-3">Informations client</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="p-3 rounded-lg border" placeholder="Code de suivi" value={form.trackingCode} onChange={(e)=>setField('trackingCode', e.target.value.toUpperCase())} />
            <input className="p-3 rounded-lg border" placeholder="Nom du client" value={form.customerName} onChange={(e)=>setField('customerName', e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="Téléphone" value={form.customerPhone} onChange={(e)=>setField('customerPhone', e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="Email" type="email" value={form.customerEmail} onChange={(e)=>setField('customerEmail', e.target.value)} />
            <select className="p-3 rounded-lg border" value={form.status} onChange={(e)=>setField('status', e.target.value)}>
              {statusOptions.map(opt=> <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </section>

        <section className="rounded-[1rem] border bg-white p-4">
          <h3 className="font-extrabold mb-3">Véhicule</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <input className="p-3 rounded-lg border" placeholder="Marque" value={form.vehicle.brand} onChange={(e)=>setField('vehicle.brand', e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="Modèle" value={form.vehicle.model} onChange={(e)=>setField('vehicle.model', e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="Année" type="number" value={form.vehicle.year} onChange={(e)=>setField('vehicle.year', e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="Couleur" value={form.vehicle.color} onChange={(e)=>setField('vehicle.color', e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="Quantité" type="number" value={form.vehicle.quantity} onChange={(e)=>setField('vehicle.quantity', e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="VIN / Châssis" value={form.vehicle.vin} onChange={(e)=>setField('vehicle.vin', e.target.value)} />
          </div>
        </section>

        <section className="rounded-[1rem] border bg-white p-4">
          <h3 className="font-extrabold mb-3">Expédition</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="p-3 rounded-lg border" placeholder="Navire" value={form.shipment.vesselName} onChange={(e)=>setField('shipment.vesselName', e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="Port de départ" value={form.shipment.departurePort} onChange={(e)=>setField('shipment.departurePort', e.target.value)} />
            <select className="hidden" value={form.shipment.destinationPort} onChange={(e)=>{ setField('shipment.destinationPort', e.target.value); changeDestination(e.target.value); }} aria-hidden="true" tabIndex={-1}>
              <option value="">Choisir destination</option>
              <option value="Port Autonome de Lomé">Port Autonome de Lomé - Togo</option>
              <option value="Port de Banana">Port de Banana - RDC</option>
              <option value="Port de Boma">Port de Boma - RDC</option>
              <option value="Port de Matadi">Port de Matadi - RDC</option>
              <option value="Port de Kinshasa">Port de Kinshasa - RDC</option>
              <option value="Port d'Abidjan">Port d'Abidjan - Côte d'Ivoire</option>
              <option value="Port de San-Pedro">Port de San-Pedro - Côte d'Ivoire</option>
              <option value="Port de Sassandra">Port de Sassandra - Côte d'Ivoire</option>
              <option value="Port autonome de Conakry">Port autonome de Conakry - Guinée</option>
              <option value="Port de Kamsar">Port de Kamsar - Guinée</option>
              <option value="Port de Boké">Port de Boké - Guinée</option>
              <option value="Port de Sangarédi">Port de Sangarédi - Guinée</option>
              <option value="Port de Coyah">Port de Coyah - Guinée</option>
              <option value="Port de Cotonou">Port de Cotonou - Bénin</option>
              <option value="Port de Sèmè-Podji">Port de Sèmè-Podji - Bénin</option>
            </select>
            <select
              className="p-3 rounded-lg border"
              value={form.shipment.destinationPort}
              onChange={(e) => changeDestination(e.target.value)}
            >
              <option value="">Destination finale : tous les ports africains</option>
              {availablePorts
                .filter((port) => !port.region)
                .map((port) => (
                  <option key={port.name} value={port.name}>
                    {port.name} - {port.country}
                  </option>
                ))}
            </select>
            <input className="p-3 rounded-lg border" placeholder="Pays destination" value={form.shipment.destinationCountry} onChange={(e)=>setField('shipment.destinationCountry', e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="Date départ" type="date" value={form.shipment.departureDate} onChange={(e)=>setField('shipment.departureDate', e.target.value)} />
            <input className="p-3 rounded-lg border" placeholder="Arrivée estimée" type="date" value={form.shipment.estimatedArrivalDate} onChange={(e)=>setField('shipment.estimatedArrivalDate', e.target.value)} />
          </div>
          <div className="mt-3 text-sm text-slate-600">Étapes générées: {form.route?.length || 0}</div>
        </section>

        <section className="rounded-[1rem] border bg-white p-4">
          <h3 className="font-extrabold mb-3">Photos du véhicule</h3>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="mb-3"
          />
          <div className="flex gap-3 flex-wrap mb-3">
            {files.map((f, i) => (
              <div key={i} className="w-28 overflow-hidden rounded-lg border">
                <div className="p-2 text-xs font-semibold">{f.name}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                if (!isEdit) {
                  alert("Sauvegardez la commande d'abord pour téléverser des photos immédiatement.");
                  return;
                }

                if (!files.length) {
                  alert('Aucun fichier sélectionné.');
                  return;
                }

                try {
                  const fd = new FormData();
                  files.forEach((file) => fd.append('photos', file));
                  const { data } = await http.post(`/orders/${id}/photos`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  });
                  setForm(normalizeOrder(data.order));
                  setFiles([]);
                } catch (err) {
                  console.error(err);
                  alert('Erreur lors du téléversement des photos.');
                }
              }}
              className="rounded-full bg-brand-dark px-4 py-2 text-white font-bold"
            >
              Téléverser maintenant
            </button>

            <span className="text-sm text-slate-500">Vous pouvez aussi sauvegarder le formulaire pour téléverser après création.</span>
          </div>

          {form.photos?.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {form.photos.map((p) => (
                <img key={p.url} src={p.url} alt={p.caption} className="h-24 w-full rounded-lg object-cover" />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[1rem] border bg-white p-4">
          <h3 className="font-extrabold mb-3">Ports et escales (étapes)</h3>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <select
              className="min-w-0 flex-1 rounded-lg border p-3"
              value={selectedPort}
              onChange={(e) => setSelectedPort(e.target.value)}
            >
              <option value="">Choisir un port a ajouter au trajet</option>
              {availablePorts.map((port) => (
                <option key={port.name} value={port.name}>
                  {port.name} - {port.country}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addPortToRoute}
              disabled={!selectedPort}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-dark px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} /> Ajouter l'escale
            </button>
          </div>
          <div className="space-y-3">
            {(form.route || []).map((step, idx) => (
              <div key={`${step.name}-${idx}`} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="w-8 h-8 rounded-full bg-brand-soft grid place-items-center font-extrabold">{idx + 1}</div>
                <div className="flex-1">
                  <div className="font-bold">{`Étape ${idx + 1} — ${step.name || ''}`}</div>
                  <div className="text-xs text-slate-600">{step.country}</div>
                  <div className="text-xs text-slate-500">Lat: {step.coordinates?.lat} · Lng: {step.coordinates?.lng}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => removeRoutePort(idx)}
                    className="rounded-full border border-red-200 px-3 py-1 text-xs font-bold text-red-700"
                  >
                    Retirer
                  </button>
                  <label className="flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-brand-dark">
                    <input
                      type="checkbox"
                      checked={Boolean(step.completed)}
                      onChange={async (event) => {
                        const completed = event.target.checked;
                        if (isEdit) {
                          try {
                            const newRoute = (form.route || []).map((routePort, routeIndex) =>
                              routeIndex === idx ? { ...routePort, completed } : routePort
                            );
                            const { data } = await http.put(`/orders/${id}`, { route: newRoute });
                            setForm(normalizeOrder(data.order));
                          } catch (err) {
                            console.error(err);
                            alert("Erreur lors de la mise a jour de l'etape");
                          }
                        } else {
                          setForm((current) => ({
                            ...current,
                            route: current.route.map((routePort, routeIndex) =>
                              routeIndex === idx ? { ...routePort, completed } : routePort
                            ),
                          }));
                        }
                      }}
                      className="h-4 w-4 accent-emerald-600"
                    />
                    Etape terminee
                  </label>
                  <button
                    type="button"
                    onClick={async () => {
                      // If editing existing order, save immediately via API, otherwise update local form
                      if (isEdit) {
                        try {
                          const newRoute = (form.route || []).map((r, i) => (i === idx ? { ...r, completed: true } : r));
                          const { data } = await http.put(`/orders/${id}`, { route: newRoute });
                          setForm(normalizeOrder(data.order));
                        } catch (err) {
                          console.error(err);
                          alert('Erreur lors de la mise à jour de l\'étape');
                        }
                      } else {
                        setForm((cur) => {
                          const next = structuredClone(cur);
                          if (next.route && next.route[idx]) next.route[idx].completed = true;
                          return next;
                        });
                      }
                    }}
                    className="hidden"
                  >
                    {step.completed ? 'Complété' : 'Marquer comme complété'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={()=>{ setForm((c)=>({ ...c, route: [] })); setFiles([]); }} className="rounded-full border px-4 py-2">Réinitialiser</button>
          <button type="submit" disabled={saving} className="rounded-full bg-brand-dark px-6 py-2 text-white font-bold">{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
        </div>
      </form>
    </AdminShell>
  );

}

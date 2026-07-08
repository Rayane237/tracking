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

const clean = destination.trim().toLowerCase();

let key = "";


if(clean.includes("lome") || clean.includes("lomé")){
  key="Lome";
}

else if(clean.includes("banana")){
  key="Banana";
}

else if(clean.includes("boma")){
  key="Boma";
}

else if(clean.includes("matadi")){
  key="Matadi";
}

else if(clean.includes("kinshasa")){
  key="Kinshasa";
}



const finalDestination = seaRoutes[key];


if(!finalDestination){
  return;
}



let route = [

  ...seaRoutes["Jebel Ali-Base"],

  finalDestination

];



// format compatible backend

route = route.map(point=>({

name: point.name || "",

country: point.country || "International",

coordinates:{
lat:Number(point.coordinates.lat),
lng:Number(point.coordinates.lng)
}

}));




let country="";


if(key==="Lome"){

country="Togo";

}
else{

country="République Démocratique du Congo";

}



setForm(current=>({

...current,


shipment:{

...current.shipment,

destinationPort:destination,

destinationCountry:country

},


route

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
        <Section title="Informations client et suivi">
          <Grid>
            <Input label="Code de suivi" value={form.trackingCode} onChange={(value) => setField('trackingCode', value.toUpperCase())} placeholder="Auto si vide" />
            <Input label="Client" value={form.customerName} onChange={(value) => setField('customerName', value)} required />
            <Input label="Telephone" value={form.customerPhone} onChange={(value) => setField('customerPhone', value)} />
            <Input label="Email" value={form.customerEmail} onChange={(value) => setField('customerEmail', value)} type="email" />
            <Select label="Statut" value={form.status} onChange={(value) => setField('status', value)} options={statusOptions} />
          </Grid>
        </Section>

        <Section title="Vehicule">
          <Grid>
            <Input label="Marque" value={form.vehicle.brand} onChange={(value) => setField('vehicle.brand', value)} required />
            <Input label="Modele" value={form.vehicle.model} onChange={(value) => setField('vehicle.model', value)} required />
            <Input label="Annee" type="number" value={form.vehicle.year} onChange={(value) => setField('vehicle.year', value)} required />
            <Input label="Couleur" value={form.vehicle.color} onChange={(value) => setField('vehicle.color', value)} required />
            <Input label="Quantite" type="number" value={form.vehicle.quantity} onChange={(value) => setField('vehicle.quantity', value)} required />
            <Input label="VIN / Chassis" value={form.vehicle.vin} onChange={(value) => setField('vehicle.vin', value)} />
          </Grid>
        </Section>

        <Section title="Expedition">
          <Grid>
            <Input label="Navire" value={form.shipment.vesselName} onChange={(value) => setField('shipment.vesselName', value)} required />
            <Input label="Port de depart" value={form.shipment.departurePort} onChange={(value) => setField('shipment.departurePort', value)} required />
<Select

label="Port destination"

value={form.shipment.destinationPort}

onChange={(value)=>{

setField(
'shipment.destinationPort',
value
);

changeDestination(value);

}}

options={[

{
value:"",
label:"Choisir destination"
},

{
value:"Port Autonome de Lomé",
label:"Port Autonome de Lomé - Togo"
},

{
value:"Port de Banana",
label:"Port de Banana - RDC"
},

{
value:"Port de Boma",
label:"Port de Boma - RDC"
},

{
value:"Port de Matadi",
label:"Port de Matadi - RDC"
},

{
value:"Port de Kinshasa",
label:"Port de Kinshasa - RDC"
}

]}

/>
            <Input label="Pays destination" value={form.shipment.destinationCountry} onChange={(value) => setField('shipment.destinationCountry', value)} required />
            <Input label="Date depart" type="date" value={form.shipment.departureDate} onChange={(value) => setField('shipment.departureDate', value)} />
            <Input label="Arrivee estimee" type="date" value={form.shipment.estimatedArrivalDate} onChange={(value) => setField('shipment.estimatedArrivalDate', value)} />
          </Grid>
        </Section>

        <Section title="Position actuelle">
          <Grid>
            <Input label="Libelle position" value={form.currentLocation.label} onChange={(value) => setField('currentLocation.label', value)} required />
            <Input label="Latitude" type="number" step="any" value={form.currentLocation.coordinates.lat} onChange={(value) => setField('currentLocation.coordinates.lat', value)} required />
            <Input label="Longitude" type="number" step="any" value={form.currentLocation.coordinates.lng} onChange={(value) => setField('currentLocation.coordinates.lng', value)} required />
          </Grid>
        </Section>

        <Section
          title="Ports et escales"
          action={
            <button
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  route: [
                    ...current.route,
                    { name: '', country: '', eta: '', coordinates: { lat: '', lng: '' }, completed: false },
                  ],
                }))
              }
              className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-xs font-bold text-white"
            >
              <Plus size={15} />
              Ajouter
            </button>
          }
        >
          <div className="space-y-3">
            {form.route.map((port, index) => (
              <div key={`${port.name}-${index}`} className="grid gap-3 rounded-2xl bg-brand-soft p-4 md:grid-cols-6">
                <Input label="Port" value={port.name} onChange={(value) => setRoute(index, 'name', value)} />
                <Input label="Pays" value={port.country} onChange={(value) => setRoute(index, 'country', value)} />
                <Input label="ETA" type="date" value={port.eta} onChange={(value) => setRoute(index, 'eta', value)} />
                <Input label="Lat" type="number" step="any" value={port.coordinates.lat} onChange={(value) => setRoute(index, 'coordinates.lat', value)} />
                <Input label="Lng" type="number" step="any" value={port.coordinates.lng} onChange={(value) => setRoute(index, 'coordinates.lng', value)} />
                <label className="flex items-end gap-2 text-sm font-bold text-brand-graphite">
                  <input
                    type="checkbox"
                    checked={Boolean(port.completed)}
                    onChange={(event) => setRoute(index, 'completed', event.target.checked)}
                    className="mb-3 h-5 w-5 rounded border-brand-line text-brand-red focus:ring-brand-red"
                  />
                  Complete
                </label>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Historique"
          action={
            <button
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  events: [
                    {
                      title: '',
                      description: '',
                      location: '',
                      status: current.status,
                      date: new Date().toISOString().slice(0, 16),
                    },
                    ...current.events,
                  ],
                }))
              }
              className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-xs font-bold text-white"
            >
              <Plus size={15} />
              Ajouter
            </button>
          }
        >
          <div className="space-y-3">
            {form.events.length === 0 && (
              <p className="rounded-2xl bg-brand-soft p-4 text-sm font-semibold text-slate-500">
                Aucun evenement. Ajoute une mise a jour pour alimenter la timeline client.
              </p>
            )}
            {form.events.map((event, index) => (
              <div key={event._id || index} className="rounded-2xl bg-brand-soft p-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <Input label="Titre" value={event.title} onChange={(value) => setEvent(index, 'title', value)} />
                  <Input label="Lieu" value={event.location} onChange={(value) => setEvent(index, 'location', value)} />
                  <Input label="Date" type="datetime-local" value={event.date} onChange={(value) => setEvent(index, 'date', value)} />
                  <Select label="Statut" value={event.status} onChange={(value) => setEvent(index, 'status', value)} options={statusOptions} />
                </div>
                <textarea
                  value={event.description}
                  onChange={(e) => setEvent(index, 'description', e.target.value)}
                  placeholder="Description de la mise a jour"
                  className="mt-3 min-h-24 w-full rounded-2xl border border-brand-line bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-brand-red focus:ring-4 focus:ring-red-100"
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Photos du vehicule">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-line bg-brand-soft p-8 text-center hover:border-brand-red">
            <Upload className="text-brand-red" size={28} />
            <span className="mt-3 text-sm font-extrabold text-brand-dark">
              Televerser des photos JPG, PNG ou WEBP
            </span>
            <span className="mt-1 text-xs font-semibold text-slate-500">
              {files.length ? `${files.length} fichier(s) selectionne(s)` : 'Maximum 8 images'}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => setFiles(Array.from(event.target.files || []))}
            />
          </label>
        </Section>

        {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-brand-red">{error}</p>}

        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-glow disabled:opacity-70"
          >
            <Save size={18} />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}

function Section({ title, action, children }) {
  return (
    <section className="rounded-[2rem] border border-brand-line bg-white p-5 shadow-premium">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-brand-dark">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

function Input({ 
  label, 
  value, 
  onChange, 
  onBlur,
  type = 'text', 
  required = false, 
  step, 
  placeholder 
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-brand-graphite">{label}</span>
      <input
  type={type}
  step={step}
  value={value ?? ''}
  onChange={(event) => onChange(event.target.value)}
  onBlur={(event) => onBlur && onBlur(event.target.value)}
  required={required}
  placeholder={placeholder}
  className="mt-2 h-12 w-full rounded-2xl border border-brand-line bg-white px-4 text-sm font-semibold outline-none transition focus:border-brand-red focus:ring-4 focus:ring-red-100"
/>
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-brand-graphite">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-brand-line bg-white px-4 text-sm font-semibold outline-none transition focus:border-brand-red focus:ring-4 focus:ring-red-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

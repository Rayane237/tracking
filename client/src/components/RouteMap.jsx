import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer
} from "react-leaflet";


// Icône navire SVG intégrée
const SHIP_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">

<defs>
  <linearGradient id="sea" x1="0" x2="0" y2="1">
    <stop stop-color="#0077C8"/>
    <stop offset="1" stop-color="#003B73"/>
  </linearGradient>
</defs>


<!-- coque -->
<path
d="M15 70 L105 70 L90 95 Q60 110 30 95 Z"
fill="#0B1F3A"
/>


<!-- ligne rouge coque -->
<path
d="M25 82 Q60 95 95 82"
stroke="#E30613"
stroke-width="5"
fill="none"
/>


<!-- superstructure -->
<rect
x="42"
y="35"
width="38"
height="35"
rx="3"
fill="white"
/>


<!-- passerelle -->
<rect
x="50"
y="22"
width="22"
height="15"
fill="#D9EAF7"
/>


<!-- fenêtres -->
<rect
x="55"
y="27"
width="5"
height="5"
fill="#0057B8"
/>

<rect
x="63"
y="27"
width="5"
height="5"
fill="#0057B8"
/>


<!-- conteneurs -->
<rect x="30" y="52" width="12" height="12" fill="#0057B8"/>
<rect x="45" y="52" width="12" height="12" fill="#E30613"/>
<rect x="60" y="52" width="12" height="12" fill="#F5A623"/>
<rect x="75" y="52" width="12" height="12" fill="#0057B8"/>


<!-- vague -->
<path
d="M10 100 Q30 90 50 100 T90 100 T120 100"
stroke="#00AEEF"
stroke-width="5"
fill="none"
/>

</svg>
`;



const PORT_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">

<circle
cx="32"
cy="32"
r="28"
fill="#0057B8"
/>

<path
fill="#ffffff"
d="
M32 10
c-4 0-7 3-7 7
v18
h-9
l16 18
16-18
h-9
V17
c0-4-3-7-7-7
z
"
/>

</svg>
`;





function createMapIcon({
  image,
  title,
  subtitle,
  size = 40
}) {


return L.divIcon({

className:"",


html:`

<div style="

display:flex;

flex-direction:column;

align-items:center;

transform:translateY(-8px);

">


<div style="

width:${size}px;

height:${size}px;

">

${image}

</div>



<div style="

margin-top:4px;

background:white;

padding:3px 7px;

border-radius:6px;

font-size:9px;

font-weight:700;

white-space:nowrap;

text-align:center;

box-shadow:
0 2px 6px rgba(0,0,0,.25);

">


${title || ""}



${
subtitle
?
`

<div style="

color:#E30613;

font-size:8px;

">

${subtitle}

</div>

`
:
""
}



</div>



</div>

`,


iconSize:[100,85],


iconAnchor:[50,45]


});


}







function createSeaRoute(points){


const result=[];


points.forEach((point,index)=>{


result.push(point);



if(index < points.length-1){


const next=points[index+1];


result.push([

(point[0]+next[0])/2 + 1,

(point[1]+next[1])/2

]);


}


});


return result;


}


function getLastCompletedPort(ports){


return [...ports]
.reverse()
.find(port=>Boolean(port.completed));


}





export default function RouteMap({order}){


if(
!order ||
!order.currentLocation ||
!order.currentLocation.coordinates
){

return null;

}




const current=[

Number(order.currentLocation.coordinates.lat),

Number(order.currentLocation.coordinates.lng)

];





const ports = [

...(order.route || [])

]

.filter(point =>

point.name &&

point.country &&

point.coordinates &&

point.coordinates.lat !== "" &&

point.coordinates.lng !== "" &&

!isNaN(Number(point.coordinates.lat)) &&

!isNaN(Number(point.coordinates.lng))

)

.map(point => ({

...point,

position:[

Number(point.coordinates.lat),

Number(point.coordinates.lng)

]

}));





const routePoints=ports.map(

port=>port.position

);

const lastCompletedPort=getLastCompletedPort(ports);


const shipPosition=lastCompletedPort?.position || current;








return (


<section

className="

overflow-hidden

rounded-[2rem]

border

bg-white

shadow-premium

"

>



<MapContainer

center={
 ports.length
 ?
 ports[Math.floor(ports.length/2)].position
 :
 current
}

zoom={3}




>



<TileLayer

url="
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
"

/>





{

routePoints.length>1 &&


<Polyline


positions={createSeaRoute(routePoints)}


pathOptions={{

color:"#0057B8",

weight:4,

opacity:0.85,

dashArray:"10 8"

}}


/>


}








{

ports.map((port,index)=>(


<Marker


key={index}


position={port.position}


icon={createMapIcon({

image:PORT_ICON,

title:port.name,

subtitle:port.country,

size:38

})}


/>


))


}









<Marker


position={shipPosition}


icon={createMapIcon({

image:SHIP_ICON,

title:
order.shipment?.vesselName || "Navire",

subtitle:
`IMO ${order.shipment?.vesselNumber || ""}`,

size:65

})}


/>






</MapContainer>


</section>


);


}

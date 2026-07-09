import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";

const SHIP_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="hull" x1="0" x2="1">
      <stop stop-color="#07192f"/>
      <stop offset=".55" stop-color="#102f55"/>
      <stop offset="1" stop-color="#07192f"/>
    </linearGradient>
    <linearGradient id="deck" x1="0" x2="0" y2="1">
      <stop stop-color="#ffffff"/>
      <stop offset="1" stop-color="#dbe8f5"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#0B1F3A" flood-opacity=".25"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <path d="M12 69 H108 L98 91 H29 C22 91 17 86 15 80 Z" fill="url(#hull)"/>
    <path d="M22 78 H98" stroke="#e30613" stroke-width="4" stroke-linecap="round"/>
    <path d="M34 51 H78 V69 H28 V57 C28 54 31 51 34 51 Z" fill="url(#deck)"/>
    <path d="M52 34 H86 V69 H52 Z" fill="#f8fbff"/>
    <path d="M60 22 H82 V36 H60 Z" fill="#e9f3fb"/>
    <path d="M63 27 H68 M73 27 H78 M59 42 H65 M69 42 H75 M79 42 H85" stroke="#0b5fa5" stroke-width="4" stroke-linecap="round"/>
    <rect x="31" y="57" width="11" height="10" fill="#0057b8"/>
    <rect x="45" y="57" width="11" height="10" fill="#e30613"/>
    <rect x="59" y="57" width="11" height="10" fill="#f5a623"/>
    <rect x="73" y="57" width="11" height="10" fill="#0057b8"/>
    <path d="M15 96 C28 89 41 103 54 96 C67 89 80 103 93 96 C101 92 108 92 115 96" stroke="#00aeef" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
</svg>
`;

const PORT_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="28" fill="#0057B8"/>
  <path fill="#ffffff" d="M32 10 c-4 0-7 3-7 7 v18 h-9 l16 18 16-18 h-9 V17 c0-4-3-7-7-7 z"/>
</svg>
`;

function createMapIcon({ image, title, subtitle, badge, size = 40 }) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        transform:translateY(-8px);
      ">
        ${
          badge
            ? `
              <div style="
                margin-bottom:3px;
                background:#7f1d1d;
                color:white;
                padding:2px 7px;
                border-radius:999px;
                font-size:8px;
                font-weight:900;
                letter-spacing:.08em;
                box-shadow:0 2px 6px rgba(0,0,0,.2);
              ">
                ${badge}
              </div>
            `
            : ""
        }

        <div style="width:${size}px;height:${size}px;">
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
          box-shadow:0 2px 6px rgba(0,0,0,.25);
        ">
          ${title || ""}
          ${
            subtitle
              ? `
                <div style="color:#E30613;font-size:8px;">
                  ${subtitle}
                </div>
              `
              : ""
          }
        </div>
      </div>
    `,
    iconSize: [100, 92],
    iconAnchor: [50, 48],
  });
}

function createShipIcon({ image, size = 46 }) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        align-items:center;
        transform:translateY(-58px);
      ">
        <div style="
          width:${size}px;
          height:${size}px;
          display:grid;
          place-items:center;
          background:rgba(255,255,255,.94);
          border:1px solid rgba(11,31,58,.18);
          border-radius:14px;
          box-shadow:0 10px 22px rgba(11,31,58,.25);
        ">
          <div style="width:${size - 8}px;height:${size - 8}px;">
            ${image}
          </div>
        </div>
        <div style="
          width:0;
          height:0;
          border-left:7px solid transparent;
          border-right:7px solid transparent;
          border-top:10px solid #0B1F3A;
          filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));
        "></div>
      </div>
    `,
    iconSize: [86, 124],
    iconAnchor: [43, 124],
  });
}

function createSeaRoute(points) {
  const result = [];

  points.forEach((point, index) => {
    result.push(point);

    if (index < points.length - 1) {
      const next = points[index + 1];
      result.push([(point[0] + next[0]) / 2 + 1, (point[1] + next[1]) / 2]);
    }
  });

  return result;
}

function getLastCompletedPortIndex(ports) {
  return ports.reduce(
    (lastIndex, port, index) => (Boolean(port.completed) ? index : lastIndex),
    -1
  );
}

export default function RouteMap({ order }) {
  if (!order?.currentLocation?.coordinates) {
    return null;
  }

  const current = [
    Number(order.currentLocation.coordinates.lat),
    Number(order.currentLocation.coordinates.lng),
  ];

  const ports = [...(order.route || [])]
    .filter(
      (point) =>
        point.name &&
        point.country &&
        point.coordinates &&
        point.coordinates.lat !== "" &&
        point.coordinates.lng !== "" &&
        !Number.isNaN(Number(point.coordinates.lat)) &&
        !Number.isNaN(Number(point.coordinates.lng))
    )
    .map((point) => ({
      ...point,
      position: [Number(point.coordinates.lat), Number(point.coordinates.lng)],
    }));

  const routePoints = ports.map((port) => port.position);
  const lastCompletedPortIndex = getLastCompletedPortIndex(ports);
  const lastCompletedPort =
    lastCompletedPortIndex >= 0 ? ports[lastCompletedPortIndex] : null;
  const shipPosition = lastCompletedPort?.position || current;

  const completedRoutePoints =
    lastCompletedPortIndex > 0
      ? routePoints.slice(0, lastCompletedPortIndex + 1)
      : [];
  const remainingRoutePoints =
    lastCompletedPortIndex >= 0
      ? routePoints.slice(lastCompletedPortIndex)
      : routePoints;

  return (
    <section className="overflow-hidden rounded-[2rem] border bg-white shadow-premium">
      <MapContainer
        center={ports.length ? ports[Math.floor(ports.length / 2)].position : current}
        zoom={3}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {remainingRoutePoints.length > 1 && (
          <Polyline
            positions={createSeaRoute(remainingRoutePoints)}
            pathOptions={{
              color: "#0057B8",
              weight: 4,
              opacity: 0.85,
              dashArray: "10 8",
            }}
          />
        )}

        {completedRoutePoints.length > 1 && (
          <Polyline
            positions={createSeaRoute(completedRoutePoints)}
            pathOptions={{
              color: "#7f1d1d",
              weight: 5,
              opacity: 0.95,
            }}
          />
        )}

        <Marker
          position={shipPosition}
          zIndexOffset={900}
          icon={createShipIcon({
            image: SHIP_ICON,
            size: 58,
          })}
        />

        {ports.map((port, index) => (
          <Marker
            key={`${port.name}-${index}`}
            position={port.position}
            zIndexOffset={500}
            icon={createMapIcon({
              image: PORT_ICON,
              title: port.name,
              subtitle: port.country,
              badge:
                index === 0
                  ? "DEPART"
                  : index === ports.length - 1
                    ? "FIN"
                    : "",
              size: 38,
            })}
          />
        ))}
      </MapContainer>
    </section>
  );
}

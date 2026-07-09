import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";

const SHIP_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="sea" x1="0" x2="0" y2="1">
      <stop stop-color="#0077C8"/>
      <stop offset="1" stop-color="#003B73"/>
    </linearGradient>
  </defs>
  <path d="M15 70 L105 70 L90 95 Q60 110 30 95 Z" fill="#0B1F3A"/>
  <path d="M25 82 Q60 95 95 82" stroke="#E30613" stroke-width="5" fill="none"/>
  <rect x="42" y="35" width="38" height="35" rx="3" fill="white"/>
  <rect x="50" y="22" width="22" height="15" fill="#D9EAF7"/>
  <rect x="55" y="27" width="5" height="5" fill="#0057B8"/>
  <rect x="63" y="27" width="5" height="5" fill="#0057B8"/>
  <rect x="30" y="52" width="12" height="12" fill="#0057B8"/>
  <rect x="45" y="52" width="12" height="12" fill="#E30613"/>
  <rect x="60" y="52" width="12" height="12" fill="#F5A623"/>
  <rect x="75" y="52" width="12" height="12" fill="#0057B8"/>
  <path d="M10 100 Q30 90 50 100 T90 100 T120 100" stroke="#00AEEF" stroke-width="5" fill="none"/>
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
        transform:translateY(-10px);
      ">
        <div style="
          width:${size}px;
          height:${size}px;
          display:grid;
          place-items:center;
          background:linear-gradient(180deg,#ffffff 0%,#eef6ff 100%);
          border:2px solid #0B1F3A;
          border-radius:999px;
          box-shadow:0 8px 18px rgba(11,31,58,.28);
        ">
          <div style="width:${size - 12}px;height:${size - 12}px;">
            ${image}
          </div>
        </div>
        <div style="
          width:0;
          height:0;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-top:8px solid #0B1F3A;
          filter:drop-shadow(0 2px 2px rgba(0,0,0,.18));
        "></div>
      </div>
    `,
    iconSize: [70, 68],
    iconAnchor: [35, 68],
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
          zIndexOffset={300}
          icon={createShipIcon({
            image: SHIP_ICON,
            size: 46,
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

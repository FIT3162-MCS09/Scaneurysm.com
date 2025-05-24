// src/pages/DoctorLocator.tsx
// -----------------------------------------------------------------------------
// Leaflet + OpenStreetMap implementation (no paid keys)
// i18n namespace: “doctorLocator”
// -----------------------------------------------------------------------------
import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { useTranslation } from "react-i18next";

import SidebarPatient from "../components/SidebarPatient";
import ProfileButton   from "../components/ProfileButton";

import "leaflet/dist/leaflet.css";
import "./DoctorLocator.css";

/* ---------- patch default marker icons (CRA/Vite) -------------------------- */
delete (L.Icon.Default as any).prototype._getIconUrl;       // eslint-disable-line
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl:       require("leaflet/dist/images/marker-icon.png"),
  shadowUrl:     require("leaflet/dist/images/marker-shadow.png"),
});

/* ------------------------- sample data (static) ---------------------------- */
interface Hospital {
  id: number;
  name: string;
  position: LatLngExpression;
  address: string;
  phone?: string;
}

const hospitals: Hospital[] = [
  {
    id: 1,
    name: "University Hospital of Kuala Lumpur",
    position: [3.1201, 101.6544],
    address: "Jalan Universiti, 56000 Kuala Lumpur, Malaysia",
    phone: "+60 3-1234 5678",
  },
  {
    id: 2,
    name: "Penang General Hospital – Neuro Unit",
    position: [5.4151, 100.3288],
    address: "Jalan Residensi, 10450 George Town, Penang",
    phone: "+60 4-8765 4321",
  },
  {
    id: 3,
    name: "Johor Specialist Centre (Brain & Spine)",
    position: [1.486, 103.7615],
    address: "39B Jalan Abdul Samad, 80100 Johor Bahru",
    phone: "+60 7-3344 0556",
  },
];

/* ---------------- centre map on user location ----------------------------- */
const Locate: React.FC = () => {
  const map = useMap();
  const { t } = useTranslation("doctorLocator");

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here: LatLngExpression = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        map.setView(here, 11);
        L.marker(here, {
          icon: L.icon({
            iconUrl:
              "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
            iconSize: [12, 12],
          }),
        })
          .addTo(map)
          .bindPopup(t("youAreHere"))
          .openPopup();
      },
      () => console.log("Geolocation denied – using default centre")
    );
  }, [map, t]);

  return null;
};

/* ========================================================================== */
const DoctorLocator: React.FC = () => {
  const { t } = useTranslation("doctorLocator");
  const defaultPosition: LatLngExpression = [4.2, 102.0]; // Malaysia fallback

  return (
    <div className="dashboard-container">
      {/* ─── fixed sidebar ─── */}
      <SidebarPatient />

      {/* ─── main pane ─── */}
      <div className="main-content page-wrapper p-6 space-y-6">
        <ProfileButton />

        <h1 className="text-3xl font-semibold text-center text-[#1c3334] mb-2">
          {t("title")}
        </h1>

        <p className="text-center text-gray-600 max-w-xl mx-auto">
          {t("subtitle")}
        </p>

        <MapContainer
          center={defaultPosition}
          zoom={6}
          scrollWheelZoom
          style={{ height: "70vh", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
          />

          <Locate />

          {hospitals.map((h) => (
            <Marker key={h.id} position={h.position}>
              <Popup>
                <h3 className="font-semibold">{h.name}</h3>
                <p className="text-sm">{h.address}</p>
                {h.phone && <p className="text-sm">☎ {h.phone}</p>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="text-center text-sm text-gray-500">
          {t("footerNote")}
        </div>
      </div>
    </div>
  );
};

export default DoctorLocator;
import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Configure Leaflet default icon
delete (L.Icon.Default as any).prototype._getIconUrl;             // eslint-disable-line
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl:       require("leaflet/dist/images/marker-icon.png"),
    shadowUrl:     require("leaflet/dist/images/marker-shadow.png"),
});

// Hospital preview card with map
const HospitalPreviewCard: React.FC<{
  t: any;
  navigate: (path: string) => void;
}> = ({ t, navigate }) => (
  <div
    className="hospital-card full-width"
    role="button"
    tabIndex={0}
    onClick={() => navigate("/find-hospital")}
    onKeyDown={(e) => e.key === "Enter" && navigate("/find-hospital")}
  >
    <span className="hospital-card-label">
      <i className="fas fa-hospital-alt" />{" "}
      {t("Find Nearby Hospitals")}
    </span>

    <MapContainer
      center={[4.2, 102.0]}
      zoom={5}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={false}
      attributionControl={false}
      zoomControl={false}
      style={{
        height: "200px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[3.1201, 101.6544]} />
      <Marker position={[5.4151, 100.3288]} />
      <Marker position={[1.486, 103.7615]} />
    </MapContainer>
  </div>
);

export default HospitalPreviewCard;

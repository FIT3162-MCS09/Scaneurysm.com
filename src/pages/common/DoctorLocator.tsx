
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

import SidebarPatient from "../../components/SidebarPatient";
import ProfileButton   from "../../components/ProfileButton";

import "leaflet/dist/leaflet.css";
import "./DoctorLocator.css";

/* ---------- patch default marker icons (CRA/Vite) -------------------------- */
delete (L.Icon.Default as any).prototype._getIconUrl;       // eslint-disable-line
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl:       require("leaflet/dist/images/marker-icon.png"),
  shadowUrl:     require("leaflet/dist/images/marker-shadow.png"),
});

/* ----------------------------- data model ---------------------------------- */
interface Hospital {
  id: number;
  name: string;
  position: LatLngExpression;
  address: string;
  phone?: string;
  website?: string;
  specialists?: string[];
}

/* ------------------------------- dataset ----------------------------------- */
const hospitals: Hospital[] = [
  {
    id: 1,
    name: "Hospital Kuala Lumpur (HKL)",
    position: [3.1718832, 101.7002186],
    address: "Jalan Pahang, 50586 Kuala Lumpur",
    phone: "+603 2615 5555",
    website: "http://www.hkl.gov.my",
    specialists: [
      "Dr. Azmi Alias (Consultant Neurosurgeon)",
      "Dr. Thinesh Kumaran (Consultant Neurosurgeon)",
    ],
  },
  {
    id: 2,
    name: "Hospital Canselor Tuanku Muhriz UKM (HCTM UKM)",
    position: [3.098434, 101.726122],
    address: "Jalan Yaacob Latif, Bandar Tun Razak, 56000 Cheras, Kuala Lumpur",
    phone: "+603 9145 5555",
    website: "http://hctm.ukm.my",
    specialists: [
      "Prof. Datuk Dr. Sabarul Afian Mokhtar",
      "Dr. Azlan Helmy Abd Samat",
    ],
  },
  {
    id: 3,
    name: "University Malaya Medical Centre (UMMC)",
    position: [3.1137182, 101.6529117],
    address: "Jalan Universiti, Lembah Pantai, 59100 Kuala Lumpur",
    phone: "+603 7949 4422",
    website: "https://www.ummc.edu.my",
    specialists: [
      "Dr. Vickneswaran Mathaneswaran (Visiting)",
      "Dr. Daniel Rajesh Babbu",
    ],
  },
  {
    id: 4,
    name: "Hospital Ampang",
    position: [3.1278409, 101.763899],
    address: "Jalan Mewah Utara, Pandan Mewah, 68000 Ampang, Selangor",
    phone: "+603 4289 6000",
    website: "http://jknselangor.moh.gov.my/hampg/",
    specialists: [
      "Dato’ Dr. Sukumar S. (Neurosurgeon)",
      "Dr. Mohammed Azman Raffiq (Neurosurgeon)",
    ],
  },
  {
    id: 5,
    name: "Hospital Selayang",
    position: [3.2429, 101.6464],
    address: "Selayang-Kepong Highway, 68100 Batu Caves, Selangor",
    phone: "+603 6126 3333",
    specialists: [
      "Dr. Syed Abdul Aziz Jamaluddin",
      "Dr. Mohd Farizal Ahmad",
    ],
  },
  {
    id: 6,
    name: "Hospital Sungai Buloh",
    position: [3.21972, 101.59944],
    address: "Jalan Hospital, 47000 Sungai Buloh, Selangor",
    phone: "+603 6145 4333",
    website: "http://hsgbuloh.moh.gov.my",
    specialists: [
      "Dr. Mohd Khairi Md. Nor",
      "Dr. Nur Ashikin Othman",
    ],
  },
  {
    id: 7,
    name: "Hospital Tengku Ampuan Rahimah, Klang",
    position: [3.020833, 101.439167],
    address: "Jalan Langat, 41200 Klang, Selangor",
    phone: "+603 3375 7000",
    specialists: [
      "Dr. Gunasegaran Thangaveloo",
      "Dr. Badrisyah Idris",
    ],
  },
  {
    id: 8,
    name: "Hospital Shah Alam",
    position: [3.0736, 101.5254],
    address: "Persiaran Kayangan, Seksyen 7, 40000 Shah Alam, Selangor",
    phone: "+603 5526 3000",
    specialists: [
      "Dr. Mohd Khairul Anuar Ahmad",
      "Dr. Nurul Huda Zainudin",
    ],
  },
  {
    id: 9,
    name: "Hospital Serdang",
    position: [2.976217, 101.7201],
    address: "Jalan Puchong, 43000 Kajang, Selangor",
    phone: "+603 8947 5555",
    specialists: [
      "Dato’ Dr. Kamalanathan Palaniandy",
      "Dr. Khairul Muhsein Abdullah",
    ],
  },
  {
    id: 10,
    name: "Pantai Hospital Kuala Lumpur",
    position: [3.1196886, 101.6668451],
    address: "No. 8, Jalan Bukit Pantai, 59100 Kuala Lumpur",
    phone: "+603 2296 0888",
    website: "https://www.pantai.com.my/kuala-lumpur",
    specialists: [
      "Dr. Selvapragasam Thambar",
      "Dr. Muruga Kumar Rajoo",
    ],
  },
  {
    id: 11,
    name: "Gleneagles Hospital Kuala Lumpur",
    position: [3.160557, 101.718633],
    address: "282 & 286, Jalan Ampang, 50450 Kuala Lumpur",
    phone: "+603 4257 1300",
    website: "https://www.gleneagles.com.my/kuala-lumpur",
    specialists: [
      "Dr. Chee Chee Pin",
      "Dr. B. Gunasekaran (Visiting)",
    ],
  },
  {
    id: 12,
    name: "Prince Court Medical Centre",
    position: [3.150032, 101.721928],
    address: "39, Jalan Kia Peng, 50450 Kuala Lumpur",
    phone: "+603 2160 0000",
    website: "https://www.princecourt.com",
    specialists: [
      "Dato’ Dr. Kantha Rasalingam",
      "Dato’ Dr. Jagdeep Singh Nanra",
    ],
  },
  {
    id: 13,
    name: "Pantai Hospital Ampang (Pantai Pandan Indah)",
    position: [3.1428, 101.7516],
    address: "Jalan Pandan Indah, 55100 Kuala Lumpur",
    phone: "+603 4288 8181",
    website: "https://www.pantai.com.my/ampang",
    specialists: [
      "Dr. Sukumar Sinnasamy",
      "Dr. Mohammed Azman Raffiq",
    ],
  },
  {
    id: 14,
    name: "Sunway Medical Centre, Subang Jaya",
    position: [3.06626, 101.6091],
    address: "5, Jalan Lagoon Selatan, 47500 Subang Jaya, Selangor",
    phone: "+603 7491 9191",
    website: "https://www.sunwaymedical.com",
    specialists: [
      "Dr. Eddy Leong Kok Wah",
      "Dr. Cheang Chee Keong",
    ],
  },
  {
    id: 15,
    name: "Subang Jaya Medical Centre (SJMC)",
    position: [3.07364, 101.593314],
    address: "No. 1, Jalan SS12/1A, 47500 Subang Jaya, Selangor",
    phone: "+603 5639 1212",
    website: "https://www.subangjayamedicalcentre.com",
    specialists: [
      "Dr. Gurmit Singh Gill",
      "Dr. Selvam R.",
    ],
  },
  {
    id: 16,
    name: "KPJ Damansara Specialist Hospital",
    position: [3.1379248, 101.6277395],
    address: "119, Jalan SS 20/10, 47400 Petaling Jaya, Selangor",
    phone: "+603 7718 1000",
    website: "https://www.kpjdamansara.com",
    specialists: [
      "Datuk Dr. Johari Siregar Adnan",
      "Dato’ Dr. Zurin Adnan",
    ],
  },
  {
    id: 17,
    name: "KPJ Ampang Puteri Specialist Hospital",
    position: [3.1600132, 101.752138],
    address: "No. 1, Jalan Mamanda 9, 68000 Ampang, Selangor",
    phone: "+603 4289 5000",
    website: "https://www.kpjampangputeri.com",
    specialists: [
      "Dr. Abdul Muin Ishak",
      "Dr. Ng Wei Ping",
    ],
  },
  {
    id: 18,
    name: "Thomson Hospital Kota Damansara",
    position: [3.1576, 101.5753],
    address: "11, Jalan Teknologi, PJU 5, 47810 Petaling Jaya, Selangor",
    phone: "+603 6287 1111",
    website: "https://thomsonhospitals.com",
    specialists: [
      "Dr. Mohamed Yusof Bin Abdullah",
      "Dr. Navin Kumar Baskaran",
    ],
  },
  {
    id: 19,
    name: "Ara Damansara Medical Centre (ADMC)",
    position: [3.11455, 101.5767],
    address: "Lot 2, Jalan Lapangan Terbang Subang, 47200 Subang",
    phone: "+603 7839 9222",
    website: "https://www.ramsaysimedarby.com/ara-damansara",
    specialists: [
      "Dr. Chin Kin Fah",
      "Dr. Ramesh Kumar Kulasegarah",
    ],
  },
  {
    id: 20,
    name: "Assunta Hospital, Petaling Jaya",
    position: [3.0935875, 101.6437113],
    address: "Jalan Templer, 46990 Petaling Jaya, Selangor",
    phone: "+603 7872 3000",
    website: "https://www.assunta.com.my",
    specialists: [
      "Dr. Mohd Nazri Mohamed",
      "Dr. Andrew Chan Lai Thong",
    ],
  },
  {
    id: 21,
    name: "Sri Kota Specialist Medical Centre, Klang",
    position: [3.0419, 101.4435],
    address: "Jalan Mohet, 41000 Klang, Selangor",
    phone: "+603 3375 7799",
    website: "https://www.srikotamedical.com",
    specialists: [
      "Dr. Kiren Jegathesan",
      "Dr. G. Surenthiraraj",
    ],
  },
  {
    id: 22,
    name: "Avisena Specialist Hospital, Shah Alam",
    position: [3.073603, 101.525442],
    address: "No. 1, Jalan Kompleks, Seksyen 14, 40000 Shah Alam, Selangor",
    phone: "+603 5511 7733",
    website: "https://avisena.com.my",
    specialists: [
      "Dr. Paramaswaran Suppiah",
      "Dr. Nor Fazilah Omar",
    ],
  },
  {
    id: 23,
    name: "MSU Medical Centre, Shah Alam (MSUMC)",
    position: [3.0604, 101.5039],
    address: "Persiaran Damai, Seksyen 14, 40100 Shah Alam, Selangor",
    phone: "+603 5526 2600",
    website: "https://www.msumedicalcentre.com",
    specialists: [
      "Dr. Mohd Zainal Abidin Abd Jalil",
      "Dr. Fong Keh Weng",
    ],
  },
  {
    id: 24,
    name: "ParkCity Medical Centre, Kuala Lumpur",
    position: [3.1975, 101.6269],
    address: "No. 2, Jalan Intisari, Desa ParkCity, 52200 Kuala Lumpur",
    phone: "+603 6279 3222",
    website: "https://parkcitymedicalcentre.com",
    specialists: [
      "Dr. Mohamad Faris Zainul Abidin",
      "Dr. Lim Ee Peng",
    ],
  },
  {
    id: 25,
    name: "Beacon Hospital, Petaling Jaya",
    position: [3.1045, 101.6263],
    address: "No. 1, Jalan 215, Off Jalan Templer, 46050 Petaling Jaya",
    phone: "+603 7793 8888",
    website: "https://www.beaconhospital.com.my",
    specialists: [
      "Dr. Voon Kiong Toh (Gamma Knife)",
      "Dr. Arvindran Nair",
    ],
  },
  {
    id: 26,
    name: "Pantai Hospital Klang",
    position: [3.033, 101.434],
    address: "Lot 5921, Persiaran Raja Muda Musa, 41200 Klang, Selangor",
    phone: "+603 3258 5500",
    website: "https://www.pantai.com.my/klang",
    specialists: [
      "Dr. Gunasegaran Thangaveloo",
      "Dr. Yim Khai Wong",
    ],
  },
  {
    id: 27,
    name: "Pantai Hospital Cheras",
    position: [3.0894, 101.7442],
    address: "Jalan 1/96A, Taman Cheras Makmur, 56100 Kuala Lumpur",
    phone: "+603 9145 2888",
    website: "https://www.pantai.com.my/cheras",
    specialists: [
      "Dr. Vasan Sinnadurai",
      "Dr. Puteri Liyana Megat Ahmad",
    ],
  },
  {
    id: 28,
    name: "Tung Shin Hospital, Kuala Lumpur",
    position: [3.1457, 101.7064],
    address: "102, Jalan Pudu, 55100 Kuala Lumpur",
    phone: "+603 2037 2288",
    website: "https://www.tungshin.com.my",
    specialists: [
      "Dr. Cheang Chee Keong",
      "Dr. Lim Swee Hoong",
    ],
  },
  {
    id: 29,
    name: "Columbia Asia Hospital – Puchong",
    position: [3.024123, 101.622205],
    address: "No. 1, Lebuh Puteri, 47100 Puchong, Selangor",
    phone: "+603 8064 8688",
    website: "https://www.columbiaasia.com/puchong",
    specialists: [
      "Dato’ Dr. Jegan Thanabalan (Visiting)",
      "Dr. Vickneswaran Mathaneswaran (Visiting)",
    ],
  },
  {
    id: 30,
    name: "Sunway Medical Centre Velocity (SMCV), KL",
    position: [3.1305, 101.7278],
    address: "Lingkaran SV, Sunway Velocity, 55100 Kuala Lumpur",
    phone: "+603 9772 9191",
    website: "https://www.sunwaymedicalvelocity.com.my",
    specialists: [
      "Dr. Charanjit Singh Sidhu",
      "Dr. Mohd Amin Mahmud",
    ],
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
            attribution="© OpenStreetMap contributors"
          />

          <Locate />

          {hospitals.map((h) => (
            <Marker key={h.id} position={h.position}>
              <Popup>
                <h3 className="font-semibold">{h.name}</h3>
                <p className="text-sm">{h.address}</p>
                {h.phone && <p className="text-sm">☎ {h.phone}</p>}
                {h.website && (
                  <p className="text-sm">
                    <a href={h.website} target="_blank" rel="noopener noreferrer">
                      Website
                    </a>
                  </p>
                )}
                {h.specialists && (
                  <>
                    <p className="text-sm font-semibold mt-2">Specialists:</p>
                    <ul className="list-disc pl-4 text-sm">
                      {h.specialists.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
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
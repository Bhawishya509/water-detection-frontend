import React, { useEffect } from "react";
import mapCss from "./Map.module.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux"; // Redux

// Component to dynamically update map center
const UpdateMapCenter = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom()); // Update map center dynamically
  }, [center, map]);

  return null;
};

const Map = () => {
  const locationLatLon = useSelector((state) => state.location.value); // Get location from Redux


  return (
    <main className={mapCss.map_main_container}>
      <MapContainer
        className={mapCss.map_box}
        center={locationLatLon} // Initial center
        zoom={12} // Initial zoom level
      >
        <TileLayer
          attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UpdateMapCenter center={locationLatLon} />
        <Marker position={locationLatLon}/>
      </MapContainer>
    </main>
  );
};

export default Map;

import React, { useEffect } from "react";
import mapCss from "./Map.module.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ForceResize = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  return null;
};

const Map = () => {
  return (
    <>
      <main className={mapCss.map_main_container}>
        <MapContainer
          className={mapCss.map_box}
          center={[24.9142734,84.1862208]}
          zoom={15}
        >
          <TileLayer
            attribution=' <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ForceResize />
        </MapContainer>
      </main>
    </>
  );
};

export default Map;

import React, { useEffect } from "react";
import mapCss from "./Map.module.css";
import { MapContainer, Marker, TileLayer, useMap ,Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux"; // Redux
import { Icon } from "leaflet";
// Component to dynamically update map center
const UpdateMapCenter = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom()) // Update map center dynamically
  }, [center, map]);

  return null;
};

const Map = () => {
  const locationLatLon = useSelector((state) => state.location.value); // Get location from Redux

  const cityname = useSelector((state) => state.location.city_and_near_loction_name); 

  const value=[24.9142734,84.1862208]

  console.log(locationLatLon);
  console.log(cityname);

  //  this is for point on to the map so i create custom icon

  let icons_style = new Icon({
    iconUrl:"pointer2.png",
    iconSize: [38, 38]
  })

  // console.log(locationLatLon[0].lat, locationLatLon[0].lon)
  return (
    <main className={mapCss.map_main_container}>
      
   
      <MapContainer
        className={mapCss.map_box}
        center={[locationLatLon[0].lat,locationLatLon[0].lon]} // Initial center
        zoom={12} // Initial zoom level
      >
        <TileLayer
          attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UpdateMapCenter center={[locationLatLon[0].lat, locationLatLon[0].lon]} />
        
        {locationLatLon.map((item, index) =>
          {
            return (
              
              <Marker key={index} position={[item.lat,item.lon]} icon={icons_style}>
              <Popup>
                <h2>{cityname[index]}</h2>
              </Popup>
            </Marker>
            )
          })}

       
      </MapContainer>
    </main>
  );
};

export default Map;
